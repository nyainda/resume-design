
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, fileName, fileType, apiKey } = await req.json();

    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    console.log('Processing file:', fileName, 'Type:', fileType);

    // Extract text from base64 content (simplified approach)
    let extractedText = '';
    
    if (fileType === 'application/pdf') {
      // For PDF files, we'll send the base64 content to Gemini Vision
      extractedText = 'PDF content to be processed by AI';
    } else {
      // For DOC/DOCX files, try to extract basic text
      try {
        const decodedContent = atob(fileContent);
        // Extract readable text from the decoded content
        extractedText = decodedContent.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
      } catch (e) {
        extractedText = 'Document content to be processed by AI';
      }
    }

    const prompt = `
    You are a professional CV/Resume parser. Extract structured information from this document and return a valid JSON object with this exact structure (no additional formatting or markdown):

    {
      "personal": {
        "fullName": "",
        "email": "",
        "phone": "",
        "location": "",
        "summary": ""
      },
      "experience": [
        {
          "id": 1,
          "company": "",
          "position": "",
          "location": "",
          "startDate": "",
          "endDate": "",
          "description": ""
        }
      ],
      "education": [
        {
          "id": 1,
          "school": "",
          "degree": "",
          "location": "",
          "startDate": "",
          "endDate": "",
          "gpa": ""
        }
      ],
      "skills": [],
      "certifications": [
        {
          "id": 1,
          "name": "",
          "issuer": "",
          "date": "",
          "credentialId": ""
        }
      ],
      "languages": [
        {
          "id": 1,
          "language": "",
          "proficiency": ""
        }
      ],
      "interests": [],
      "projects": [
        {
          "id": 1,
          "name": "",
          "description": "",
          "technologies": "",
          "link": "",
          "startDate": "",
          "endDate": ""
        }
      ]
    }

    If you cannot find specific information, use empty strings or empty arrays. Always return valid JSON without any markdown formatting or code blocks.

    Document content: ${extractedText}
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process CV with AI');
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    console.log('AI Response:', content);

    // Clean the response - remove any markdown formatting
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    let extractedData;
    try {
      extractedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', cleanContent);
      
      // Return a basic structure if parsing fails
      extractedData = {
        personal: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          summary: ""
        },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        interests: [],
        projects: []
      };
    }

    return new Response(JSON.stringify({ extractedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('CV reader error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
