import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wand2, Loader2, GraduationCap, Award, MapPin, Calendar } from 'lucide-react';
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
      
      Create a brief, professional description (2-3 lines) highlighting relevant coursework, achievements, or skills gained from this degree. Focus on what makes this degree valuable for a professional career. Keep it concise and resume-appropriate.`;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Education
          </h2>
          <Badge variant="secondary">{educations.length}</Badge>
        </div>
        <Button onClick={addEducation} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {educations.map((edu, index) => (
          <Card key={edu.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  Education {index + 1}
                  {edu.degree && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                      - {edu.degree}
                    </span>
                  )}
                </CardTitle>
                {educations.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* School and Degree Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`school-${edu.id}`} className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    School/University *
                  </Label>
                  <Input
                    id={`school-${edu.id}`}
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="Harvard University"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`} className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Degree *
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Location and GPA Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`location-${edu.id}`} className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id={`location-${edu.id}`}
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="Cambridge, MA"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`gpa-${edu.id}`} className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    GPA
                  </Label>
                  <Input
                    id={`gpa-${edu.id}`}
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate-${edu.id}" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate-${edu.id}"
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    placeholder="2020-09"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate-${edu.id}" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </Label>
                  <Input
                    id="endDate-${edu.id}"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    placeholder="2024-05"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* AI-Enhanced Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description-${edu.id}" className="flex items-center gap-2">
                    <span className="text-sm font-medium">Description</span>
                    <Badge variant="outline" className="text-xs">AI Enhanced</Badge>
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateAIDescription(edu.id)}
                    disabled={generatingAI === edu.id || !edu.degree}
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  >
                    {generatingAI === edu.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  id="description-${edu.id}"
                  value={edu.description || ''}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  placeholder="Brief description of achievements, relevant coursework, or skills gained..."
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Additional Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courses-${edu.id}" className="text-sm font-medium">Relevant Courses</Label>
                  <Textarea
                    id="courses-${edu.id}"
                    value={edu.courses || ''}
                    onChange={(e) => updateEducation(edu.id, 'courses', e.target.value)}
                    placeholder="Data Structures, Algorithms, Machine Learning, Database Systems..."
                    rows={2}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="honors-${edu.id}" className="text-sm font-medium">Honors & Awards</Label>
                  <Input
                    id="honors-${edu.id}"
                    value={edu.honors || ''}
                    onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                    placeholder="Dean's List, Magna Cum Laude, Outstanding Student Award..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationForm;