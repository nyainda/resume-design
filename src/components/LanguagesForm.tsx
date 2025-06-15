
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Languages } from 'lucide-react';
import { toast } from 'sonner';

interface Language {
  id: number;
  language: string;
  proficiency: string;
}

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const proficiencyLevels = [
    { value: 'Native', label: 'Native' },
    { value: 'Fluent', label: 'Fluent' },
    { value: 'Conversational', label: 'Conversational' },
    { value: 'Basic', label: 'Basic' }
  ];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 
    'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Finnish'
  ];

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now(),
      language: '',
      proficiency: 'Basic'
    };
    onChange([...data, newLang]);
    toast.success('New language added');
  };

  const updateLanguage = (id: number, field: keyof Language, value: string) => {
    onChange(data.map(lang => lang.id === id ? { ...lang, [field]: value } : lang));
  };

  const removeLanguage = (id: number) => {
    onChange(data.filter(lang => lang.id !== id));
    toast.success('Language removed');
  };

  const addCommonLanguage = (language: string) => {
    const newLang: Language = {
      id: Date.now(),
      language,
      proficiency: 'Basic'
    };
    onChange([...data, newLang]);
    toast.success(`Added ${language}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Languages
          </div>
          <Button onClick={addLanguage} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Common Languages */}
        {data.length === 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-green-900 dark:text-green-100">Common Languages</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {commonLanguages.map((language) => (
                <Button
                  key={language}
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonLanguage(language)}
                  className="justify-start text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {language}
                </Button>
              ))}
            </div>
          </div>
        )}

        {data.map((lang, index) => (
          <div key={lang.id} className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Language {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Language *</Label>
                <Input
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  placeholder="e.g., English, Spanish, French"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Proficiency Level *</Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Languages className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No languages added yet.</p>
            <p className="text-sm">Click "Add Language" or choose from common options above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesForm;
