import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Star, Award, Zap, Sparkles, Loader2, Bot, Brain, Target, Menu } from 'lucide-react';

// Mock useAPIKey hook for demo
const useAPIKey = () => ({ apiKey: 'demo-key' });

interface Skill {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Tool' | 'Framework';
}

interface EnhancedSkillsFormProps {
  data?: string[] | Array<{name: string; level: string; category: string}>;
  onChange?: (data: string[] | Array<{name: string; level: string; category: string}>) => void;
}

const EnhancedSkillsForm: React.FC<EnhancedSkillsFormProps> = ({ 
  data = [], 
  onChange = () => {} 
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<Skill['level']>('Intermediate');
  const [newCategory, setNewCategory] = useState<Skill['category']>('Technical');
  const [isEnhancedMode, setIsEnhancedMode] = useState(false);
  
  // AI-related state
  const [jobDescription, setJobDescription] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const { apiKey } = useAPIKey();

  // Initialize skills from data prop
  useEffect(() => {
    if (!data || data.length === 0) {
      setSkills([]);
      setIsEnhancedMode(false);
      return;
    }

    // Check if data is enhanced format (with level and category)
    const isEnhanced = Array.isArray(data) && data.length > 0 && 
      typeof data[0] === 'object' && 'level' in data[0] && 'category' in data[0];

    setIsEnhancedMode(isEnhanced);

    if (isEnhanced) {
      // Data is already in enhanced format
      const enhancedData = data as Array<{name: string; level: string; category: string}>;
      const skillsArray = enhancedData.map((skill, index) => ({
        id: index + 1,
        name: skill.name,
        level: (skill.level as Skill['level']) || 'Intermediate',
        category: (skill.category as Skill['category']) || 'Technical'
      }));
      setSkills(skillsArray);
    } else {
      // Data is simple string array
      const stringData = data as string[];
      const skillsArray = stringData.map((skillName, index) => ({
        id: index + 1,
        name: skillName,
        level: 'Intermediate' as const,
        category: 'Technical' as const
      }));
      setSkills(skillsArray);
    }
  }, [data]);

  const updateSkillsData = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    
    if (isEnhancedMode) {
      // Return enhanced format
      onChange(updatedSkills.map(skill => ({
        name: skill.name,
        level: skill.level,
        category: skill.category
      })));
    } else {
      // Return simple string array
      onChange(updatedSkills.map(skill => skill.name));
    }
  };

  const toggleEnhancedMode = () => {
    const newMode = !isEnhancedMode;
    setIsEnhancedMode(newMode);
    
    if (newMode) {
      // Switch to enhanced mode
      onChange(skills.map(skill => ({
        name: skill.name,
        level: skill.level,
        category: skill.category
      })));
    } else {
      // Switch to simple mode
      onChange(skills.map(skill => skill.name));
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    // Check for duplicates
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      return;
    }
    
    const skill: Skill = {
      id: Date.now(),
      name: newSkill.trim(),
      level: newLevel,
      category: newCategory
    };
    
    updateSkillsData([...skills, skill]);
    setNewSkill('');
  };

  // AI skill generation function
  const generateSkillsWithAI = async () => {
    if (!apiKey) {
      alert('Please set up your Gemini API key first');
      return;
    }

    if (!jobDescription.trim() && !currentRole.trim()) {
      alert('Please provide either a job description or your current role');
      return;
    }

    setIsGenerating(true);

    // Simulated AI response for demo
    setTimeout(() => {
      const demoSkills = [
        { name: 'React', level: 'Advanced', category: 'Framework' },
        { name: 'TypeScript', level: 'Intermediate', category: 'Technical' },
        { name: 'Team Leadership', level: 'Intermediate', category: 'Soft' },
        { name: 'Node.js', level: 'Advanced', category: 'Technical' },
        { name: 'Problem Solving', level: 'Advanced', category: 'Soft' }
      ];

      const validSkills = demoSkills
        .filter(skill => 
          !skills.some(existingSkill => 
            existingSkill.name.toLowerCase() === skill.name.toLowerCase()
          )
        )
        .map(skill => ({
          id: Date.now() + Math.random(),
          name: skill.name,
          level: skill.level as Skill['level'],
          category: skill.category as Skill['category']
        }));

      if (validSkills.length > 0) {
        updateSkillsData([...skills, ...validSkills]);
        setShowAIPanel(false);
        setJobDescription('');
        setCurrentRole('');
      }
      
      setIsGenerating(false);
    }, 2000);
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
      case 'Expert': return <Award className="w-4 h-4 text-amber-500" />;
      case 'Advanced': return <Star className="w-4 h-4 text-blue-500" />;
      case 'Intermediate': return <Zap className="w-4 h-4 text-emerald-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-slate-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'Advanced': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'Intermediate': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'Soft': return 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300';
      case 'Language': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';
      case 'Tool': return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'Framework': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex-shrink-0">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Skills Management
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 hidden sm:block">
                  Manage your professional skills with AI assistance
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAIPanel(!showAIPanel)}
                disabled={!apiKey}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 justify-center sm:justify-start"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleEnhancedMode}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 justify-center sm:justify-start"
              >
                {isEnhancedMode ? 'Simple Mode' : 'Enhanced Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AI Generation Panel */}
      {showAIPanel && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6">
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold">AI Skills Generator</h3>
                <p className="text-purple-100 text-sm hidden sm:block">Let AI suggest relevant skills for your profile</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Current Role</Label>
                <Input
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g., Frontend Developer, Data Analyst"
                  className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Target Role</Label>
                <Input
                  placeholder="e.g., Senior Developer, Team Lead"
                  className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Job Description</Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste a job description or describe the skills you want to develop..."
                rows={4}
                className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={generateSkillsWithAI}
                disabled={isGenerating || (!jobDescription.trim() && !currentRole.trim())}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Generate Skills
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAIPanel(false)}
                className="border-slate-200 dark:border-slate-600 sm:w-auto justify-center"
              >
                Cancel
              </Button>
            </div>
            
            {!apiKey && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Configure your Gemini API key to use AI skill generation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Skill Addition */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Add Skill Manually
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-4">
            {/* Skill Name - Always full width on mobile */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Skill Name</Label>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., JavaScript, Leadership"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
              />
            </div>
            
            {/* Enhanced mode fields */}
            {isEnhancedMode && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300 font-medium">Proficiency</Label>
                  <Select value={newLevel} onValueChange={(value: Skill['level']) => setNewLevel(value)}>
                    <SelectTrigger className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
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
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300 font-medium">Category</Label>
                  <Select value={newCategory} onValueChange={(value: Skill['category']) => setNewCategory(value)}>
                    <SelectTrigger className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
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
              </div>
            )}
            
            {/* Add button */}
            <Button 
              onClick={addSkill} 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 justify-center"
              disabled={!newSkill.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Your Skills ({skills.length})
            </CardTitle>
            {skills.length > 0 && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 w-fit">
                {isEnhancedMode ? 'Enhanced View' : 'Simple View'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="group p-3 sm:p-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-200">
                  <div className="space-y-3">
                    {/* Skill name and level/category badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex items-center gap-3 min-w-0">
                          {isEnhancedMode && (
                            <div className="flex-shrink-0">
                              {getLevelIcon(skill.level)}
                            </div>
                          )}
                          <span className="font-medium text-slate-800 dark:text-slate-100 text-base sm:text-lg truncate">
                            {skill.name}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Enhanced mode badges and controls */}
                    {isEnhancedMode && (
                      <div className="space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`text-xs font-medium ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </Badge>
                          <Badge className={`text-xs font-medium ${getCategoryColor(skill.category)}`}>
                            {skill.category}
                          </Badge>
                        </div>
                        
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="flex-1">
                            <Select 
                              value={skill.level} 
                              onValueChange={(value: Skill['level']) => updateSkill(skill.id, 'level', value)}
                            >
                              <SelectTrigger className="h-9 border-slate-200 dark:border-slate-600">
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
                          
                          <div className="flex-1">
                            <Select 
                              value={skill.category} 
                              onValueChange={(value: Skill['category']) => updateSkill(skill.id, 'category', value)}
                            >
                              <SelectTrigger className="h-9 border-slate-200 dark:border-slate-600">
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">No skills added yet</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 px-4">
                Start building your skills profile by adding them manually or using AI generation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mode Information */}
      <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex-shrink-0">
              {isEnhancedMode ? (
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                {isEnhancedMode ? 'Enhanced Mode Active' : 'Simple Mode Active'}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEnhancedMode 
                  ? 'Skills include proficiency levels and categories for better organization and ATS optimization.'
                  : 'Skills are stored as a simple list. Switch to Enhanced Mode for detailed skill management.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSkillsForm;