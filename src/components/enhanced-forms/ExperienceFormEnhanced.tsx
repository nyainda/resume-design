
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Brain, Wand2, Loader2, Sparkles, FileText, Target, Building2, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceFormEnhancedProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceFormEnhanced: React.FC<ExperienceFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [jobDescription, setJobDescription] = useState('');
  const [generatingExperience, setGeneratingExperience] = useState(false);
  const [enhancingId, setEnhancingId] = useState<number | null>(null);
  const [showJobInput, setShowJobInput] = useState(false);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: number) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const generateExperienceFromJob = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setGeneratingExperience(true);
    try {
      const prompt = `Based on this job description: "${jobDescription}", create a comprehensive work experience entry with exactly 8 detailed bullet points. 

      Requirements:
      - Generate a suitable job title that aligns with the requirements
      - Use a realistic company name (e.g., "TechCorp Solutions", "Innovation Industries")
      - Include a professional location
      - Create 8 detailed bullet points that showcase relevant achievements and responsibilities
      - Use strong action verbs (Led, Developed, Implemented, Managed, Designed, Optimized, etc.)
      - Include quantifiable results where possible (percentages, numbers, metrics)
      - Each bullet point should be 15-25 words long
      - Focus on skills and technologies mentioned in the job description
      - Show progression and leadership
      
      Format as clean text with bullet points (•), not JSON. Example format:
      Position: Senior Software Engineer
      Company: TechCorp Solutions  
      Location: San Francisco, CA
      
      • Led cross-functional team of 8 developers to deliver enterprise software solutions, reducing deployment time by 40%
      • Designed and implemented microservices architecture using React, Node.js, and AWS, serving 100K+ daily users
      • Optimized database performance and reduced query response times by 60% through advanced indexing strategies
      • Mentored 5 junior developers and established coding standards that improved code quality by 35%
      • Collaborated with product managers to define technical requirements and delivered 15+ features on schedule
      • Implemented automated testing frameworks that increased test coverage from 60% to 95%
      • Led migration of legacy systems to cloud infrastructure, resulting in 50% cost reduction
      • Presented technical solutions to C-level executives and secured $2M budget for platform modernization`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        // Parse the AI response to extract position, company, location, and description
        const content = result.content.trim();
        const lines = content.split('\n').filter(line => line.trim());
        
        let position = 'AI Generated Position';
        let company = 'Technology Company';
        let location = 'City, State';
        let description = '';
        
        // Extract structured data from AI response
        lines.forEach(line => {
          if (line.includes('Position:')) {
            position = line.replace('Position:', '').trim();
          } else if (line.includes('Company:')) {
            company = line.replace('Company:', '').trim();
          } else if (line.includes('Location:')) {
            location = line.replace('Location:', '').trim();
          } else if (line.startsWith('•')) {
            description += line + '\n';
          }
        });
        
        // If no structured format, use the entire content as description
        if (!description) {
          description = content;
        }
        
        const newExperience: Experience = {
          id: Date.now(),
          company: company,
          position: position,
          location: location,
          startDate: '',
          endDate: '',
          description: description.trim()
        };
        
        onChange([...data, newExperience]);
        toast.success('AI-generated experience with 8 detailed points added!');
        setShowJobInput(false);
        setJobDescription('');
      }
    } catch (error: any) {
      console.error('AI experience generation error:', error);
      toast.error('Failed to generate experience. Please check your API key.');
    } finally {
      setGeneratingExperience(false);
    }
  };

  const enhanceExperienceDescription = async (experienceId: number) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    const experience = data.find(exp => exp.id === experienceId);
    if (!experience || !experience.description.trim()) {
      toast.error('Please add a description first to enhance it');
      return;
    }

    setEnhancingId(experienceId);
    try {
      const jobContext = jobDescription.trim() 
        ? `Target Job Description: ${jobDescription}\n\n` 
        : '';
      
      const prompt = `${jobContext}Enhance this work experience description to exactly 8 compelling bullet points: "${experience.description}". 

      Requirements:
      - Create exactly 8 bullet points
      - Make each bullet point 15-25 words long  
      - Use strong action verbs (Led, Developed, Implemented, Managed, etc.)
      - Include quantifiable achievements where possible (percentages, numbers, metrics)
      - Highlight relevant skills and technologies
      - Show impact and results
      - Make it ATS-friendly with relevant keywords
      ${jobDescription ? '- Align with the target job requirements' : ''}
      
      Format as bullet points with • symbol, one per line.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        updateExperience(experienceId, 'description', result.content.trim());
        toast.success('Experience enhanced to 8 detailed bullet points!');
      }
    } catch (error: any) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance description. Please check your API key.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Building2 className="w-6 h-6" />
          Professional Experience
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-3">
          <Button onClick={addExperience} variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
          <Button
            onClick={() => setShowJobInput(!showJobInput)}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100"
          >
            <Target className="w-4 h-4 mr-2" />
            Generate from Job (8 Points)
          </Button>
        </div>

        {showJobInput && (
          <div className="p-6 border-2 border-dashed border-purple-200 rounded-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-300">AI Experience Generator</h3>
                <Badge className="bg-purple-100 text-purple-800 text-xs">8 Detailed Points</Badge>
              </div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. The AI will analyze it and create 8 detailed bullet points showcasing relevant experience..."
                className="min-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
              <Button
                onClick={generateExperienceFromJob}
                disabled={generatingExperience || !jobDescription.trim()}
                size="sm"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                {generatingExperience ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating 8 Experience Points...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Professional Experience (8 Points)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {data.map((experience, index) => (
          <Card key={experience.id} className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Experience Entry</h4>
                    {experience.position && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{experience.position}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => enhanceExperienceDescription(experience.id)}
                    disabled={enhancingId === experience.id}
                    variant="outline"
                    size="sm"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    {enhancingId === experience.id ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3 mr-1" />
                    )}
                    Enhance to 8 Points
                  </Button>
                  <Button
                    onClick={() => removeExperience(experience.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Building2 className="w-4 h-4" />
                    Company *
                  </label>
                  <Input
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="e.g., Google, Microsoft, TechCorp Solutions"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FileText className="w-4 h-4" />
                    Position *
                  </label>
                  <Input
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <Input
                    value={experience.location}
                    onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    placeholder="e.g., San Francisco, CA | Remote"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={experience.endDate === 'Present' ? '' : experience.endDate}
                      onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                      placeholder="Present"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={experience.endDate === 'Present'}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id={`current-${experience.id}`}
                        checked={experience.endDate === 'Present'}
                        onChange={(e) => 
                          updateExperience(experience.id, 'endDate', e.target.checked ? 'Present' : '')
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`current-${experience.id}`} className="text-sm text-gray-600 dark:text-gray-400">
                        I currently work here
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4" />
                  Job Description & Achievements *
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    8 Points Recommended
                  </Badge>
                </label>
                <Textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  placeholder="• Led cross-functional team of 8 developers to deliver enterprise solutions, reducing deployment time by 40%&#10;• Designed and implemented microservices architecture serving 100K+ daily users&#10;• Optimized database performance and reduced query response times by 60%&#10;• Mentored 5 junior developers and established coding standards&#10;• Collaborated with product managers to deliver 15+ features on schedule&#10;• Implemented automated testing frameworks increasing coverage to 95%&#10;• Led migration of legacy systems resulting in 50% cost reduction&#10;• Presented technical solutions to executives securing $2M budget"
                  className="min-h-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                />
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>💡 Pro Tips:</strong> Use bullet points (•) for better readability • Include 8 detailed points • 
                    Start with action verbs • Add quantifiable results • Use "Generate from Job" or "Enhance" for AI assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No experience entries yet</h3>
            <p className="mb-4">Add your first experience or generate one from a job description with 8 detailed points.</p>
            <Button onClick={() => setShowJobInput(true)} variant="outline" className="border-purple-200 text-purple-700">
              <Target className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceFormEnhanced;
