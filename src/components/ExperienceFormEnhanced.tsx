
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import EnhancedExperienceTextarea from './EnhancedExperienceTextarea';
import AIExperienceGenerator from './AIExperienceGenerator';
import { Plus, Trash2, Briefcase, MapPin, Calendar, Building, Brain } from 'lucide-react';
import { toast } from 'sonner';

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
  onChange: (experiences: Experience[]) => void;
}

const ExperienceFormEnhanced: React.FC<ExperienceFormEnhancedProps> = ({ data, onChange }) => {
  const [experiences, setExperiences] = useState<Experience[]>(
    data.length > 0 ? data : [createNewExperience()]
  );
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [activeExperienceId, setActiveExperienceId] = useState<number | null>(null);

  function createNewExperience(): Experience {
    return {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
  }

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
    onChange(updatedExperiences);
  };

  const addExperience = () => {
    const newExp = createNewExperience();
    const updatedExperiences = [...experiences, newExp];
    setExperiences(updatedExperiences);
    onChange(updatedExperiences);
    toast.success('New experience added');
  };

  const removeExperience = (id: number) => {
    if (experiences.length === 1) {
      toast.error('At least one experience entry is required');
      return;
    }
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    onChange(updatedExperiences);
    toast.success('Experience removed');
  };

  const handleAIGenerate = (experienceId: number) => {
    setActiveExperienceId(experienceId);
    setShowAIGenerator(true);
  };

  const handleAIGenerated = (generatedText: string) => {
    if (activeExperienceId) {
      updateExperience(activeExperienceId, 'description', generatedText);
    }
    setShowAIGenerator(false);
    setActiveExperienceId(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const getCurrentExperience = () => {
    return experiences.find(exp => exp.id === activeExperienceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Professional Experience
          </h2>
          <Badge variant="secondary">{experiences.length}</Badge>
        </div>
        <Button onClick={addExperience} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <Card key={experience.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  Experience {index + 1}
                  {experience.position && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                      - {experience.position}
                    </span>
                  )}
                </CardTitle>
                {experiences.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(experience.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Company and Position Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`company-${experience.id}`} className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company *
                  </Label>
                  <Input
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`position-${experience.id}`} className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Position *
                  </Label>
                  <Input
                    id={`position-${experience.id}`}
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location Row */}
              <div className="space-y-2">
                <Label htmlFor={`location-${experience.id}`} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id={`location-${experience.id}`}
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  placeholder="e.g., San Francisco, CA | Remote | New York, NY"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${experience.id}`} className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date *
                  </Label>
                  <Input
                    id={`startDate-${experience.id}`}
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {experience.startDate && (
                    <p className="text-xs text-gray-600">Will display as: {formatDate(experience.startDate)}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${experience.id}`} className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id={`endDate-${experience.id}`}
                      type="month"
                      value={experience.endDate === 'Present' ? '' : experience.endDate}
                      onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      disabled={experience.endDate === 'Present'}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${experience.id}`}
                        checked={experience.endDate === 'Present'}
                        onChange={(e) => 
                          updateExperience(experience.id, 'endDate', e.target.checked ? 'Present' : '')
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <Label htmlFor={`current-${experience.id}`} className="text-sm">
                        I currently work here
                      </Label>
                    </div>
                    {experience.endDate && experience.endDate !== 'Present' && (
                      <p className="text-xs text-gray-600">Will display as: {formatDate(experience.endDate)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Description with AI */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`description-${experience.id}`} className="flex items-center gap-2">
                    <span className="text-sm font-medium">Job Description & Achievements *</span>
                    <Badge variant="outline" className="text-xs">Enhanced Editor</Badge>
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAIGenerate(experience.id)}
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  >
                    <Brain className="w-3 h-3" />
                    AI Generate
                  </Button>
                </div>
                <EnhancedExperienceTextarea
                  value={experience.description}
                  onChange={(value) => updateExperience(experience.id, 'description', value)}
                  placeholder="• Developed and maintained backend systems using Laravel and PHP
• Collaborated with cross-functional teams to deliver high-quality software solutions
• Implemented automated testing procedures that improved code quality by 30%
• Led a team of 5 developers in agile development practices"
                  className="focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <strong>Pro Tips:</strong> Use bullet points for better readability • Include quantifiable achievements • 
                  Start each point with action verbs • Focus on results and impact • Use AI Generate for professional descriptions
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Experience Generator Modal */}
      <AIExperienceGenerator
        isOpen={showAIGenerator}
        onClose={() => {
          setShowAIGenerator(false);
          setActiveExperienceId(null);
        }}
        onGenerated={handleAIGenerated}
        currentPosition={getCurrentExperience()?.position}
        currentCompany={getCurrentExperience()?.company}
      />
    </div>
  );
};

export default ExperienceFormEnhanced;
