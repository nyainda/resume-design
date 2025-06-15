
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Target, 
  Zap, 
  TrendingUp, 
  FileText,
  Search,
  Eye,
  Award,
  BarChart3,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { useAPIKey } from '@/hooks/useAPIKey';
import { supabase } from '@/integrations/supabase/client';

interface ATSAnalyzerProps {
  resumeData: any;
  jobDescription?: string;
  onOptimizationApplied?: (optimizedData: any) => void;
}

interface ATSAnalysis {
  overallScore: number;
  sections: {
    formatting: { score: number; issues: string[]; recommendations: string[] };
    keywords: { score: number; missing: string[]; found: string[]; density: number };
    structure: { score: number; issues: string[]; recommendations: string[] };
    content: { score: number; issues: string[]; recommendations: string[] };
    atsCompatibility: { score: number; issues: string[]; recommendations: string[] };
  };
  suggestions: Array<{
    type: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
    action?: string;
  }>;
}

const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({ 
  resumeData, 
  jobDescription, 
  onOptimizationApplied 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { hasApiKey, getApiKey } = useAPIKey();

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const apiKey = getApiKey('gemini') || getApiKey('openai');
      
      if (!apiKey) {
        toast.info('Running basic analysis. Add your AI API key in settings for detailed insights.');
      }

      const { data, error } = await supabase.functions.invoke('ats-ai-analyzer', {
        body: { 
          resumeData, 
          jobDescription,
          apiKey
        }
      });

      if (error) {
        console.error('ATS analysis error:', error);
        toast.error('Analysis failed. Running fallback analysis.');
      }

      if (data) {
        setAnalysis(data);
        if (hasApiKey) {
          toast.success('AI-powered ATS analysis completed!');
        } else {
          toast.success('Basic ATS analysis completed!');
        }
      }
    } catch (error: any) {
      console.error('ATS analysis error:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performLocalAnalysis = () => {
    const analysis: ATSAnalysis = {
      overallScore: 0,
      sections: {
        formatting: { score: 0, issues: [], recommendations: [] },
        keywords: { score: 0, missing: [], found: [], density: 0 },
        structure: { score: 0, issues: [], recommendations: [] },
        content: { score: 0, issues: [], recommendations: [] },
        atsCompatibility: { score: 0, issues: [], recommendations: [] }
      },
      suggestions: []
    };

    // Analyze formatting
    let formatScore = 100;
    if (!resumeData.personal?.fullName) {
      analysis.sections.formatting.issues.push('Missing full name');
      analysis.sections.formatting.recommendations.push('Add your full name at the top');
      formatScore -= 20;
    }
    if (!resumeData.personal?.email) {
      analysis.sections.formatting.issues.push('Missing email address');
      analysis.sections.formatting.recommendations.push('Include a professional email address');
      formatScore -= 20;
    }
    if (!resumeData.personal?.phone) {
      analysis.sections.formatting.issues.push('Missing phone number');
      analysis.sections.formatting.recommendations.push('Add your phone number for contact');
      formatScore -= 15;
    }
    analysis.sections.formatting.score = Math.max(0, formatScore);

    // Analyze keywords
    const skills = resumeData.skills || [];
    const keywordDensity = skills.length / Math.max(1, (resumeData.personal?.summary?.split(' ').length || 0));
    analysis.sections.keywords.density = keywordDensity * 100;
    analysis.sections.keywords.found = skills;
    
    if (jobDescription) {
      const jobKeywords = jobDescription.toLowerCase().match(/\b\w{4,}\b/g) || [];
      const missingKeywords = jobKeywords.filter(keyword => 
        !skills.some(skill => skill.toLowerCase().includes(keyword))
      ).slice(0, 10);
      analysis.sections.keywords.missing = [...new Set(missingKeywords)];
    }

    let keywordScore = Math.min(100, skills.length * 8);
    if (analysis.sections.keywords.missing.length > 5) keywordScore -= 20;
    analysis.sections.keywords.score = keywordScore;

    // Analyze structure
    let structureScore = 100;
    if (!resumeData.experience?.length) {
      analysis.sections.structure.issues.push('No work experience section');
      analysis.sections.structure.recommendations.push('Add work experience with job titles and descriptions');
      structureScore -= 30;
    }
    if (!resumeData.education?.length) {
      analysis.sections.structure.issues.push('No education section');
      analysis.sections.structure.recommendations.push('Include your educational background');
      structureScore -= 20;
    }
    if (!resumeData.skills?.length) {
      analysis.sections.structure.issues.push('No skills section');
      analysis.sections.structure.recommendations.push('Add relevant technical and soft skills');
      structureScore -= 25;
    }
    analysis.sections.structure.score = Math.max(0, structureScore);

    // Analyze content quality
    let contentScore = 100;
    if (!resumeData.personal?.summary) {
      analysis.sections.content.issues.push('Missing professional summary');
      analysis.sections.content.recommendations.push('Add a compelling 2-3 sentence summary');
      contentScore -= 25;
    }
    
    const experienceWithNumbers = resumeData.experience?.filter((exp: any) => 
      exp.description && /\d+/.test(exp.description)
    ).length || 0;
    
    if (experienceWithNumbers === 0 && resumeData.experience?.length > 0) {
      analysis.sections.content.issues.push('No quantified achievements');
      analysis.sections.content.recommendations.push('Add numbers, percentages, or metrics to your achievements');
      contentScore -= 20;
    }
    analysis.sections.content.score = Math.max(0, contentScore);

    // ATS Compatibility
    let atsScore = 100;
    if (resumeData.personal?.summary && resumeData.personal.summary.length < 100) {
      analysis.sections.atsCompatibility.issues.push('Summary too short for ATS optimization');
      analysis.sections.atsCompatibility.recommendations.push('Expand summary to 100-200 characters');
      atsScore -= 15;
    }
    analysis.sections.atsCompatibility.score = Math.max(0, atsScore);

    // Calculate overall score
    const scores = Object.values(analysis.sections).map(section => section.score);
    analysis.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Generate suggestions
    if (analysis.overallScore < 70) {
      analysis.suggestions.push({
        type: 'critical',
        category: 'Overall',
        message: 'Your resume needs significant improvements for ATS compatibility',
        action: 'Focus on the critical issues first'
      });
    }

    setAnalysis(analysis);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    if (score >= 50) return 'outline';
    return 'destructive';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      analyzeWithAI();
    }
  }, [resumeData, jobDescription]);

  return (
    <Card className="w-full shadow-lg border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20">
      <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/20 dark:to-blue-400/20">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          AI-Powered ATS Analyzer
          {analysis && (
            <Badge variant={getScoreBadgeVariant(analysis.overallScore)} className="ml-2">
              {analysis.overallScore}% {getScoreLabel(analysis.overallScore)}
            </Badge>
          )}
          {!hasApiKey && (
            <Badge variant="outline" className="ml-2 text-xs">
              Basic Mode
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Overall Score Display */}
        {analysis && (
          <div className="text-center mb-6 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)} mb-2`}>
              {analysis.overallScore}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-3">
              ATS Compatibility Score
            </div>
            <Progress value={analysis.overallScore} className="w-full h-3 mb-4" />
            
            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Re-analyze
                  </>
                )}
              </Button>
              
              {!hasApiKey && (
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Go to Settings to add your AI API key for detailed analysis')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Setup AI
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Detailed Analysis Tabs */}
        {analysis && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="formatting">Format</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="suggestions">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(analysis.sections).map(([key, section]) => (
                  <div key={key} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <div className={`text-xl font-bold ${getScoreColor(section.score)}`}>
                      {section.score}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Suggestions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Key Recommendations</h3>
                {analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {suggestion.category}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {suggestion.message}
                      </div>
                      {suggestion.action && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          💡 {suggestion.action}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="formatting" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold">Formatting Analysis</h3>
                  <Badge variant={getScoreBadgeVariant(analysis.sections.formatting.score)}>
                    {analysis.sections.formatting.score}%
                  </Badge>
                </div>
                
                {analysis.sections.formatting.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Issues Found:</h4>
                    {analysis.sections.formatting.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.sections.formatting.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Recommendations:</h4>
                    {analysis.sections.formatting.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold">Keyword Analysis</h3>
                  <Badge variant={getScoreBadgeVariant(analysis.sections.keywords.score)}>
                    {analysis.sections.keywords.score}%
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      Found Keywords ({analysis.sections.keywords.found.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.sections.keywords.found.slice(0, 10).map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {analysis.sections.keywords.missing.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                        Suggested Keywords ({analysis.sections.keywords.missing.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.sections.keywords.missing.slice(0, 8).map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold">Structure Analysis</h3>
                  <Badge variant={getScoreBadgeVariant(analysis.sections.structure.score)}>
                    {analysis.sections.structure.score}%
                  </Badge>
                </div>

                {analysis.sections.structure.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Structure Issues:</h4>
                    {analysis.sections.structure.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.sections.structure.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Recommendations:</h4>
                    {analysis.sections.structure.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold">All Optimization Tips</h3>
                </div>

                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {suggestion.category}
                          </span>
                          <Badge 
                            variant={suggestion.type === 'critical' ? 'destructive' : 
                                   suggestion.type === 'warning' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {suggestion.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {suggestion.message}
                        </div>
                        {suggestion.action && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            💡 Action: {suggestion.action}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">ATS Best Practices</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Use standard section headers (Experience, Education, Skills)</li>
                    <li>• Include relevant keywords from the job description</li>
                    <li>• Quantify achievements with numbers and percentages</li>
                    <li>• Use a clean, simple format without complex graphics</li>
                    <li>• Save as PDF to preserve formatting</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!analysis && !isAnalyzing && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Add your resume information to get started with ATS analysis
            </p>
            <Button 
              onClick={analyzeWithAI}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Analyze Current Resume
            </Button>
          </div>
        )}

        {isAnalyzing && !analysis && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {hasApiKey ? 'Running AI-powered analysis...' : 'Running basic analysis...'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATSAnalyzer;
