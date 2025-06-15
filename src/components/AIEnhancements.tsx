
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Lightbulb, CheckCircle, XCircle, Wand2, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIEnhancementsProps {
  resumeData: any;
  onApplySuggestion: (suggestion: any) => void;
}

const AIEnhancements: React.FC<AIEnhancementsProps> = ({ resumeData, onApplySuggestion }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (resumeData.id) {
      loadSuggestions();
    }
  }, [resumeData.id]);

  const loadSuggestions = async () => {
    if (!resumeData.id) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('resume_id', resumeData.id)
        .eq('is_applied', false)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const generateAISuggestions = async () => {
    setAnalyzing(true);
    try {
      // Simulate AI analysis - in a real app, this would call an AI service
      const newSuggestions = [
        {
          suggestion_type: 'content',
          section: 'experience',
          original_text: 'Worked on projects',
          suggested_text: 'Led cross-functional teams to deliver 5+ high-impact projects, resulting in 25% efficiency improvement',
          confidence_score: 0.92,
          reasoning: 'Add quantifiable achievements and leadership keywords'
        },
        {
          suggestion_type: 'keywords',
          section: 'skills',
          original_text: resumeData.skills?.join(', ') || '',
          suggested_text: 'Add trending skills: Machine Learning, Cloud Computing, DevOps',
          confidence_score: 0.85,
          reasoning: 'These skills are in high demand in your industry'
        },
        {
          suggestion_type: 'grammar',
          section: 'personal',
          original_text: resumeData.personal?.summary || '',
          suggested_text: 'Dynamic and results-driven professional with proven expertise in...',
          confidence_score: 0.78,
          reasoning: 'Stronger opening statement with action words'
        },
        {
          suggestion_type: 'structure',
          section: 'overall',
          original_text: 'Current section order',
          suggested_text: 'Reorder sections: Personal Info → Skills → Experience → Education',
          confidence_score: 0.88,
          reasoning: 'Skills-first layout performs better for ATS scanning'
        },
        {
          suggestion_type: 'achievements',
          section: 'experience',
          original_text: 'Managed team',
          suggested_text: 'Successfully managed and mentored a team of 8 developers, achieving 95% project delivery rate',
          confidence_score: 0.91,
          reasoning: 'Quantify team size and success metrics'
        }
      ];

      // Save suggestions to database
      for (const suggestion of newSuggestions) {
        await supabase.from('ai_suggestions').insert({
          resume_id: resumeData.id,
          user_id: user?.id,
          ...suggestion
        });
      }

      await loadSuggestions();
      toast({
        title: "AI Analysis Complete",
        description: `Generated ${newSuggestions.length} improvement suggestions`
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const applySuggestion = async (suggestion: any) => {
    try {
      await supabase
        .from('ai_suggestions')
        .update({ is_applied: true })
        .eq('id', suggestion.id);

      onApplySuggestion(suggestion);
      await loadSuggestions();

      toast({
        title: "Suggestion Applied",
        description: "Your resume has been updated with the AI suggestion"
      });
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to apply suggestion",
        variant: "destructive"
      });
    }
  };

  const dismissSuggestion = async (suggestionId: string) => {
    try {
      await supabase
        .from('ai_suggestions')
        .update({ is_applied: true })
        .eq('id', suggestionId);

      await loadSuggestions();
      toast({
        title: "Suggestion Dismissed",
        description: "The suggestion has been dismissed"
      });
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'content': return <Lightbulb className="h-4 w-4" />;
      case 'keywords': return <Target className="h-4 w-4" />;
      case 'grammar': return <CheckCircle className="h-4 w-4" />;
      case 'structure': return <TrendingUp className="h-4 w-4" />;
      case 'achievements': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-blue-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const skillGapAnalysis = [
    { skill: 'Machine Learning', gap: 'High', demand: 98, recommendation: 'Add online courses or projects' },
    { skill: 'Cloud Computing', gap: 'Medium', demand: 94, recommendation: 'Highlight existing AWS/Azure experience' },
    { skill: 'DevOps', gap: 'Low', demand: 87, recommendation: 'Emphasize CI/CD pipeline work' }
  ];

  const careerPaths = [
    { title: 'Senior Developer', match: 85, requirements: ['5+ years experience', 'Leadership skills', 'Architecture knowledge'] },
    { title: 'Tech Lead', match: 78, requirements: ['Team management', 'Technical mentoring', 'Project planning'] },
    { title: 'Solutions Architect', match: 72, requirements: ['System design', 'Enterprise patterns', 'Client facing'] }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Powered Enhancements
          </h3>
          <p className="text-sm text-gray-600">Smart suggestions to improve your resume</p>
        </div>
        <Button 
          onClick={generateAISuggestions} 
          disabled={analyzing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate AI Suggestions
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="skills">Skill Gap Analysis</TabsTrigger>
          <TabsTrigger value="career">Career Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length === 0 ? (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Click "Generate AI Suggestions" to get personalized recommendations for improving your resume.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getSuggestionIcon(suggestion.suggestion_type)}
                        {suggestion.suggestion_type.charAt(0).toUpperCase() + suggestion.suggestion_type.slice(1)} Improvement
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSuggestionColor(suggestion.confidence_score)}>
                          {Math.round(suggestion.confidence_score * 100)}% confidence
                        </Badge>
                        <Badge variant="secondary">{suggestion.section}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {suggestion.original_text && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-1">Current:</h5>
                        <p className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-200">
                          {suggestion.original_text}
                        </p>
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Suggested:</h5>
                      <p className="text-sm bg-green-50 p-2 rounded border-l-4 border-green-200">
                        {suggestion.suggested_text}
                      </p>
                    </div>
                    {suggestion.reasoning && (
                      <p className="text-xs text-gray-600 italic">💡 {suggestion.reasoning}</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => applySuggestion(suggestion)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => dismissSuggestion(suggestion.id)}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>Identify skills to boost your market competitiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGapAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{item.skill}</h4>
                        <Badge variant={
                          item.gap === 'High' ? 'destructive' :
                          item.gap === 'Medium' ? 'default' : 'secondary'
                        }>
                          {item.gap} Priority
                        </Badge>
                        <span className="text-sm text-gray-600">Market demand: {item.demand}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Path Recommendations</CardTitle>
              <CardDescription>Suggested career progression based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careerPaths.map((path, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{path.title}</h4>
                      <Badge variant="outline" className="text-green-600">
                        {path.match}% match
                      </Badge>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</h5>
                      <div className="flex flex-wrap gap-2">
                        {path.requirements.map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIEnhancements;
