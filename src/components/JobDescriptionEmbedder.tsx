
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, FileText, Zap, Target, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface JobDescriptionEmbedderProps {
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
  onOptimize?: () => void;
}

const JobDescriptionEmbedder: React.FC<JobDescriptionEmbedderProps> = ({
  jobDescription,
  onJobDescriptionChange,
  onOptimize
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [matchScore, setMatchScore] = useState(0);

  // Advanced keyword extraction with categorization
  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setAnalyzing(true);
    try {
      // Extract and categorize keywords
      const analysis = performAdvancedAnalysis(jobDescription);
      setAnalysisResult(analysis);
      
      // Calculate match score based on keyword density and requirements
      const score = calculateMatchScore(analysis);
      setMatchScore(score);
      
      toast.success(`Analysis complete! Found ${analysis.keywords.length} key terms and ${analysis.requirements.length} requirements`);
      
      if (onOptimize) {
        onOptimize();
      }
    } catch (error) {
      toast.error('Failed to analyze job description');
    } finally {
      setAnalyzing(false);
    }
  };

  const performAdvancedAnalysis = (text: string) => {
    const cleanText = text.toLowerCase();
    
    // Technical skills extraction
    const techSkills = [
      'javascript', 'python', 'react', 'angular', 'vue', 'node.js', 'java', 'c++', 'c#',
      'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'git', 'jenkins', 'ci/cd', 'agile', 'scrum', 'machine learning', 'ai', 'data science',
      'tensorflow', 'pytorch', 'html', 'css', 'typescript', 'php', 'ruby', 'golang',
      'microservices', 'api', 'rest', 'graphql', 'nosql', 'redis', 'elasticsearch'
    ].filter(skill => cleanText.includes(skill));

    // Soft skills extraction
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
      'creative', 'innovative', 'collaborative', 'adaptable', 'detail-oriented',
      'time management', 'project management', 'critical thinking', 'decision making',
      'interpersonal', 'organizational', 'multitasking', 'strategic thinking'
    ].filter(skill => cleanText.includes(skill));

    // Industry terms
    const industryTerms = extractIndustryTerms(cleanText);
    
    // Requirements extraction
    const requirements = extractRequirements(text);
    
    // Experience level detection
    const experienceLevel = detectExperienceLevel(cleanText);
    
    // Qualification extraction
    const qualifications = extractQualifications(cleanText);

    return {
      keywords: [...techSkills, ...softSkills, ...industryTerms],
      techSkills,
      softSkills,
      industryTerms,
      requirements,
      experienceLevel,
      qualifications,
      wordCount: text.split(/\s+/).length,
      keywordDensity: (techSkills.length + softSkills.length) / text.split(/\s+/).length * 100
    };
  };

  const extractIndustryTerms = (text: string): string[] => {
    const industryPatterns = [
      'fintech', 'healthcare', 'e-commerce', 'saas', 'b2b', 'b2c', 'startup',
      'enterprise', 'consulting', 'analytics', 'marketing', 'sales', 'product',
      'engineering', 'design', 'ux/ui', 'devops', 'security', 'compliance'
    ];
    
    return industryPatterns.filter(term => text.includes(term));
  };

  const extractRequirements = (text: string): string[] => {
    const requirements: string[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (
        trimmedLine.match(/^[•\-\*]/) || 
        trimmedLine.toLowerCase().includes('requirement') ||
        trimmedLine.toLowerCase().includes('must have') ||
        trimmedLine.toLowerCase().includes('required') ||
        trimmedLine.toLowerCase().includes('essential') ||
        trimmedLine.toLowerCase().includes('minimum')
      ) {
        requirements.push(trimmedLine.replace(/^[•\-\*]\s*/, ''));
      }
    });
    
    return requirements.slice(0, 12);
  };

  const detectExperienceLevel = (text: string): string => {
    if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
      return 'Senior (5+ years)';
    } else if (text.includes('mid-level') || text.includes('intermediate')) {
      return 'Mid-level (2-5 years)';
    } else if (text.includes('junior') || text.includes('entry') || text.includes('graduate')) {
      return 'Junior (0-2 years)';
    }
    return 'Not specified';
  };

  const extractQualifications = (text: string): string[] => {
    const qualifications: string[] = [];
    const degreePatterns = ['bachelor', 'master', 'phd', 'degree', 'certification'];
    
    degreePatterns.forEach(pattern => {
      if (text.includes(pattern)) {
        qualifications.push(pattern.charAt(0).toUpperCase() + pattern.slice(1));
      }
    });
    
    return [...new Set(qualifications)];
  };

  const calculateMatchScore = (analysis: any): number => {
    let score = 0;
    
    // Base score for having job description
    score += 20;
    
    // Keyword density bonus
    if (analysis.keywordDensity > 5) score += 25;
    else if (analysis.keywordDensity > 3) score += 15;
    else if (analysis.keywordDensity > 1) score += 10;
    
    // Technical skills bonus
    if (analysis.techSkills.length > 5) score += 20;
    else if (analysis.techSkills.length > 3) score += 15;
    else if (analysis.techSkills.length > 0) score += 10;
    
    // Requirements clarity bonus
    if (analysis.requirements.length > 5) score += 15;
    else if (analysis.requirements.length > 2) score += 10;
    else if (analysis.requirements.length > 0) score += 5;
    
    // Word count bonus (comprehensive description)
    if (analysis.wordCount > 300) score += 10;
    else if (analysis.wordCount > 150) score += 5;
    
    // Industry terms bonus
    if (analysis.industryTerms.length > 0) score += 10;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  useEffect(() => {
    if (jobDescription.length > 100) {
      // Auto-analyze when sufficient content is entered
      const timeoutId = setTimeout(() => {
        analyzeJobDescription();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [jobDescription]);

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50/50 to-blue-50/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-orange-600" />
            Advanced ATS Job Description Embedder
            {matchScore > 0 && (
              <Badge variant="secondary" className="ml-2">
                {matchScore}% Match
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={jobDescription ? "default" : "secondary"} className="text-xs">
              {jobDescription ? `${jobDescription.length} chars` : "Inactive"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="h-6 w-6 p-0"
            >
              {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </div>
        </div>
        
        {/* Quick Match Score Display */}
        {matchScore > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">ATS Optimization Score</span>
              <span className={`font-bold ${getScoreColor(matchScore)}`}>
                {getScoreLabel(matchScore)}
              </span>
            </div>
            <Progress value={matchScore} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      {isVisible && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Job Description (Invisibly Embedded for ATS)
            </label>
            <Textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste the complete job description here. Our advanced AI will extract keywords, requirements, and skills to optimize your resume for ATS systems while keeping it visually clean."
              className="min-h-[140px] text-sm resize-none"
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={analyzeJobDescription}
              disabled={analyzing || !jobDescription.trim()}
              size="sm"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Zap className="w-3 h-3" />
              {analyzing ? 'Analyzing...' : 'Advanced Analysis'}
            </Button>
            
            {jobDescription && (
              <>
                <Badge variant="outline" className="text-xs">
                  {jobDescription.split(/\s+/).length} words
                </Badge>
                {analysisResult && (
                  <Badge variant="outline" className="text-xs">
                    {analysisResult.keywords.length} keywords found
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-3 mt-4 p-4 bg-white/70 rounded-lg border">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Analysis Results
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Technical Skills */}
                {analysisResult.techSkills.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-blue-700">Technical Skills ({analysisResult.techSkills.length})</h5>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.techSkills.slice(0, 8).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Soft Skills */}
                {analysisResult.softSkills.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-green-700">Soft Skills ({analysisResult.softSkills.length})</h5>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.softSkills.slice(0, 6).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Experience Level & Qualifications */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-gray-600">Experience: {analysisResult.experienceLevel}</span>
                </div>
                {analysisResult.qualifications.length > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-orange-600" />
                    <span className="text-gray-600">Education: {analysisResult.qualifications.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Key Requirements */}
              {analysisResult.requirements.length > 0 && (
                <div className="space-y-1">
                  <h5 className="text-xs font-medium text-purple-700">Key Requirements</h5>
                  <div className="text-xs space-y-0.5 max-h-20 overflow-y-auto">
                    {analysisResult.requirements.slice(0, 5).map((req: string, idx: number) => (
                      <div key={idx} className="text-gray-600 flex items-start gap-1">
                        <span className="text-purple-600 mt-0.5">•</span>
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
            <strong className="text-blue-800">🚀 Advanced ATS Optimization:</strong> 
            <ul className="mt-1 space-y-0.5 text-blue-700">
              <li>• Intelligent keyword extraction and categorization</li>
              <li>• Requirements mapping and skill matching</li>
              <li>• Experience level detection and optimization</li>
              <li>• Invisible embedding preserves visual design</li>
              <li>• Real-time match scoring and suggestions</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default JobDescriptionEmbedder;
