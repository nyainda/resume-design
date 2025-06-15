
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Zap,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';
import EditableCVTemplate from './EditableCVTemplate';

interface ImprovedCVProcessorProps {
  onDataExtracted?: (data: any) => void;
  onClose?: () => void;
}

interface CVData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
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
}

const ImprovedCVProcessor: React.FC<ImprovedCVProcessorProps> = ({ 
  onDataExtracted, 
  onClose 
}) => {
  const { apiKey } = useAPIKey();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<CVData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [showTemplate, setShowTemplate] = useState(false);

  const createEmptyData = (): CVData => ({
    personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    interests: [],
    projects: []
  });

  const processFileInBackground = async (file: File) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingStep('Preparing file for analysis...');

    try {
      // Step 1: File preparation
      setProgress(20);
      setProcessingStep('Reading file content...');
      
      const fileReader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });

      const base64Content = fileContent.split(',')[1];

      // Step 2: AI Analysis
      setProgress(40);
      setProcessingStep('AI analyzing CV structure...');
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

      const { data: result, error } = await supabase.functions.invoke('cv-reader-ai', {
        body: { 
          fileContent: base64Content,
          fileName: file.name,
          fileType: file.type,
          apiKey
        }
      });

      if (error) throw error;

      // Step 3: Data extraction
      setProgress(70);
      setProcessingStep('Extracting structured data...');
      
      await new Promise(resolve => setTimeout(resolve, 800));

      if (result?.extractedData) {
        const safeData: CVData = {
          ...createEmptyData(),
          ...result.extractedData,
          personal: {
            ...createEmptyData().personal,
            ...result.extractedData.personal
          }
        };

        // Step 4: AI enhancement
        setProgress(90);
        setProcessingStep('Enhancing content with AI...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setExtractedData(safeData);
        setProgress(100);
        setProcessingStep('Processing complete!');
        
        toast.success('🎉 CV processed successfully with AI!');
        
        if (onDataExtracted) {
          onDataExtracted(safeData);
        }
        
        // Show template after processing
        setTimeout(() => setShowTemplate(true), 500);
      } else {
        throw new Error('No data could be extracted from your CV.');
      }
    } catch (error: any) {
      console.error('CV processing error:', error);
      toast.error(error.message || 'Failed to process CV. Please try again.');
      setProcessingStep('Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`📄 ${file.name} uploaded successfully!`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const startProcessing = () => {
    if (uploadedFile) {
      processFileInBackground(uploadedFile);
    }
  };

  const startManualEntry = () => {
    const emptyData = createEmptyData();
    setExtractedData(emptyData);
    setShowTemplate(true);
    toast.success('📝 Manual entry template ready!');
  };

  if (showTemplate && extractedData) {
    return (
      <EditableCVTemplate 
        data={extractedData}
        onDataChange={setExtractedData}
        onClose={() => {
          setShowTemplate(false);
          if (onClose) onClose();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Powered CV Processor
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your CV and let AI extract and enhance your data
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-all duration-300 ${
              isDragActive ? 'scale-105 opacity-80' : 'hover:scale-102'
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
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-6 py-4 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                  <div className="text-left">
                    <span className="font-medium text-lg block">{uploadedFile.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Ready for AI Processing
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
                    Support for PDF, DOC, DOCX, and TXT files up to 10MB. Our AI will extract and enhance your data automatically.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      PDF, DOC, DOCX, TXT
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      AI-Powered
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="font-medium text-purple-900 dark:text-purple-300">
                  {processingStep}
                </span>
              </div>
              <Progress value={progress} className="w-full h-3" />
              <div className="grid grid-cols-4 gap-2 text-xs text-purple-700 dark:text-purple-400">
                <div className={`flex items-center gap-1 ${progress >= 20 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 20 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  File Reading
                </div>
                <div className={`flex items-center gap-1 ${progress >= 40 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 40 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  AI Analysis
                </div>
                <div className={`flex items-center gap-1 ${progress >= 70 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 70 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Data Extraction
                </div>
                <div className={`flex items-center gap-1 ${progress >= 90 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 90 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  AI Enhancement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {uploadedFile && !isProcessing && (
          <Button
            onClick={startProcessing}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg"
            size="lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Process with AI
          </Button>
        )}
        
        <Button
          onClick={startManualEntry}
          variant="outline"
          size="lg"
          className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 px-8 py-3 text-lg"
          disabled={isProcessing}
        >
          <FileText className="w-5 h-5 mr-2" />
          Manual Entry
        </Button>
      </div>

      {/* Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900 dark:text-purple-300">Smart Extraction</h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">AI understands complex CV layouts</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Auto Enhancement</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">Improves content quality automatically</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900 dark:text-green-300">Live Preview</h4>
            <p className="text-sm text-green-700 dark:text-green-400">See changes in real-time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImprovedCVProcessor;
