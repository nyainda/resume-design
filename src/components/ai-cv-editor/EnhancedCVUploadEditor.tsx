
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Sparkles, 
  Zap, 
  CheckCircle, 
  Loader2,
  Brain,
  X,
  FileEdit,
  Wand2,
  Cpu,
  Stars,
  Target,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import PDFGenerator from '@/components/PDFGenerator';
import CVDataEditor from './CVDataEditor';
import AIEnhancementPanel from './AIEnhancementPanel';

interface EnhancedCVUploadEditorProps {
  onClose: () => void;
}

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  languages: Array<{
    id: number;
    language: string;
    proficiency: string;
  }>;
  interests: string[];
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
  references: Array<{
    id: number;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
  internships: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    supervisor: string;
  }>;
  volunteering: Array<{
    id: number;
    organization: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  publications: Array<{
    id: number;
    title: string;
    authors: string;
    journal: string;
    date: string;
    doi: string;
    description: string;
  }>;
}

const EnhancedCVUploadEditor: React.FC<EnhancedCVUploadEditorProps> = ({ onClose }) => {
  const { apiKey } = useAPIKey();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [aiEnhancements, setAiEnhancements] = useState<any>(null);

  // Create a properly initialized empty resume data structure
  const createEmptyResumeData = (): ResumeData => ({
    personal: { 
      fullName: '', 
      email: '', 
      phone: '', 
      location: '', 
      summary: '',
      website: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    interests: [],
    projects: [],
    references: [],
    internships: [],
    volunteering: [],
    publications: []
  });

  // AI-powered extraction with progress tracking
  const extractWithAI = async (file: File) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setIsExtracting(true);
    setExtractionProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => Math.min(prev + 10, 80));
      }, 200);

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const base64String = fileReader.result as string;
          const base64Content = base64String.split(',')[1];

          setExtractionProgress(90);

          const { data: result, error } = await supabase.functions.invoke('cv-reader-ai', {
            body: { 
              fileContent: base64Content,
              fileName: file.name,
              fileType: file.type,
              apiKey
            }
          });

          clearInterval(progressInterval);
          setExtractionProgress(100);

          if (error) throw error;

          if (result?.extractedData) {
            // Ensure all required properties exist with proper defaults
            const safeExtractedData: ResumeData = {
              ...createEmptyResumeData(),
              ...result.extractedData,
              personal: {
                ...createEmptyResumeData().personal,
                ...result.extractedData.personal
              }
            };
            
            setExtractedData(safeExtractedData);
            setActiveTab('edit');
            toast.success('🎉 CV data extracted successfully with Gemini AI!');
            
            // Auto-generate AI enhancements
            await generateAIEnhancements(safeExtractedData);
          } else {
            throw new Error('No data could be extracted from your CV.');
          }
        } catch (err: any) {
          console.error('AI extraction error:', err);
          toast.error(err.message || 'AI extraction failed! Try manual extraction instead.');
          clearInterval(progressInterval);
        } finally {
          setIsExtracting(false);
          setExtractionProgress(0);
        }
      };
      fileReader.readAsDataURL(file);
    } catch (err: any) {
      setIsExtracting(false);
      setExtractionProgress(0);
      toast.error('Failed to read file for AI extraction');
    }
  };

  const generateAIEnhancements = async (data: ResumeData) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: {
          resumeData: data,
          apiKey,
          enhancementType: 'comprehensive'
        }
      });

      if (!error && result) {
        setAiEnhancements(result);
        toast.success('🚀 AI enhancements generated!');
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success('📄 File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const downloadOptimizedPDF = async () => {
    if (!extractedData) {
      toast.error('No data available to download');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('🔄 Generating optimized PDF... This may take a moment.');
      
      const filename = `${extractedData.personal.fullName || 'resume'}_enhanced_${selectedTemplate + 1}.pdf`;
      await PDFGenerator.generateTextPDF(extractedData, selectedTemplate, filename);
      
      toast.success('✅ Enhanced PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered CV Editor
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Next-gen CV extraction, enhancement, and optimization with Gemini AI
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Upload className="w-4 h-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="flex items-center gap-2" disabled={!extractedData}>
                    <Edit className="w-4 h-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="enhance" className="flex items-center gap-2" disabled={!extractedData}>
                    <Wand2 className="w-4 h-4" />
                    AI Enhance
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2" disabled={!extractedData}>
                    <Download className="w-4 h-4" />
                    Export
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <CardContent className="p-8">
                      <div
                        {...getRootProps()}
                        className={`text-center cursor-pointer transition-all duration-300 ${
                          isDragActive 
                            ? 'scale-105 opacity-80' 
                            : 'hover:scale-102'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Upload className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-yellow-800" />
                            </div>
                          </div>
                          
                          {uploadedFile ? (
                            <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-4 py-3 rounded-lg">
                              <CheckCircle className="w-6 h-6" />
                              <div>
                                <span className="font-medium text-lg">{uploadedFile.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </Badge>
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                    Ready for AI
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isDragActive ? '✨ Drop your CV here!' : '🚀 Upload your CV'}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                Support for PDF, DOC, and DOCX files up to 10MB. Our AI will extract and enhance your data automatically.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {isExtracting && (
                    <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                            <span className="font-medium text-purple-900 dark:text-purple-300">
                              Gemini AI is analyzing your CV...
                            </span>
                          </div>
                          <Progress value={extractionProgress} className="w-full h-3" />
                          <p className="text-sm text-purple-700 dark:text-purple-400">
                            {extractionProgress < 30 && "Reading document structure..."}
                            {extractionProgress >= 30 && extractionProgress < 60 && "Extracting personal information..."}
                            {extractionProgress >= 60 && extractionProgress < 90 && "Processing experience and skills..."}
                            {extractionProgress >= 90 && "Finalizing data extraction..."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-center gap-4">
                    {uploadedFile && !isExtracting && (
                      <Button
                        onClick={() => extractWithAI(uploadedFile)}
                        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg"
                        size="lg"
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        Extract with Gemini AI
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => {
                        setExtractedData(createEmptyResumeData());
                        setActiveTab('edit');
                        toast.success('📝 Manual entry form ready!');
                      }}
                      variant="outline"
                      size="lg"
                      className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 px-8 py-3 text-lg"
                    >
                      <FileEdit className="w-5 h-5 mr-2" />
                      Manual Entry
                    </Button>
                  </div>

                  {/* AI Features Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
                      <CardContent className="p-4 text-center">
                        <Cpu className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-purple-900 dark:text-purple-300">Smart Extraction</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-400">AI understands complex CV layouts</p>
                      </CardContent>
                    </Card>
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                      <CardContent className="p-4 text-center">
                        <Stars className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300">Auto Enhancement</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400">Improves content quality automatically</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                      <CardContent className="p-4 text-center">
                        <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-green-900 dark:text-green-300">ATS Optimization</h4>
                        <p className="text-sm text-green-700 dark:text-green-400">Optimized for job application systems</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="edit" className="space-y-6">
                  {extractedData && (
                    <CVDataEditor 
                      data={extractedData} 
                      onDataChange={setExtractedData}
                    />
                  )}
                </TabsContent>

                <TabsContent value="enhance" className="space-y-6">
                  {extractedData && (
                    <AIEnhancementPanel 
                      data={extractedData}
                      enhancements={aiEnhancements}
                      onDataChange={setExtractedData}
                      onRegenerateEnhancements={() => generateAIEnhancements(extractedData)}
                    />
                  )}
                </TabsContent>

                <TabsContent value="export" className="space-y-6">
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                        <Download className="w-6 h-6" />
                        Export Enhanced Resume
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Button 
                        onClick={downloadOptimizedPDF} 
                        disabled={!extractedData || isProcessing}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 text-lg shadow-lg"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Enhanced PDF...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download AI-Enhanced PDF
                          </>
                        )}
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          ATS Optimized
                        </div>
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          AI Enhanced Content
                        </div>
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                          <CheckCircle className="w-4 h-4" />
                          Professional Layout
                        </div>
                        <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                          <CheckCircle className="w-4 h-4" />
                          Multiple Formats
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Enhanced Preview Section */}
            <div className="xl:col-span-1">
              <Card className="sticky top-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-950/20">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-900 dark:text-white">Live Preview</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      Template {selectedTemplate + 1}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 max-h-[600px] overflow-y-auto">
                    {extractedData ? (
                      <div className="transform scale-75 origin-top-left w-[133%] h-auto">
                        <ImprovedResumePreview 
                          data={extractedData}
                          template={selectedTemplate}
                          scale={1}
                        />
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Preview Ready</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Upload and extract your CV to see the AI-enhanced preview
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <Lightbulb className="w-4 h-4" />
                          <span>Powered by Gemini AI</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCVUploadEditor;
