
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface InterestsFormProps {
  data: string[];
  onChange: (data: string[]) => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({ data, onChange }) => {
  const [newInterest, setNewInterest] = useState('');

  const commonInterests = [
    'Photography', 'Travel', 'Reading', 'Cooking', 'Gaming', 'Sports',
    'Music', 'Fitness', 'Hiking', 'Art', 'Writing', 'Volunteering',
    'Technology', 'Gardening', 'Dancing', 'Movies', 'Learning Languages',
    'Chess', 'Yoga', 'Swimming', 'Cycling', 'Drawing', 'Podcasts'
  ];

  const addInterest = () => {
    if (newInterest.trim() && !data.includes(newInterest.trim())) {
      onChange([...data, newInterest.trim()]);
      setNewInterest('');
      toast.success(`Added "${newInterest.trim()}" to interests`);
    } else if (data.includes(newInterest.trim())) {
      toast.error('Interest already added');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    onChange(data.filter(interest => interest !== interestToRemove));
    toast.success('Interest removed');
  };

  const addCommonInterest = (interest: string) => {
    if (!data.includes(interest)) {
      onChange([...data, interest]);
      toast.success(`Added "${interest}" to interests`);
    } else {
      toast.error('Interest already added');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Interests & Hobbies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest (e.g., Photography, Travel, etc.)"
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={addInterest} disabled={!newInterest.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Common Interests */}
        {data.length === 0 && (
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-pink-900 dark:text-pink-100">Popular Interests</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {commonInterests.map((interest) => (
                <Button
                  key={interest}
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonInterest(interest)}
                  className="justify-start text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {interest}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Current Interests */}
        <div className="flex flex-wrap gap-2">
          {data.map((interest) => (
            <Badge key={interest} variant="secondary" className="flex items-center gap-1 px-3 py-1">
              {interest}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1"
                onClick={() => removeInterest(interest)}
              />
            </Badge>
          ))}
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No interests added yet.</p>
            <p className="text-sm">Start typing to add your interests or choose from popular options above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterestsForm;
