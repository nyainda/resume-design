import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Brain, Wand2, Loader2, Sparkles, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface PersonalInfoFormEnhancedProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoFormEnhanced: React.FC<PersonalInfoFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [jobDescription, setJobDescription] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [showJobInput, setShowJobInput] = useState(false);

  const generateAISummary = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    if (!jobDescription.trim() && !data.fullName) {
      toast.error('Please enter a job description or your name first');
      return;
    }

    setGeneratingSummary(true);
    try {
      const prompt = jobDescription.trim() 
        ? `You are an expert resume writer and career coach. Create a compelling professional summary for a resume that targets this specific job opportunity:

JOB DESCRIPTION:
${jobDescription}

REQUIREMENTS:
- Write 2-3 powerful sentences (40-60 words total)
- Use active voice and strong action verbs
- Include relevant keywords from the job description for ATS optimization  
- Highlight the most valuable skills and experiences that match the role
- Quantify achievements when possible (use placeholder numbers if specific data unavailable)
- Write in third person without using "I" or the person's name
- Make it results-oriented and value-focused
- Ensure it passes ATS keyword scanning
- Use industry-specific terminology appropriately

TONE: Professional, confident, and compelling
FORMAT: 2-3 sentences, no bullet points

Example structure: "[Years] of experience in [field/industry] with proven expertise in [key skills]. Successfully [major achievement with impact]. Skilled in [relevant technologies/methods] with a track record of [measurable results]."

Generate the professional summary now:`
        : `You are an expert resume writer. Create a versatile professional summary for ${data.fullName || 'a professional'}.

REQUIREMENTS:
- Write 2-3 powerful sentences (40-60 words total)
- Use active voice and strong action verbs
- Make it adaptable to various roles and industries
- Focus on transferable skills and universal professional strengths
- Include soft skills and leadership qualities
- Write in third person without using "I" or the person's name
- Be results-oriented and achievement-focused
- Use professional, polished language

TONE: Professional, confident, and versatile
FORMAT: 2-3 sentences, no bullet points

Focus on: Leadership abilities, problem-solving skills, communication strengths, adaptability, and drive for results.

Generate the professional summary now:`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        onChange({
          ...data,
          summary: result.content.trim()
        });
        toast.success('AI-generated professional summary created!');
        setShowJobInput(false);
      } else {
        throw new Error('No content generated');
      }
    } catch (error: any) {
      console.error('AI summary generation error:', error);
      toast.error('Failed to generate summary. Please check your API key.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const enhanceExistingSummary = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    if (!data.summary.trim()) {
      toast.error('Please add a summary first to enhance it');
      return;
    }

    setGeneratingSummary(true);
    try {
      const prompt = `You are an expert resume writer and ATS optimization specialist. Enhance and improve this professional summary to make it more compelling and effective:

CURRENT SUMMARY:
"${data.summary}"

ENHANCEMENT REQUIREMENTS:
- Rewrite to be 2-3 powerful sentences (40-60 words total)
- Use stronger action verbs and more impactful language
- Make it more ATS-friendly by incorporating relevant keywords
- Improve the flow and readability
- Add more specific, results-oriented language
- Ensure it sounds professional and polished
- Remove any redundant or weak phrases
- Make every word count and add value
- Use active voice throughout
- Include quantifiable achievements where possible

IMPROVEMENTS TO FOCUS ON:
1. Replace weak verbs with strong action verbs
2. Add industry-relevant keywords
3. Make achievements more specific and measurable
4. Improve sentence structure and flow
5. Enhance professional tone
6. Optimize for both human readers and ATS systems

TONE: Professional, confident, and compelling
FORMAT: 2-3 sentences, no bullet points

Provide only the enhanced summary, no explanations or additional text:`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        onChange({
          ...data,
          summary: result.content.trim()
        });
        toast.success('Professional summary enhanced with AI!');
      }
    } catch (error: any) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance summary. Please check your API key.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Personal Information
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <Input
              value={data.fullName}
              onChange={(e) => onChange({ ...data, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              placeholder="New York, NY"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Professional Summary</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowJobInput(!showJobInput)}
                className="text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                From Job
              </Button>
              {data.summary && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhanceExistingSummary}
                  disabled={generatingSummary}
                  className="text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Enhance
                </Button>
              )}
            </div>
          </div>

          {showJobInput && (
            <div className="mb-3 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <label className="block text-sm font-medium mb-2">Job Description (Optional)</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to generate a targeted summary..."
                className="min-h-[100px] mb-2"
              />
              <Button
                type="button"
                onClick={generateAISummary}
                disabled={generatingSummary}
                size="sm"
                className="w-full"
              >
                {generatingSummary ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating AI Summary...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Targeted Summary
                  </>
                )}
              </Button>
            </div>
          )}

          <Textarea
            value={data.summary}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="A brief professional summary highlighting your key skills and experience..."
            className="min-h-[120px]"
          />
          <p className="text-xs text-gray-500 mt-1">
            A compelling 2-3 sentence summary that highlights your most relevant qualifications
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoFormEnhanced;