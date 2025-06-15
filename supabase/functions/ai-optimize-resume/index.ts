
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData } = await req.json();

    if (!resumeData) {
      throw new Error('Resume data is required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume optimization AI. Analyze the provided resume data and suggest improvements for:
1. Professional summary optimization
2. Experience descriptions enhancement
3. Skills optimization
4. ATS-friendly formatting suggestions

Return ONLY valid JSON with the optimized data structure that matches the input format.`
          },
          {
            role: 'user',
            content: `Optimize this resume data for better ATS compatibility and professional appeal:

${JSON.stringify(resumeData, null, 2)}

Return optimized data with the same structure but improved content. Focus on:
- Action verbs and quantifiable achievements in experience
- ATS-friendly keyword integration
- Professional summary enhancement
- Skills prioritization based on market demand`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const optimizedData = JSON.parse(content);
      return new Response(JSON.stringify(optimizedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI');
    }

  } catch (error) {
    console.error('Error in ai-optimize-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
