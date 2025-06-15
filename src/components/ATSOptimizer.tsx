
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Target, Zap, TrendingUp, Brain } from 'lucide-react';

interface ATSOptimizerProps {
  resumeData: any;
  onOptimize: (suggestions: any) => void;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ resumeData, onOptimize }) => {
  const [atsScore, setAtsScore] = useState(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState<any>(null);

  const analyzeATS = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = performComprehensiveAnalysis();
      const score = calculateAdvancedATSScore(analysis);
      const newSuggestions = generateAdvancedSuggestions(analysis);
      
      setAtsScore(score);
      setSuggestions(newSuggestions);
      setDetailedAnalysis(analysis);
      setIsAnalyzing(false);
      
      onOptimize({ score, suggestions: newSuggestions, analysis });
    }, 1500);
  };

  const performComprehensiveAnalysis = () => {
    const analysis = {
      contactInfo: {
        hasName: !!resumeData.personal?.fullName,
        hasEmail: !!resumeData.personal?.email,
        hasPhone: !!resumeData.personal?.phone,
        hasLocation: !!resumeData.personal?.location,
        score: 0
      },
      content: {
        hasSummary: !!resumeData.personal?.summary,
        summaryLength: resumeData.personal?.summary?.length || 0,
        experienceCount: resumeData.experience?.length || 0,
        educationCount: resumeData.education?.length || 0,
        skillsCount: resumeData.skills?.length || 0,
        projectsCount: resumeData.projects?.length || 0,
        score: 0
      },
      keywords: {
        totalKeywords: resumeData.skills?.length || 0,
        technicalSkills: 0,
        softSkills: 0,
        industryTerms: 0,
        score: 0
      },
      formatting: {
        bulletPoints: 0,
        quantifiedAchievements: 0,
        actionVerbs: 0,
        consistentDates: true,
        score: 0
      },
      completeness: {
        missingProfessionalSummary: !resumeData.personal?.summary,
        missingWorkExperience: !resumeData.experience?.length,
        missingEducation: !resumeData.education?.length,
        missingSkills: !resumeData.skills?.length,
        score: 0
      }
    };

    // Calculate contact info score
    const contactFields = [analysis.contactInfo.hasName, analysis.contactInfo.hasEmail, 
                          analysis.contactInfo.hasPhone, analysis.contactInfo.hasLocation];
    analysis.contactInfo.score = (contactFields.filter(Boolean).length / contactFields.length) * 100;

    // Analyze content quality
    if (analysis.content.hasSummary && analysis.content.summaryLength > 50) analysis.content.score += 25;
    if (analysis.content.experienceCount > 0) analysis.content.score += 30;
    if (analysis.content.educationCount > 0) analysis.content.score += 20;
    if (analysis.content.skillsCount >= 5) analysis.content.score += 25;

    // Analyze keywords and skills
    if (resumeData.skills) {
      const technicalSkills = ['JavaScript', 'Python', 'React', 'SQL', 'AWS', 'Docker', 'Git'];
      const softSkills = ['Leadership', 'Communication', 'Problem Solving', 'Teamwork'];
      
      analysis.keywords.technicalSkills = resumeData.skills.filter((skill: string) =>
        technicalSkills.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))
      ).length;
      
      analysis.keywords.softSkills = resumeData.skills.filter((skill: string) =>
        softSkills.some(soft => skill.toLowerCase().includes(soft.toLowerCase()))
      ).length;
      
      analysis.keywords.score = Math.min(100, (analysis.keywords.totalKeywords * 10));
    }

    // Analyze formatting and achievements
    if (resumeData.experience) {
      resumeData.experience.forEach((exp: any) => {
        if (exp.description) {
          const bullets = (exp.description.match(/[•\-\*]/g) || []).length;
          analysis.formatting.bulletPoints += bullets;
          
          const numbers = (exp.description.match(/\d+/g) || []).length;
          analysis.formatting.quantifiedAchievements += numbers;
          
          const actionVerbs = ['Led', 'Managed', 'Developed', 'Implemented', 'Achieved', 'Improved'];
          const verbCount = actionVerbs.filter(verb => 
            exp.description.toLowerCase().includes(verb.toLowerCase())
          ).length;
          analysis.formatting.actionVerbs += verbCount;
        }
      });
      
      analysis.formatting.score = Math.min(100, 
        (analysis.formatting.bulletPoints * 5) + 
        (analysis.formatting.quantifiedAchievements * 10) + 
        (analysis.formatting.actionVerbs * 8)
      );
    }

    return analysis;
  };

  const calculateAdvancedATSScore = (analysis: any) => {
    const weights = {
      contactInfo: 0.2,
      content: 0.3,
      keywords: 0.25,
      formatting: 0.15,
      completeness: 0.1
    };

    let totalScore = 0;
    totalScore += analysis.contactInfo.score * weights.contactInfo;
    totalScore += analysis.content.score * weights.content;
    totalScore += analysis.keywords.score * weights.keywords;
    totalScore += analysis.formatting.score * weights.formatting;
    totalScore += (100 - (Object.values(analysis.completeness).filter(Boolean).length * 25)) * weights.completeness;

    return Math.round(totalScore);
  };

  const generateAdvancedSuggestions = (analysis: any) => {
    const suggestions = [];
    
    // Contact information suggestions
    if (!analysis.contactInfo.hasName) {
      suggestions.push({
        type: 'error',
        category: 'Contact Info',
        message: 'Add your full name - required for ATS processing',
        impact: 'Critical',
        priority: 1
      });
    }
    
    if (!analysis.contactInfo.hasEmail) {
      suggestions.push({
        type: 'error',
        category: 'Contact Info',
        message: 'Add professional email address',
        impact: 'Critical',
        priority: 1
      });
    }

    if (!analysis.contactInfo.hasPhone) {
      suggestions.push({
        type: 'warning',
        category: 'Contact Info',
        message: 'Add phone number for better reachability',
        impact: 'High',
        priority: 2
      });
    }

    // Content suggestions
    if (!analysis.content.hasSummary) {
      suggestions.push({
        type: 'warning',
        category: 'Professional Summary',
        message: 'Add a compelling professional summary (2-3 sentences)',
        impact: 'High',
        priority: 2
      });
    } else if (analysis.content.summaryLength < 100) {
      suggestions.push({
        type: 'info',
        category: 'Professional Summary',
        message: 'Expand your summary to 100-200 characters for better ATS scoring',
        impact: 'Medium',
        priority: 3
      });
    }

    if (analysis.content.experienceCount === 0) {
      suggestions.push({
        type: 'error',
        category: 'Work Experience',
        message: 'Add work experience - critical for ATS compatibility',
        impact: 'Critical',
        priority: 1
      });
    } else if (analysis.content.experienceCount < 2) {
      suggestions.push({
        type: 'info',
        category: 'Work Experience',
        message: 'Consider adding more work experience entries if available',
        impact: 'Medium',
        priority: 3
      });
    }

    // Skills suggestions
    if (analysis.keywords.totalKeywords < 5) {
      suggestions.push({
        type: 'warning',
        category: 'Skills',
        message: 'Add more relevant skills (aim for 8-12 total)',
        impact: 'High',
        priority: 2
      });
    }

    if (analysis.keywords.technicalSkills === 0) {
      suggestions.push({
        type: 'info',
        category: 'Technical Skills',
        message: 'Add technical skills relevant to your field',
        impact: 'Medium',
        priority: 3
      });
    }

    // Formatting suggestions
    if (analysis.formatting.bulletPoints < 3) {
      suggestions.push({
        type: 'info',
        category: 'Formatting',
        message: 'Use bullet points in experience descriptions for better readability',
        impact: 'Medium',
        priority: 3
      });
    }

    if (analysis.formatting.quantifiedAchievements < 2) {
      suggestions.push({
        type: 'info',
        category: 'Achievements',
        message: 'Add quantified achievements (numbers, percentages, dollar amounts)',
        impact: 'Medium',
        priority: 3
      });
    }

    if (analysis.formatting.actionVerbs < 3) {
      suggestions.push({
        type: 'info',
        category: 'Action Verbs',
        message: 'Start bullet points with strong action verbs (Led, Managed, Developed)',
        impact: 'Medium',
        priority: 3
      });
    }

    return suggestions.sort((a, b) => a.priority - b.priority);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent - ATS Ready';
    if (score >= 70) return 'Good - Minor Improvements';
    if (score >= 50) return 'Fair - Needs Optimization';
    return 'Poor - Major Issues';
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return <XCircle className="h-4 w-4 text-red-500" />;
      case 2: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 3: return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    if (resumeData) {
      analyzeATS();
    }
  }, [resumeData]);

  return (
    <Card className="w-full shadow-lg border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Advanced ATS Optimizer
          {atsScore > 0 && (
            <Badge variant={atsScore >= 70 ? "default" : "destructive"} className="ml-2">
              {atsScore}%
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          AI-powered analysis for maximum ATS compatibility and ranking
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enhanced ATS Score Display */}
        <div className="text-center space-y-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
          <div className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
            {atsScore}%
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {getScoreLabel(atsScore)}
          </div>
          <Progress value={atsScore} className="w-full h-3" />
          
          {/* Score Breakdown */}
          {detailedAnalysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs">
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-medium text-blue-600">{Math.round(detailedAnalysis.contactInfo.score)}%</div>
                <div className="text-gray-600">Contact</div>
              </div>
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-medium text-green-600">{Math.round(detailedAnalysis.content.score)}%</div>
                <div className="text-gray-600">Content</div>
              </div>
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-medium text-purple-600">{Math.round(detailedAnalysis.keywords.score)}%</div>
                <div className="text-gray-600">Keywords</div>
              </div>
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-medium text-orange-600">{Math.round(detailedAnalysis.formatting.score)}%</div>
                <div className="text-gray-600">Format</div>
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={analyzeATS} 
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deep Analysis in Progress...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Run Advanced ATS Analysis
            </>
          )}
        </Button>

        {/* Prioritized Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Optimization Roadmap ({suggestions.length} items)
            </h3>
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getPriorityIcon(suggestion.priority)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.category}
                    </Badge>
                    <Badge 
                      variant={suggestion.impact === 'Critical' ? 'destructive' : 
                              suggestion.impact === 'High' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {suggestion.impact} Impact
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Priority {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {suggestion.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced ATS Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Pro ATS Optimization Tips
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use standard section headings (Experience, Education, Skills)</li>
            <li>• Include job-relevant keywords naturally throughout content</li>
            <li>• Quantify achievements with specific numbers and percentages</li>
            <li>• Start bullet points with strong action verbs</li>
            <li>• Save as PDF to preserve formatting across ATS systems</li>
            <li>• Tailor your resume for each specific job application</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ATSOptimizer;
