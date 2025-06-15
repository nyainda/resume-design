
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Wand2, Loader2, Languages, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Language {
  id: number;
  language: string;
  proficiency: string;
}

interface LanguagesFormEnhancedProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const proficiencyLevels = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Beginner'
];

const LanguagesFormEnhanced: React.FC<LanguagesFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [generatingAI, setGeneratingAI] = useState(false);

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now(),
      language: '',
      proficiency: ''
    };
    onChange([...data, newLang]);
  };

  const updateLanguage = (id: number, field: keyof Language, value: string) => {
    onChange(data.map(lang => lang.id === id ? { ...lang, [field]: value } : lang));
  };

  const removeLanguage = (id: number) => {
    onChange(data.filter(lang => lang.id !== id));
  };

  const generateCommonLanguages = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(true);
    try {
      const prompt = `Suggest 5 common languages that are valuable in professional settings. Return only the language names separated by commas, nothing else.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        const languages = result.content.split(',').map((lang: string) => lang.trim()).slice(0, 5);
        const newLanguages = languages.map((lang: string) => ({
          id: Date.now() + Math.random(),
          language: lang,
          proficiency: 'Intermediate'
        }));
        
        onChange([...data, ...newLanguages]);
        toast.success('Common languages added!');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate languages: ${error.message}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Languages</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add languages you speak</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={generateCommonLanguages}
            disabled={generatingAI}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
          >
            {generatingAI ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-purple-600" />
            )}
            <span className="text-purple-700">AI Suggest</span>
          </Button>
          <Button onClick={addLanguage} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
      </div>

      {data.map((lang, index) => (
        <Card key={lang.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardContent className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">{index + 1}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </Label>
                  <Input
                    value={lang.language}
                    onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                    placeholder="Spanish"
                    className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency</Label>
                  <Select value={lang.proficiency} onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}>
                    <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500/20">
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No languages added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Click "Add Language" or "AI Suggest" to showcase your language skills</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LanguagesFormEnhanced;
