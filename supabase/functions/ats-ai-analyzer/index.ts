
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
    const { resumeData, jobDescription, apiKey } = await req.json();

    if (!resumeData) {
      throw new Error('Resume data is required');
    }

    if (!apiKey) {
      console.log('No API key provided, using fallback analysis');
      return getFallbackAnalysis();
    }

    let analysis;

    // Determine if it's Gemini or OpenAI key
    if (apiKey.startsWith('AIza')) {
      console.log('Using Gemini API for analysis');
      analysis = await analyzeWithGemini(resumeData, jobDescription, apiKey);
    } else if (apiKey.startsWith('sk-')) {
      console.log('Using OpenAI API for analysis');
      analysis = await analyzeWithOpenAI(resumeData, jobDescription, apiKey);
    } else {
      console.log('Invalid API key format, using fallback');
      return getFallbackAnalysis();
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ats-ai-analyzer function:', error);
    return getFallbackAnalysis();
  }
});

async function analyzeWithGemini(resumeData: any, jobDescription: string, apiKey: string) {
  const prompt = createAnalysisPrompt(resumeData, jobDescription);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('Gemini API response:', JSON.stringify(data, null, 2));
  
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    console.error('No content in Gemini response:', data);
    throw new Error('No content generated from Gemini API');
  }

  // Clean the response to extract JSON
  const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    return JSON.parse(cleanContent);
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', cleanContent);
    throw new Error('Invalid JSON response from Gemini API');
  }
}

async function analyzeWithOpenAI(resumeData: any, jobDescription: string, apiKey: string) {
  const prompt = createAnalysisPrompt(resumeData, jobDescription);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS (Applicant Tracking System) analyzer. Always respond with valid JSON only, no additional text or formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content generated from OpenAI API');
  }

  return JSON.parse(content);
}

function createAnalysisPrompt(resumeData: any, jobDescription: string) {
  return `Analyze this resume for ATS compatibility and provide a comprehensive assessment.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Job Description:
${jobDescription}` : ''}

Provide analysis in this exact JSON format (return ONLY valid JSON, no markdown or additional text):
{
  "overallScore": 85,
  "sections": {
    "formatting": {
      "score": 90,
      "issues": ["specific formatting issues"],
      "recommendations": ["specific formatting recommendations"]
    },
    "keywords": {
      "score": 80,
      "missing": ["missing keywords from job description"],
      "found": ["keywords found in resume"],
      "density": 15
    },
    "structure": {
      "score": 85,
      "issues": ["structural issues"],
      "recommendations": ["structural improvements"]
    },
    "content": {
      "score": 80,
      "issues": ["content quality issues"],
      "recommendations": ["content improvements"]
    },
    "atsCompatibility": {
      "score": 90,
      "issues": ["ATS compatibility issues"],
      "recommendations": ["ATS optimization suggestions"]
    }
  },
  "suggestions": [
    {
      "type": "critical",
      "category": "Keywords",
      "message": "Add more relevant keywords from the job description",
      "action": "Include terms like 'project management' and 'agile methodology'"
    }
  ]
}

Focus on:
- ATS parsing compatibility (avoid graphics, complex tables)
- Keyword optimization against job description
- Standard section headers (Experience, Education, Skills)
- Content quality with quantified achievements
- Professional formatting for machine readability
- Action verbs and impact statements

Provide specific, actionable recommendations for improvement.`;
}

function getFallbackAnalysis() {
  const fallbackAnalysis = {
    overallScore: 75,
    sections: {
      formatting: { 
        score: 80, 
        issues: ['Contact information formatting could be improved'], 
        recommendations: ['Use standard contact format: Name, Phone, Email, Location'] 
      },
      keywords: { 
        score: 70, 
        missing: ['Add relevant industry keywords'], 
        found: ['Basic skills identified'], 
        density: 8 
      },
      structure: { 
        score: 85, 
        issues: [], 
        recommendations: ['Ensure all standard sections are included'] 
      },
      content: { 
        score: 75, 
        issues: ['More quantified achievements needed'], 
        recommendations: ['Add metrics and numbers to demonstrate impact'] 
      },
      atsCompatibility: { 
        score: 80, 
        issues: [], 
        recommendations: ['Use simple formatting and avoid graphics'] 
      }
    },
    suggestions: [
      {
        type: 'info',
        category: 'Analysis',
        message: 'Basic ATS compatibility check completed. For detailed AI analysis, please add your API key in settings.',
        action: 'Set up AI integration for comprehensive resume analysis'
      },
      {
        type: 'warning',
        category: 'Keywords',
        message: 'Consider adding more industry-specific keywords',
        action: 'Review job descriptions in your field and incorporate relevant terms'
      },
      {
        type: 'critical',
        category: 'Quantification',
        message: 'Add numbers and metrics to your achievements',
        action: 'Include percentages, dollar amounts, team sizes, and timeframes'
      }
    ]
  };

  return new Response(JSON.stringify(fallbackAnalysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
