
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { PDFGenerator } from "./pdf-generator.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackedEmailRequest {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  emailContent: string;
  resumeData: any;
  trackingId: string;
  trackingUrl: string;
  senderName: string;
  senderEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting send-tracked-resume function");
    
    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      throw new Error("Email service not configured - missing API key");
    }
    console.log("Resend API key found");

    const requestData: TrackedEmailRequest = await req.json();
    const {
      recipientEmail,
      recipientName,
      subject,
      emailContent,
      resumeData,
      trackingId,
      trackingUrl,
      senderName,
      senderEmail
    } = requestData;

    console.log("Processing email request:", { 
      recipientEmail, 
      subject, 
      trackingId,
      senderEmail,
      senderName,
      hasResumeData: !!resumeData
    });

    // Validate required data
    if (!resumeData) {
      console.error("Resume data is missing from request");
      throw new Error("Resume data is required");
    }

    if (!recipientEmail || !senderEmail || !senderName) {
      console.error("Missing required email fields:", { recipientEmail, senderEmail, senderName });
      throw new Error("Missing required email information");
    }

    // Generate PDF resume with error handling
    let pdfBuffer: Uint8Array;
    try {
      console.log("Generating PDF...");
      pdfBuffer = await PDFGenerator.generatePDFBuffer(resumeData);
      console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError);
      throw new Error("Failed to generate PDF");
    }

    // Create tracking pixel HTML (invisible)
    const trackingPixel = `<img src="${trackingUrl}/pixel.png" width="1" height="1" style="display:none;" />`;
    
    // Clean, professional HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="white-space: pre-line; margin-bottom: 30px;">${emailContent}</div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
          <p>Best regards,<br>${senderName}<br>${senderEmail}</p>
        </div>
        
        ${trackingPixel}
      </body>
      </html>
    `;

    console.log("Sending email via Resend...");
    const emailResponse = await resend.emails.send({
      from: `${senderName} <onboarding@resend.dev>`,
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
      text: emailContent,
      reply_to: senderEmail,
      attachments: [
        {
          filename: `${senderName.replace(/\s+/g, '_')}_Resume.pdf`,
          content: Array.from(pdfBuffer),
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      trackingId,
      message: "Email sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-tracked-resume function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
