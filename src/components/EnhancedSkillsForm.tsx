
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Star, Award, Zap } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Tool' | 'Framework';
}

interface EnhancedSkillsFormProps {
  data: string[];
  onChange: (data: Array<{name: string; level: string; category: string}> | string[]) => void;
}

const EnhancedSkillsForm: React.FC<EnhancedSkillsFormProps> = ({ data, onChange }) => {
  const [skills, setSkills] = useState<Skill[]>(() => 
    data.map((skill, index) => ({
      id: index,
      name: skill,
      level: 'Intermediate' as const,
      category: 'Technical' as const
    }))
  );
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<Skill['level']>('Intermediate');
  const [newCategory, setNewCategory] = useState<Skill['category']>('Technical');

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'HTML/CSS',
    'Git', 'AWS', 'Docker', 'TypeScript', 'Vue.js', 'Angular', 'MongoDB',
    'Express.js', 'PostgreSQL', 'Linux', 'Kubernetes', 'GraphQL', 'Redux'
  ];

  const updateSkillsData = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    // Return the enhanced skills data structure to the parent
    onChange(updatedSkills.map(skill => ({
      name: skill.name,
      level: skill.level,
      category: skill.category
    })));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      id: Date.now(),
      name: newSkill.trim(),
      level: newLevel,
      category: newCategory
    };
    
    updateSkillsData([...skills, skill]);
    setNewSkill('');
  };

  const addPopularSkill = (skillName: string) => {
    if (skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }
    
    const skill: Skill = {
      id: Date.now(),
      name: skillName,
      level: 'Intermediate',
      category: 'Technical'
    };
    
    updateSkillsData([...skills, skill]);
  };

  const removeSkill = (id: number) => {
    updateSkillsData(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: number, field: keyof Skill, value: string) => {
    updateSkillsData(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Expert': return <Award className="w-3 h-3 text-yellow-500" />;
      case 'Advanced': return <Star className="w-3 h-3 text-blue-500" />;
      case 'Intermediate': return <Zap className="w-3 h-3 text-green-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Intermediate': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'Soft': return 'bg-pink-100 text-pink-800';
      case 'Language': return 'bg-indigo-100 text-indigo-800';
      case 'Tool': return 'bg-orange-100 text-orange-800';
      case 'Framework': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Skills Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Add New Skill */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-4">Add New Skill</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Skill Name</Label>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., JavaScript"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
            </div>
            <div>
              <Label>Proficiency Level</Label>
              <Select value={newLevel} onValueChange={(value: Skill['level']) => setNewLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={(value: Skill['category']) => setNewCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Soft">Soft Skills</SelectItem>
                  <SelectItem value="Language">Language</SelectItem>
                  <SelectItem value="Tool">Tool</SelectItem>
                  <SelectItem value="Framework">Framework</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addSkill} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Skills */}
        <div>
          <h4 className="font-medium mb-3">Popular Skills</h4>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => addPopularSkill(skill)}
                disabled={skills.some(s => s.name.toLowerCase() === skill.toLowerCase())}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Skills */}
        <div>
          <h4 className="font-medium mb-4">Your Skills ({skills.length})</h4>
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(skill.level)}
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <Badge className={`text-xs ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </Badge>
                    <Badge className={`text-xs ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select 
                      value={skill.level} 
                      onValueChange={(value: Skill['level']) => updateSkill(skill.id, 'level', value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={skill.category} 
                      onValueChange={(value: Skill['category']) => updateSkill(skill.id, 'category', value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Soft">Soft Skills</SelectItem>
                        <SelectItem value="Language">Language</SelectItem>
                        <SelectItem value="Tool">Tool</SelectItem>
                        <SelectItem value="Framework">Framework</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No skills added yet. Add skills above or use popular skills.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSkillsForm;
