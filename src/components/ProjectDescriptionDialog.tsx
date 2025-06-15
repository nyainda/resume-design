
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface ProjectDescriptionDialogProps {
  onGenerate: (description: string) => void;
  children: React.ReactNode;
}

const ProjectDescriptionDialog: React.FC<ProjectDescriptionDialogProps> = ({ onGenerate, children }) => {
  const { apiKey } = useAPIKey();
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectIdea, setProjectIdea] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [projectType, setProjectType] = useState('');
  const [goals, setGoals] = useState('');

  const generateDescription = async () => {
    if (!projectIdea.trim()) {
      toast.error('Please describe what your project is about');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional project description for a resume/CV based on the following information:

Project Idea/Purpose: ${projectIdea}
Technologies Used: ${technologies || 'Not specified'}
Project Type: ${projectType || 'Not specified'}
Goals/Achievements: ${goals || 'Not specified'}

Create a compelling 2-3 sentence description that highlights:
- The project's main purpose and objectives
- Key technical achievements and features implemented
- Business impact or value delivered
- Technical skills demonstrated

Make it sound professional, impressive, and suitable for a resume. Focus on quantifiable results where possible and use action verbs. Write in past tense if the project seems completed, or present tense if ongoing.

Return only the description text, no additional formatting or explanations.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        onGenerate(result.content.trim());
        toast.success('✨ Project description generated successfully!');
        setOpen(false);
        // Clear form after successful generation
        setProjectIdea('');
        setTechnologies('');
        setProjectType('');
        setGoals('');
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate description: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            AI Project Description Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              💡 <strong>Tip:</strong> The more details you provide, the better the AI can create a professional project description for your resume.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                What is your project about? *
              </Label>
              <Textarea
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="e.g., A web application that helps small businesses manage their inventory and track sales in real-time. Users can add products, monitor stock levels, and generate sales reports."
                rows={4}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Technologies Used
                </Label>
                <Input
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Project Type
                </Label>
                <Input
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="e.g., Web App, Mobile App, API"
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Goals & Achievements
              </Label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., Reduced inventory tracking time by 50%, served 100+ businesses, implemented real-time notifications"
                rows={3}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={generateDescription}
              disabled={isGenerating || !projectIdea.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Description
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDescriptionDialog;
