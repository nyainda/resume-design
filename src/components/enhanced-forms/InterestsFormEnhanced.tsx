import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Wand2, Loader2, Heart, Sparkles, Target, Zap } from 'lucide-react';
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
      toast.success('Interest added successfully!');
    } else if (data.includes(newInterest.trim())) {
      toast.error('This interest is already added');
    }
  };

  const removeInterest = (interest: string) => {
    onChange(data.filter(item => item !== interest));
    toast.success('Interest removed');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const generateProfessionalInterests = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings to use AI suggestions');
      return;
    }

    setGeneratingAI(true);
    try {
      const existingInterests = data.length > 0 ? `\n\nAvoid suggesting these existing interests: ${data.join(', ')}` : '';
      
      const prompt = `Generate exactly 6 professional and impactful interests/hobbies that would enhance a resume and demonstrate valuable soft skills. Focus on activities that showcase:

- Leadership and initiative (volunteering, organizing events, mentoring)
- Creativity and innovation (photography, writing, design, music)
- Physical and mental wellness (sports, fitness, meditation, hiking)
- Technical skills (coding projects, robotics, digital art)
- Cultural awareness (travel, languages, cooking, reading)
- Community involvement (environmental causes, social work, teaching)

Requirements:
- Each interest should be 1-3 words maximum
- Make them specific but professional
- Ensure they appeal to diverse industries
- Focus on activities that show personal growth and discipline
- Return ONLY the 6 interests separated by commas, no additional text or explanations${existingInterests}

Example format: Photography, Rock Climbing, Volunteer Tutoring, Creative Writing, Marathon Running, Language Learning`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        // Clean and validate the response
        const interests = result.content
          .split(',')
          .map((interest: string) => interest.trim())
          .filter((interest: string) => interest.length > 0 && interest.length <= 30)
          .slice(0, 6);
        
        const uniqueInterests = interests.filter((interest: string) => 
          !data.some(existing => existing.toLowerCase() === interest.toLowerCase())
        );
        
        if (uniqueInterests.length > 0) {
          onChange([...data, ...uniqueInterests]);
          toast.success(`Added ${uniqueInterests.length} professional interests!`);
        } else {
          toast.info('All suggested interests are already in your list');
        }
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate interests: ${error.message || 'Unknown error'}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-500/25">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Interests & Hobbies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Showcase your personality and passion projects
            </p>
          </div>
        </div>
        
        <Button
          onClick={generateProfessionalInterests}
          disabled={generatingAI}
          className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white border-0 shadow-xl shadow-purple-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105"
          size="lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {generatingAI ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
              AI Professional Suggestions
            </>
          )}
        </Button>
      </div>

      {/* Main Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-pink-50/50 to-rose-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-pink-950/20 shadow-2xl shadow-pink-500/10 dark:shadow-pink-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent dark:via-white/5"></div>
        <CardContent className="relative p-8 space-y-8">
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add New Interest</span>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Photography, Rock Climbing, Cooking..."
                  className="h-12 pl-4 pr-4 border-2 border-pink-200/60 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 dark:border-pink-700/50 dark:focus:border-pink-500 dark:bg-gray-800/50 dark:text-white backdrop-blur-sm transition-all duration-200 text-base"
                />
              </div>
              <Button
                onClick={addInterest}
                disabled={!newInterest.trim()}
                className="h-12 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Interests Display */}
          {data.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Your Interests
                  </h3>
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-lg">
                    {data.length}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.map((interest, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden"
                  >
                    <Badge
                      variant="secondary"
                      className="w-full justify-between px-4 py-3 bg-gradient-to-r from-pink-100/80 via-rose-100/80 to-pink-100/80 hover:from-pink-200/90 hover:via-rose-200/90 hover:to-pink-200/90 text-pink-800 border-pink-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-pink-900/30 dark:hover:from-pink-900/50 dark:hover:via-rose-900/50 dark:hover:to-pink-900/50 dark:text-pink-200 dark:border-pink-700/30 text-sm font-medium"
                    >
                      <span className="truncate">{interest}</span>
                      <button
                        onClick={() => removeInterest(interest)}
                        className="ml-2 opacity-60 hover:opacity-100 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-fuchsia-900/30 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-pink-500/20">
                  <Heart className="w-12 h-12 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="absolute top-2 right-1/2 transform translate-x-8 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Your interests make you unique
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                Add your hobbies and interests to show employers your well-rounded personality and passion for life
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => document.querySelector('input')?.focus()}
                  variant="outline"
                  className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-300 dark:hover:bg-pink-950/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Interest
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterestsFormEnhanced;