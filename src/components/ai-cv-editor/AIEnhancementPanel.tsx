
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Target,
  Zap,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface AIEnhancementPanelProps {
  data: any;
  enhancements: any;
  onDataChange: (data: any) => void;
  onRegenerateEnhancements: () => void;
}

const AIEnhancementPanel: React.FC<AIEnhancementPanelProps> = ({
  data,
  enhancements,
  onDataChange,
  onRegenerateEnhancements
}) => {
  const [isApplying, setIsApplying] = useState(false);

  const applyEnhancement = async (enhancement: any) => {
    setIsApplying(true);
    try {
      // Apply the enhancement to the data
      if (enhancement.type === 'summary') {
        onDataChange({
          ...data,
          personal: {
            ...data.personal,
            summary: enhancement.content
          }
        });
      } else if (enhancement.type === 'experience') {
        const updatedExperience = [...data.experience];
        updatedExperience[enhancement.index] = {
          ...updatedExperience[enhancement.index],
          description: enhancement.content
        };
        onDataChange({
          ...data,
          experience: updatedExperience
        });
      }
      
      toast.success('✨ Enhancement applied successfully!');
    } catch (error) {
      toast.error('Failed to apply enhancement');
    } finally {
      setIsApplying(false);
    }
  };

  if (!enhancements) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-300 mb-2">
            AI Enhancements Loading
          </h3>
          <p className="text-orange-700 dark:text-orange-400 mb-4">
            Our AI is analyzing your resume and generating smart enhancements...
          </p>
          <Button
            onClick={onRegenerateEnhancements}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Enhancements
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhancement Overview */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:border-purple-800 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
            <Sparkles className="w-6 h-6" />
            AI Enhancement Suite
          </CardTitle>
          <p className="text-purple-700 dark:text-purple-400">
            Powered by advanced AI to optimize your resume for maximum impact
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>ATS Optimized</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Impact Enhanced</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Keywords Boosted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Enhancements */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
              <Lightbulb className="w-5 h-5" />
              Summary Enhancement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enhancements.summaryEnhancement && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-300">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">AI Enhanced</Badge>
                  <Button
                    size="sm"
                    onClick={() => applyEnhancement({
                      type: 'summary',
                      content: enhancements.summaryEnhancement
                    })}
                    disabled={isApplying}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {enhancements.summaryEnhancement}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Enhancement */}
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-300">
              <Award className="w-5 h-5" />
              Skills Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enhancements.skillsEnhancement && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-300">
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Recommended Skills</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enhancements.skillsEnhancement.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    onDataChange({
                      ...data,
                      skills: [...data.skills, ...enhancements.skillsEnhancement.filter((s: string) => !data.skills.includes(s))]
                    });
                    toast.success('Skills enhanced with AI recommendations!');
                  }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Add All Skills
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Experience Enhancements */}
      {enhancements.experienceEnhancements && (
        <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-300">
              <TrendingUp className="w-5 h-5" />
              Experience Enhancements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enhancements.experienceEnhancements.map((enhancement: any, index: number) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {enhancement.position} at {enhancement.company}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => applyEnhancement({
                      type: 'experience',
                      index: enhancement.index,
                      content: enhancement.enhancedDescription
                    })}
                    disabled={isApplying}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {enhancement.enhancedDescription}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Regenerate Button */}
      <div className="text-center">
        <Button
          onClick={onRegenerateEnhancements}
          variant="outline"
          className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate AI Enhancements
        </Button>
      </div>
    </div>
  );
};

export default AIEnhancementPanel;
