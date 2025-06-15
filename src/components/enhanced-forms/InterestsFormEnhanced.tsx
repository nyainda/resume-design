
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Wand2, Loader2, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface InterestsFormEnhancedProps {
  data: string[];
  onChange: (data: string[]) => void;
}

const InterestsFormEnhanced: React.FC<InterestsFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [newInterest, setNewInterest] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  const addInterest = () => {
    if (newInterest.trim() && !data.includes(newInterest.trim())) {
      onChange([...data, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    onChange(data.filter(item => item !== interest));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const generateProfessionalInterests = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(true);
    try {
      const prompt = `Suggest 6 professional and interesting hobbies/interests that would look good on a resume. Focus on activities that show leadership, creativity, teamwork, or personal growth. Return only the interest names separated by commas, nothing else.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        const interests = result.content.split(',').map((interest: string) => interest.trim()).slice(0, 6);
        const uniqueInterests = interests.filter((interest: string) => !data.includes(interest));
        
        onChange([...data, ...uniqueInterests]);
        toast.success('Professional interests added!');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate interests: ${error.message}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interests & Hobbies</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add your personal interests and hobbies</p>
          </div>
        </div>
        <Button
          onClick={generateProfessionalInterests}
          disabled={generatingAI}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 text-purple-700 border dark:from-purple-900/20 dark:to-pink-900/20 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 dark:border-purple-700 dark:text-purple-300"
          variant="outline"
        >
          {generatingAI ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          AI Suggest Professional Interests
        </Button>
      </div>

      <Card className="border-0 bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-800 dark:to-pink-950/30 shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Add Interest Input */}
          <div className="flex gap-3">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type an interest and press Enter"
              className="flex-1 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 dark:border-pink-700 dark:focus:border-pink-400 dark:bg-gray-800 dark:text-white"
            />
            <Button
              onClick={addInterest}
              disabled={!newInterest.trim()}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Interests Display */}
          {data.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your Interests ({data.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 hover:from-pink-200 hover:to-rose-200 transition-colors dark:from-pink-900/30 dark:to-rose-900/30 dark:text-pink-200 dark:hover:from-pink-900/40 dark:hover:to-rose-900/40"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="hover:text-red-600 transition-colors dark:hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-pink-200 dark:border-pink-700 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No interests added yet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add your hobbies and interests to make your resume more personal</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterestsFormEnhanced;
