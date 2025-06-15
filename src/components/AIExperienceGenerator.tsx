
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Brain, Wand2, Loader2, Copy, CheckCircle } from 'lucide-react';

interface AIExperienceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (generatedText: string) => void;
  currentPosition?: string;
  currentCompany?: string;
}

const AIExperienceGenerator: React.FC<AIExperienceGeneratorProps> = ({
  isOpen,
  onClose,
  onGenerated,
  currentPosition = '',
  currentCompany = ''
}) => {
  const [position, setPosition] = useState(currentPosition);
  const [company, setCompany] = useState(currentCompany);
  const [industry, setIndustry] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);

  const generateExperience = async () => {
    if (!position.trim()) {
      toast.error('Please enter a job position');
      return;
    }

    setGenerating(true);
    try {
      // Simulate AI generation with realistic content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templates = [
        `• Led cross-functional teams to deliver ${position.toLowerCase()} solutions, resulting in 25% improvement in operational efficiency
• Collaborated with stakeholders to implement strategic initiatives and optimize workflows
• Developed and maintained comprehensive documentation and best practices for team processes
• Mentored junior team members and contributed to knowledge sharing across departments`,

        `• Spearheaded ${industry || 'key'} projects from conception to completion, exceeding project goals by 30%
• Analyzed complex data sets and presented actionable insights to senior leadership
• Implemented innovative solutions that reduced processing time by 40% and improved accuracy
• Coordinated with multiple departments to ensure seamless project delivery and stakeholder satisfaction`,

        `• Managed end-to-end ${position.toLowerCase()} processes, improving team productivity by 35%
• Established quality assurance protocols that reduced errors by 50% and enhanced customer satisfaction
• Facilitated training sessions for new team members and contributed to onboarding improvements
• Collaborated with external partners to streamline operations and expand service capabilities`
      ];

      // Customize based on user input
      let customizedTemplates = templates.map(template => {
        if (keySkills) {
          template = template.replace('strategic initiatives', `${keySkills} initiatives`);
        }
        if (achievements) {
          template += `\n• ${achievements}`;
        }
        return template;
      });

      setGeneratedResults(customizedTemplates);
      toast.success('AI-generated experience descriptions ready!');
    } catch (error) {
      console.error('Error generating experience:', error);
      toast.error('Failed to generate experience descriptions');
    } finally {
      setGenerating(false);
    }
  };

  const handleUseGenerated = (text: string) => {
    onGenerated(text);
    onClose();
    toast.success('Generated text applied to experience!');
  };

  const handleReset = () => {
    setGeneratedResults([]);
    setPosition(currentPosition);
    setCompany(currentCompany);
    setIndustry('');
    setKeySkills('');
    setAchievements('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Experience Description Generator
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              AI-Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position">Job Position *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Software Engineer, Marketing Manager"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Microsoft, Startup Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry (Optional)</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keySkills">Key Skills/Technologies</Label>
              <Input
                id="keySkills"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                placeholder="e.g., React, Python, Project Management"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Specific Achievement (Optional)</Label>
              <Textarea
                id="achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="e.g., Increased sales by 40%, Reduced costs by $50K"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateExperience}
                disabled={generating || !position.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate AI Descriptions
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {generatedResults.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    {generatedResults.length} AI-generated descriptions ready!
                  </span>
                </div>

                <div className="space-y-3">
                  {generatedResults.map((result, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-sm text-gray-700">
                            Option {index + 1}
                          </h4>
                          <Button
                            size="sm"
                            onClick={() => handleUseGenerated(result)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Use This
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600 whitespace-pre-line">
                          {result}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">AI-Powered Experience Generator</p>
                <p className="text-xs text-gray-400">
                  Fill in the details and click "Generate" to create professional experience descriptions
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIExperienceGenerator;
