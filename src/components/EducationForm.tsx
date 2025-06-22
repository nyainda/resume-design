import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wand2, Loader2, GraduationCap, Award, MapPin, Calendar, BookOpen, Sparkles, Brain, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Education {
  id: number;
  school: string;
  degree: string;
  location: string;
  startDate: string; // Format: YYYY-MM
  endDate: string; // Format: YYYY-MM
  gpa: string;
  description?: string;
  courses?: string;
  honors?: string;
}

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [educations, setEducations] = useState<Education[]>(
    data.length > 0 ? data : [createNewEducation()]
  );
  const [generatingAI, setGeneratingAI] = useState<number | null>(null);
  const [generatingCourses, setGeneratingCourses] = useState<number | null>(null);

  function createNewEducation(): Education {
    return {
      id: Date.now(),
      school: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
      courses: '',
      honors: ''
    };
  }

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    if (field === 'startDate' || field === 'endDate') {
      // Validate YYYY-MM format (e.g., "2020-09") or allow empty string
      const isValidDate = value === '' || /^\d{4}-\d{2}$/.test(value);
      if (!isValidDate) {
        toast.error('Please use YYYY-MM format for dates (e.g., 2020-09)');
        return;
      }
    }
    const updatedEducations = educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducations(updatedEducations);
    onChange(updatedEducations);
  };

  const addEducation = () => {
    const newEdu = createNewEducation();
    const updatedEducations = [...educations, newEdu];
    setEducations(updatedEducations);
    onChange(updatedEducations);
    toast.success('New education added');
  };

  const removeEducation = (id: number) => {
    if (educations.length === 1) {
      toast.error('At least one education entry is required');
      return;
    }
    const updatedEducations = educations.filter(edu => edu.id !== id);
    setEducations(updatedEducations);
    onChange(updatedEducations);
    toast.success('Education removed');
  };

  const generateAIDescription = async (eduId: number) => {
    const education = educations.find(edu => edu.id === eduId);
    if (!education || !education.degree) {
      toast.error('Please fill in degree first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(eduId);
    try {
      console.log('Generating AI description for education:', education);
      
      const prompt = `Generate a professional education description for a resume based on this degree: "${education.degree}".
      ${education.school ? `School: ${education.school}` : ''}
      ${education.gpa ? `GPA: ${education.gpa}` : ''}
      ${education.honors ? `Honors: ${education.honors}` : ''}
      
      Requirements:
      - Write ONLY the description text (no headers, options, or formatting)
      - Keep it to 2-3 concise sentences maximum
      - Focus on skills gained, relevant coursework, and career value
      - Use action words and quantifiable achievements where possible
      - Make it ATS-friendly with relevant keywords
      - Write in past tense for completed degrees
      - Be specific about technical skills and competencies developed
      
      Generate a single, polished description that can be directly copied into a resume.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      console.log('AI Response:', result, 'Error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate description');
      }

      if (result?.content) {
        updateEducation(eduId, 'description', result.content.trim());
        toast.success('AI description generated successfully!');
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate description: ${error.message}`);
    } finally {
      setGeneratingAI(null);
    }
  };

  const generateAICourses = async (eduId: number) => {
    const education = educations.find(edu => edu.id === eduId);
    if (!education || !education.degree) {
      toast.error('Please fill in degree first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingCourses(eduId);
    try {
      console.log('Generating AI courses for education:', education);
      
      const prompt = `Generate relevant courses for this degree: "${education.degree}".
      ${education.school ? `School: ${education.school}` : ''}
      
      Requirements:
      - Generate 8-12 specific course names that are core to this degree
      - Focus on courses that demonstrate valuable technical skills
      - Use modern, industry-relevant course titles
      - Format as a clean comma-separated list
      - No introductory text or explanations
      - Course names should be concise but descriptive
      - Prioritize courses that employers would recognize and value
      
      Generate only the comma-separated course list.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      console.log('AI Courses Response:', result, 'Error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate courses');
      }

      if (result?.content) {
        updateEducation(eduId, 'courses', result.content.trim());
        toast.success('AI courses generated successfully!');
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error: any) {
      console.error('AI courses generation error:', error);
      toast.error(`Failed to generate courses: ${error.message}`);
    } finally {
      setGeneratingCourses(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Education
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add your educational background with AI-powered enhancements
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {educations.length} {educations.length === 1 ? 'Entry' : 'Entries'}
          </Badge>
        </div>
        <Button 
          onClick={addEducation} 
          size="lg" 
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </Button>
      </div>

      <div className="space-y-8">
        {educations.map((edu, index) => (
          <Card key={edu.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{padding: '2px'}}>
              <div className="h-full w-full bg-white dark:bg-gray-900 rounded-lg" />
            </div>
            
            <div className="relative z-10">
              <CardHeader className="pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-b border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        Education {index + 1}
                      </div>
                      {edu.degree && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                          {edu.degree}
                        </div>
                      )}
                    </div>
                  </CardTitle>
                  {educations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* School and Degree Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor={`school-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      School/University *
                    </Label>
                    <Input
                      id={`school-${edu.id}`}
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="Harvard University"
                      className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 text-base"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor={`degree-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Degree *
                    </Label>
                    <Input
                      id={`degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science in Computer Science"
                      className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 text-base"
                    />
                  </div>
                </div>

                {/* Location and GPA Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor={`location-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Location
                    </Label>
                    <Input
                      id={`location-${edu.id}`}
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      placeholder="Cambridge, MA"
                      className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 text-base"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor={`gpa-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Star className="w-4 h-4 text-emerald-600" />
                      GPA
                    </Label>
                    <Input
                      id={`gpa-${edu.id}`}
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                      className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 text-base"
                    />
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor={`startDate-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Start Date
                    </Label>
                    <Input
                      id={`startDate-${edu.id}`}
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      placeholder="2020-09"
                      className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 text-base"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor={`endDate-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      End Date
                    </Label>
                    <Input
                      id={`endDate-${edu.id}`}
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      placeholder="2024-05"
                      className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 text-base"
                    />
                  </div>
                </div>

                {/* AI-Enhanced Description */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Description
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900 dark:text-purple-300">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </Badge>
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateAIDescription(edu.id)}
                      disabled={generatingAI === edu.id || !edu.degree}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {generatingAI === edu.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      {generatingAI === edu.id ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${edu.id}`}
                    value={edu.description || ''}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    placeholder="Brief description of achievements, relevant coursework, or skills gained..."
                    rows={4}
                    className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 bg-white dark:bg-gray-900"
                  />
                </div>

                {/* AI-Enhanced Relevant Courses */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`courses-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Relevant Courses
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </Badge>
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateAICourses(edu.id)}
                      disabled={generatingCourses === edu.id || !edu.degree}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {generatingCourses === edu.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      {generatingCourses === edu.id ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    id={`courses-${edu.id}`}
                    value={edu.courses || ''}
                    onChange={(e) => updateEducation(edu.id, 'courses', e.target.value)}
                    placeholder="Data Structures, Algorithms, Machine Learning, Database Systems..."
                    rows={3}
                    className="border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 bg-white dark:bg-gray-900"
                  />
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    💡 Tip: List courses that are most relevant to your target career path
                  </p>
                </div>
                
                {/* Honors & Awards */}
                <div className="space-y-3">
                  <Label htmlFor={`honors-${edu.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Award className="w-4 h-4 text-amber-600" />
                    Honors & Awards
                  </Label>
                  <Input
                    id={`honors-${edu.id}`}
                    value={edu.honors || ''}
                    onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                    placeholder="Dean's List, Magna Cum Laude, Outstanding Student Award..."
                    className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200 text-base"
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationForm;