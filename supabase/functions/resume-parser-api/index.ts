
import { corsHeaders } from '../_shared/cors.ts'

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY')

interface ResumeParserRequest {
  fileContent: string;
  fileName: string;
  fileType: string;
}

interface ParsedResumeData {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  work_experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }>;
  education?: Array<{
    title?: string;
    institute?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }>;
  skills?: string[];
  languages?: string[];
  certificates?: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RAPIDAPI_KEY) {
      console.error('RAPIDAPI_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'API configuration missing' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { fileContent, fileName, fileType }: ResumeParserRequest = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: 'File content is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing resume: ${fileName} (${fileType})`);
    console.log('Using RAPIDAPI_KEY:', RAPIDAPI_KEY ? 'Key is present' : 'Key is missing');

    // Call the AI Resume Parser API with proper headers
    const response = await fetch('https://ai-resume-parser-extractor.p.rapidapi.com/resume/file/base64', {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'ai-resume-parser-extractor.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: fileContent,
        fileType: fileType.replace('application/', '').replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx')
      })
    });

    console.log('RapidAPI Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resume parser API error:', response.status, response.statusText, errorText);
      throw new Error(`Resume parser API error: ${response.status}`);
    }

    const apiResult = await response.json();
    console.log('Resume parser API response received successfully');

    // Transform the API response to match our expected format
    const transformedData = transformResumeData(apiResult);

    return new Response(
      JSON.stringify({
        success: true,
        extractedData: transformedData,
        rawData: apiResult
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Resume parsing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to parse resume',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function transformResumeData(apiData: any) {
  try {
    // Extract parsed data from API response
    const parsed: ParsedResumeData = apiData.parsed_data || apiData;

    return {
      personal: {
        fullName: parsed.personal_info?.name || '',
        email: parsed.personal_info?.email || '',
        phone: parsed.personal_info?.phone || '',
        location: parsed.personal_info?.address || '',
        summary: '',
        website: '',
        linkedin: ''
      },
      experience: (parsed.work_experience || []).map((exp: any, index: number) => ({
        id: Date.now() + index,
        company: exp.company || '',
        position: exp.title || '',
        location: exp.location || '',
        startDate: exp.start_date || '',
        endDate: exp.end_date || '',
        description: exp.description || ''
      })),
      education: (parsed.education || []).map((edu: any, index: number) => ({
        id: Date.now() + index + 1000,
        school: edu.institute || '',
        degree: edu.title || '',
        location: edu.location || '',
        startDate: edu.start_date || '',
        endDate: edu.end_date || '',
        gpa: ''
      })),
      skills: parsed.skills || [],
      certifications: (parsed.certificates || []).map((cert: string, index: number) => ({
        id: Date.now() + index + 2000,
        name: cert,
        issuer: '',
        date: '',
        credentialId: ''
      })),
      languages: (parsed.languages || []).map((lang: string, index: number) => ({
        id: Date.now() + index + 3000,
        language: lang,
        proficiency: 'Professional'
      })),
      interests: [],
      projects: []
    };
  } catch (error) {
    console.error('Error transforming resume data:', error);
    throw new Error('Failed to transform resume data');
  }
}
