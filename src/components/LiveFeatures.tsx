import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Zap, Target, Brain, Search, BarChart3, CheckCircle, AlertCircle, TrendingUp, Mail } from 'lucide-react';
import { toast } from 'sonner';
import ResumeTracker from './ResumeTracker';

interface LiveFeaturesProps {
  resumeData: any;
  onResumeUpdate: (data: any) => void;
  jobDescription?: string;
}

const LiveFeatures: React.FC<LiveFeaturesProps> = ({ resumeData, onResumeUpdate, jobDescription: externalJobDescription }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState(externalJobDescription || '');
  const [atsScore, setATSScore] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showResumeTracker, setShowResumeTracker] = useState(false);

  const generateResumeContent = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhancedData = {
        ...resumeData,
        personal: {
          ...resumeData.personal,
          summary: resumeData.personal?.summary || "Experienced professional with strong technical skills and proven track record of delivering high-quality solutions. Passionate about leveraging cutting-edge technology to drive business growth and innovation."
        }
      };
      
      onResumeUpdate(enhancedData);
      toast.success('Resume content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const autoFormatContent = () => {
    const formattedData = { ...resumeData };
    
    // Auto-format experience descriptions
    if (formattedData.experience) {
      formattedData.experience = formattedData.experience.map((exp: any) => ({
        ...exp,
        description: exp.description
          ?.split('.')
          .filter((sentence: string) => sentence.trim())
          .map((sentence: string) => `• ${sentence.trim()}`)
          .join('\n') || ''
      }));
    }
    
    onResumeUpdate(formattedData);
    toast.success('Content auto-formatted!');
  };

  const extractKeywords = () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }
    
    const keywords = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 20);
    
    const updatedData = {
      ...resumeData,
      skills: [...new Set([...(resumeData.skills || []), ...keywords.slice(0, 10)])]
    };
    
    onResumeUpdate(updatedData);
    toast.success(`Extracted ${keywords.length} keywords!`);
  };

  const analyzeATS = () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }
    
    // Simulate ATS analysis
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    setATSScore(score);
    
    setAnalysisResults({
      score,
      strengths: ['Strong technical skills match', 'Good keyword density', 'Clear formatting'],
      improvements: ['Add more industry keywords', 'Include quantified achievements', 'Optimize section headers'],
      missingKeywords: ['cloud computing', 'agile methodology', 'team leadership']
    });
    
    toast.success(`ATS Score: ${score}%`);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Resume Enhancement
          </CardTitle>
          <CardDescription>
            Automate your resume creation with intelligent AI features and tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="generator">Generator</TabsTrigger>
              <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
              <TabsTrigger value="ats">ATS Analysis</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={generateResumeContent}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'One-Click Generate'}
                </Button>
                
                <Button 
                  onClick={autoFormatContent}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Auto-Format Content
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description (Optional)</label>
                <Textarea
                  placeholder="Paste job description here for AI optimization..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={extractKeywords}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Extract Keywords
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="optimizer" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Smart Optimization</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline">Enhance Descriptions</Button>
                    <Button size="sm" variant="outline">Optimize Keywords</Button>
                    <Button size="sm" variant="outline">Improve Structure</Button>
                    <Button size="sm" variant="outline">Professional Tone</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ats" className="space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={analyzeATS}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analyze ATS Compatibility
                </Button>
                
                {analysisResults && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{atsScore}%</div>
                      <div className="text-sm text-gray-600">ATS Compatibility Score</div>
                      <Progress value={atsScore} className="mt-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="text-sm space-y-1">
                          {analysisResults.strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Improvements
                        </h4>
                        <ul className="text-sm space-y-1">
                          {analysisResults.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500">•</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Suggested Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.missingKeywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Resume Tracking & Email Automation</h3>
                  <p className="text-gray-600 mb-6">
                    Send your resume with advanced tracking capabilities and see when it's opened, downloaded, and reviewed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600">✨ Tracking Features</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Email open notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Resume download tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Location & device info
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Real-time analytics
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-600">🚀 Email Automation</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Professional email templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Auto-generated content
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Customizable messages
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Direct job application
                      </li>
                    </ul>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowResumeTracker(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Launch Resume Tracker
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">8.2</div>
                  <div className="text-sm text-gray-600">Readability Score</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600">Keyword Match</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resume Tracker Modal */}
      {showResumeTracker && (
        <ResumeTracker
          resumeData={resumeData}
          onClose={() => setShowResumeTracker(false)}
        />
      )}
    </>
  );
};

export default LiveFeatures;
