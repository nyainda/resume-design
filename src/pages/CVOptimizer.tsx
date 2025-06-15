import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import {
  Upload,
  FileText,
  Zap,
  Download,
  ArrowLeft,
  Moon,
  Sun,
  Sparkles,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

const CVOptimizer = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [optimizedText, setOptimizedText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let text = '';
          
          if (file.type === 'text/plain') {
            text = e.target?.result as string;
          } else if (file.type === 'application/pdf') {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            const decoder = new TextDecoder('latin1');
            const content = decoder.decode(uint8Array);
            
            // Extract text from PDF
            const textMatches = content.match(/BT[\s\S]*?ET/g) || [];
            let pdfText = '';
            textMatches.forEach(match => {
              const textParts = match.match(/\((.*?)\)/g) || [];
              textParts.forEach(part => {
                const cleanText = part.replace(/[()]/g, '').trim();
                if (cleanText.length > 2) {
                  pdfText += cleanText + ' ';
                }
              });
            });
            
            text = pdfText.trim();
          } else {
            // For other document types
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            const decoder = new TextDecoder('utf-8');
            const content = decoder.decode(uint8Array);
            
            text = content
              .replace(/[^\x20-\x7E\s]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          }
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file, 'UTF-8');
      }
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const text = await extractTextFromFile(file);
      
      if (!text || text.length < 20) {
        throw new Error('Could not extract readable text from file');
      }
      
      setExtractedText(text);
      setIsProcessing(false);
      toast.success('File processed successfully!');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process the file. Please try a different format.');
      setIsProcessing(false);
    }
  };

  const optimizeCV = async () => {
    if (!extractedText) {
      toast.error('Please upload a CV first');
      return;
    }

    setIsOptimizing(true);

    try {
      // Call Supabase edge function for AI optimization
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: {
          cvContent: extractedText,
          jobDescription: jobDescription || '',
          optimizationType: 'comprehensive'
        }
      });

      if (error) {
        throw error;
      }

      // If edge function fails, use local optimization
      if (!data || !data.optimizedContent) {
        const localOptimization = performLocalOptimization(extractedText, jobDescription);
        setOptimizedText(localOptimization.optimizedText);
        setSuggestions(localOptimization.suggestions);
        setAtsScore(localOptimization.atsScore);
      } else {
        setOptimizedText(data.optimizedContent);
        setSuggestions(data.suggestions || []);
        setAtsScore(data.atsScore || 85);
      }
      
      toast.success('CV optimized successfully!');
    } catch (error) {
      console.error('Error optimizing CV:', error);
      
      // Fallback to local optimization
      const localOptimization = performLocalOptimization(extractedText, jobDescription);
      setOptimizedText(localOptimization.optimizedText);
      setSuggestions(localOptimization.suggestions);
      setAtsScore(localOptimization.atsScore);
      
      toast.success('CV optimized using local algorithms!');
    } finally {
      setIsOptimizing(false);
    }
  };

  const performLocalOptimization = (cvText: string, jobDesc: string) => {
    // Enhanced local optimization logic
    const lines = cvText.split('\n').filter(line => line.trim().length > 0);
    let optimizedLines: string[] = [];
    let currentSection = '';
    
    // Keywords to look for based on job description
    const jobKeywords = jobDesc ? extractKeywordsFromJob(jobDesc) : [];
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      // Detect section headers and improve them
      if (lowerLine.includes('experience') || lowerLine.includes('work')) {
        currentSection = 'experience';
        optimizedLines.push('PROFESSIONAL EXPERIENCE');
      } else if (lowerLine.includes('education')) {
        currentSection = 'education';
        optimizedLines.push('EDUCATION');
      } else if (lowerLine.includes('skills')) {
        currentSection = 'skills';
        optimizedLines.push('TECHNICAL SKILLS');
      } else if (lowerLine.includes('summary') || lowerLine.includes('objective')) {
        currentSection = 'summary';
        optimizedLines.push('PROFESSIONAL SUMMARY');
      } else {
        // Optimize content based on section
        let optimizedLine = line;
        
        if (currentSection === 'experience') {
          // Add quantifiable metrics and action verbs
          optimizedLine = enhanceExperienceLine(line);
        } else if (currentSection === 'skills') {
          // Add relevant keywords from job description
          optimizedLine = enhanceSkillsLine(line, jobKeywords);
        }
        
        optimizedLines.push(optimizedLine);
      }
    });

    const optimizedText = optimizedLines.join('\n');
    
    // Generate suggestions
    const suggestions = generateSuggestions(cvText, jobDesc);
    
    // Calculate ATS score
    const atsScore = calculateATSScore(optimizedText, jobKeywords);
    
    return { optimizedText, suggestions, atsScore };
  };

  const extractKeywordsFromJob = (jobDescription: string) => {
    const keywords = [];
    const techKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'];
    const softKeywords = ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical'];
    
    const jobLower = jobDescription.toLowerCase();
    
    [...techKeywords, ...softKeywords].forEach(keyword => {
      if (jobLower.includes(keyword.toLowerCase())) {
        keywords.push(keyword);
      }
    });
    
    return keywords;
  };

  const enhanceExperienceLine = (line: string) => {
    // Add action verbs and quantifiable metrics
    const actionVerbs = ['Developed', 'Implemented', 'Managed', 'Led', 'Optimized', 'Created', 'Designed'];
    const hasActionVerb = actionVerbs.some(verb => line.toLowerCase().includes(verb.toLowerCase()));
    
    if (!hasActionVerb && line.length > 10) {
      return `• Developed ${line.toLowerCase()}`;
    }
    
    // Add quantifiable metrics if missing
    if (!line.match(/\d+/) && line.length > 15) {
      return `${line} with 20% improvement in efficiency`;
    }
    
    return line;
  };

  const enhanceSkillsLine = (line: string, jobKeywords: string[]) => {
    let enhancedLine = line;
    
    // Add relevant keywords that might be missing
    jobKeywords.forEach(keyword => {
      if (!line.toLowerCase().includes(keyword.toLowerCase())) {
        enhancedLine += `, ${keyword}`;
      }
    });
    
    return enhancedLine;
  };

  const generateSuggestions = (cvText: string, jobDesc: string) => {
    const suggestions = [];
    
    if (!cvText.includes('@')) {
      suggestions.push({
        type: 'error',
        title: 'Add Contact Information',
        description: 'Include your email address and phone number',
        example: 'Add email and phone at the top of your resume'
      });
    }
    
    if (!cvText.match(/\d+/)) {
      suggestions.push({
        type: 'improvement',
        title: 'Add Quantifiable Achievements',
        description: 'Include specific numbers and metrics to demonstrate impact',
        example: 'Changed "Improved sales" to "Increased sales by 25%"'
      });
    }
    
    if (jobDesc && jobDesc.length > 50) {
      suggestions.push({
        type: 'keywords',
        title: 'Optimize for Job Keywords',
        description: 'Include more keywords from the job description',
        example: 'Added relevant technical skills mentioned in job posting'
      });
    }
    
    return suggestions;
  };

  const calculateATSScore = (cvText: string, jobKeywords: string[]) => {
    let score = 50; // Base score
    
    // Check for contact info
    if (cvText.includes('@')) score += 15;
    if (cvText.match(/\d{3}.*\d{3}.*\d{4}/)) score += 10;
    
    // Check for quantifiable achievements
    if (cvText.match(/\d+%/)) score += 10;
    if (cvText.match(/\d+\+/)) score += 5;
    
    // Check for job keywords
    jobKeywords.forEach(keyword => {
      if (cvText.toLowerCase().includes(keyword.toLowerCase())) {
        score += 2;
      }
    });
    
    return Math.min(score, 100);
  };

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description to analyze');
      return;
    }

    try {
      const keywords = extractKeywordsFromJob(jobDescription);
      toast.success(`Found ${keywords.length} key requirements to optimize for`);
    } catch (error) {
      console.error('Error parsing job description:', error);
      toast.error('Failed to parse job description');
    }
  };

  const downloadOptimizedCV = () => {
    if (!optimizedText) {
      toast.error('Please optimize your CV first');
      return;
    }

    const blob = new Blob([optimizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_cv.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Optimized CV downloaded successfully');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CV Optimizer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Resume Enhancement</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload and Input Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Upload Your CV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {uploadedFile ? uploadedFile.name : 'Drop your CV here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supports PDF, DOC, DOCX and text files
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isProcessing && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Processing file...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Target Job Description (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to optimize your CV for specific requirements..."
                  className="min-h-[150px]"
                />
                <Button onClick={parseJobDescription} variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Job Requirements
                </Button>
              </CardContent>
            </Card>

            {/* CV Editor */}
            {extractedText && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Edit CV Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Your CV content will appear here for editing..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Optimize Button */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Optimization</h3>
                <p className="mb-4 opacity-90">
                  Enhance your CV with industry keywords, quantifiable achievements, and ATS optimization
                </p>
                <Button
                  onClick={optimizeCV}
                  disabled={!extractedText || isOptimizing}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  size="lg"
                >
                  {isOptimizing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize My CV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* ATS Score */}
            {atsScore !== null && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    ATS Compatibility Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">{atsScore}/100</span>
                    <Badge variant={atsScore >= 80 ? 'default' : atsScore >= 60 ? 'secondary' : 'destructive'}>
                      {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${atsScore}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.description}
                          </p>
                          {suggestion.example && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                              Example: {suggestion.example}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Optimized CV */}
            {optimizedText && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Optimized CV
                    </div>
                    <Button onClick={downloadOptimizedCV} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {optimizedText}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVOptimizer;
