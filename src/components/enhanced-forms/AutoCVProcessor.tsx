
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
  Loader2,
  Sparkles,
  Zap,
  Eye,
  AlertCircle,
  Download,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';
import { useAuth } from '@/contexts/AuthContext';
import EditableCVTemplate from './EditableCVTemplate';

interface AutoCVProcessorProps {
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

const AutoCVProcessor: React.FC<AutoCVProcessorProps> = ({ 
  onDataExtracted, 
  onClose 
}) => {
  const { user } = useAuth();
  const { apiKey } = useAPIKey();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<CVData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [showTemplate, setShowTemplate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);

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

  // Enhanced AI-powered data validation and enhancement
  const enhanceDataWithAI = async (rawData: CVData, extractedText: string): Promise<CVData> => {
    if (!apiKey) {
      console.log('No API key available for AI enhancement');
      return rawData;
    }

    try {
      setProcessingStep('AI analyzing and enhancing extracted data...');
      
      const { data: result, error } = await supabase.functions.invoke('cv-reader-ai', {
        body: { 
          extractedText,
          rawData,
          apiKey,
          enhanceMode: true
        }
      });

      if (error) throw error;

      if (result?.enhancedData) {
        return {
          ...rawData,
          ...result.enhancedData,
          personal: {
            ...rawData.personal,
            ...result.enhancedData.personal
          }
        };
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
      toast.error('AI enhancement failed, using basic extraction');
    }

    return rawData;
  };

  // Load PDF.js library dynamically
  const loadPDFJS = async () => {
    if (!(window as any).pdfjsLib) {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  };

  // Enhanced PDF text extraction with better structure preservation
  const extractPDFText = async (file: File): Promise<string> => {
    await loadPDFJS();
    const pdfjsLib = (window as any).pdfjsLib;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Sort text items by position for better reading order
      const sortedItems = textContent.items.sort((a: any, b: any) => {
        const yDiff = Math.abs(a.transform[5] - b.transform[5]);
        if (yDiff > 2) {
          return b.transform[5] - a.transform[5]; // Top to bottom
        }
        return a.transform[4] - b.transform[4]; // Left to right
      });
      
      let currentY: number | null = null;
      let lineText = '';
      
      for (const item of sortedItems) {
        const itemY = Math.round(item.transform[5]);
        const itemText = item.str.trim();
        
        if (currentY === null || Math.abs(currentY - itemY) > 2) {
          // New line
          if (lineText.trim()) {
            fullText += lineText.trim() + '\n';
          }
          currentY = itemY;
          lineText = itemText;
        } else {
          // Same line
          if (lineText && itemText && !lineText.endsWith(' ') && !itemText.startsWith(' ')) {
            lineText += ' ';
          }
          lineText += itemText;
        }
      }
      
      if (lineText.trim()) {
        fullText += lineText.trim() + '\n';
      }
    }
    
    return fullText;
  };

  // Extract text from DOCX files
  const extractDOCXText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const content = decoder.decode(new Uint8Array(arrayBuffer));
    
    // Extract text from DOCX XML structure
    const paragraphs: string[] = [];
    const pTagPattern = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    
    while ((match = pTagPattern.exec(content)) !== null) {
      if (match[1] && match[1].trim()) {
        paragraphs.push(match[1].trim());
      }
    }
    
    return paragraphs.join('\n');
  };

  // Improved parsing with AI enhancement
  const parseTextToCV = async (text: string): Promise<CVData> => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const data = createEmptyData();
    
    // Extract personal information with improved regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /[\(]?\+?[\d\s\-\(\)]{10,}/;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/i;
    
    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);
    const linkedinMatch = text.match(linkedinRegex);
    
    if (emailMatch) data.personal.email = emailMatch[0];
    if (phoneMatch) data.personal.phone = phoneMatch[0];
    
    // Enhanced name detection
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) && 
          !line.includes('@') && 
          !line.match(/\d{3}/) && 
          line.length < 50 &&
          line.split(' ').length >= 2 &&
          line.split(' ').length <= 4) {
        data.personal.fullName = line;
        break;
      }
    }
    
    // Enhanced section parsing
    let currentSection = '';
    let currentItem: any = {};
    
    const sectionKeywords = {
      experience: ['experience', 'work', 'employment', 'career', 'professional', 'job'],
      education: ['education', 'qualification', 'degree', 'university', 'college', 'school'],
      skills: ['skill', 'technical', 'competenc', 'expertise', 'proficient', 'technologies'],
      summary: ['summary', 'objective', 'profile', 'about', 'overview'],
      projects: ['project', 'portfolio'],
      certifications: ['certification', 'certificate', 'license'],
      languages: ['language', 'linguistic'],
      interests: ['interest', 'hobby', 'activities']
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Detect section headers
      let foundSection = '';
      for (const [section, keywords] of Object.entries(sectionKeywords)) {
        if (keywords.some(keyword => lowerLine.includes(keyword) && lowerLine.length < 50)) {
          foundSection = section;
          break;
        }
      }
      
      if (foundSection) {
        // Save previous item
        if (currentSection === 'experience' && currentItem.position) {
          data.experience.push({ 
            ...currentItem, 
            id: Date.now() + Math.random(),
            startDate: currentItem.startDate || '',
            endDate: currentItem.endDate || '',
            location: currentItem.location || ''
          });
        } else if (currentSection === 'education' && currentItem.degree) {
          data.education.push({ 
            ...currentItem, 
            id: Date.now() + Math.random(),
            startDate: currentItem.startDate || '',
            endDate: currentItem.endDate || '',
            location: currentItem.location || '',
            gpa: currentItem.gpa || ''
          });
        }
        
        currentSection = foundSection;
        currentItem = {};
        continue;
      }
      
      // Process content based on current section
      if (currentSection === 'experience') {
        const datePattern = /(\d{2}\/\d{4}|\d{4}|\w+\s+\d{4})\s*[-–]\s*(\d{2}\/\d{4}|\d{4}|present|current)/i;
        
        if (datePattern.test(line)) {
          if (currentItem.position) {
            data.experience.push({ 
              ...currentItem, 
              id: Date.now() + Math.random(),
              startDate: currentItem.startDate || '',
              endDate: currentItem.endDate || '',
              location: currentItem.location || ''
            });
            currentItem = {};
          }
          const dateMatch = line.match(datePattern);
          currentItem.startDate = dateMatch ? dateMatch[1] : '';
          currentItem.endDate = dateMatch ? dateMatch[2] : '';
        } else if (!currentItem.position && line.length > 5 && line.length < 100 && !line.includes('•')) {
          currentItem.position = line;
        } else if (!currentItem.company && line.length > 2 && line.length < 80 && !line.includes('•')) {
          currentItem.company = line;
        } else if (line.includes('•') || (line.length > 10 && currentItem.position)) {
          currentItem.description = (currentItem.description || '') + line + '\n';
        }
      } else if (currentSection === 'education') {
        if (!currentItem.degree && line.length > 5 && line.length < 100) {
          currentItem.degree = line;
        } else if (!currentItem.school && line.length > 3 && line.length < 80) {
          currentItem.school = line;
        }
      } else if (currentSection === 'skills') {
        const skills = line.split(/[,•\-\n|]/)
          .map(s => s.trim())
          .filter(s => s.length > 1 && s.length < 30 && !s.match(/^\d+$/));
        data.skills.push(...skills);
      } else if (currentSection === 'summary') {
        if (line.length > 15) {
          data.personal.summary += line + ' ';
        }
      }
    }
    
    // Add final items
    if (currentSection === 'experience' && currentItem.position) {
      data.experience.push({ 
        ...currentItem, 
        id: Date.now() + Math.random(),
        startDate: currentItem.startDate || '',
        endDate: currentItem.endDate || '',
        location: currentItem.location || ''
      });
    } else if (currentSection === 'education' && currentItem.degree) {
      data.education.push({ 
        ...currentItem, 
        id: Date.now() + Math.random(),
        startDate: currentItem.startDate || '',
        endDate: currentItem.endDate || '',
        location: currentItem.location || '',
        gpa: currentItem.gpa || ''
      });
    }
    
    // Clean up data
    data.skills = [...new Set(data.skills.filter(skill => skill.length > 1))];
    data.personal.summary = data.personal.summary.trim();
    
    // Apply AI enhancement if API key is available
    return await enhanceDataWithAI(data, text);
  };

  // Save resume data to database
  const saveResumeData = async (data: CVData) => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return;
    }

    setSaving(true);
    try {
      const resumePayload = {
        user_id: user.id,
        title: data.personal.fullName ? `${data.personal.fullName}'s Resume` : 'Untitled Resume',
        template_id: 0,
        personal_info: data.personal,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        certifications: data.certifications,
        languages: data.languages,
        interests: data.interests,
        projects: data.projects,
        updated_at: new Date().toISOString()
      };

      if (resumeId) {
        const { error } = await supabase
          .from('resumes')
          .update(resumePayload)
          .eq('id', resumeId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { data: newResume, error } = await supabase
          .from('resumes')
          .insert([resumePayload])
          .select()
          .single();
        
        if (error) throw error;
        setResumeId(newResume.id);
      }

      toast.success('Resume saved successfully!');
    } catch (error: any) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  // Download resume as PDF
  const downloadResume = async () => {
    if (!extractedData) {
      toast.error('No resume data to download');
      return;
    }

    try {
      toast.info('Generating PDF... This may take a moment.');
      
      // Dynamic import of jsPDF
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Add resume content to PDF
      let yPosition = 20;
      const lineHeight = 10;
      const margin = 20;
      
      // Personal Information
      if (extractedData.personal.fullName) {
        doc.setFontSize(20);
        doc.text(extractedData.personal.fullName, margin, yPosition);
        yPosition += lineHeight * 1.5;
      }
      
      doc.setFontSize(12);
      if (extractedData.personal.email) {
        doc.text(`Email: ${extractedData.personal.email}`, margin, yPosition);
        yPosition += lineHeight;
      }
      
      if (extractedData.personal.phone) {
        doc.text(`Phone: ${extractedData.personal.phone}`, margin, yPosition);
        yPosition += lineHeight;
      }
      
      if (extractedData.personal.location) {
        doc.text(`Location: ${extractedData.personal.location}`, margin, yPosition);
        yPosition += lineHeight;
      }
      
      // Summary
      if (extractedData.personal.summary) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text('Summary', margin, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(10);
        const summaryLines = doc.splitTextToSize(extractedData.personal.summary, 170);
        doc.text(summaryLines, margin, yPosition);
        yPosition += summaryLines.length * lineHeight;
      }
      
      // Experience
      if (extractedData.experience.length > 0) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text('Experience', margin, yPosition);
        yPosition += lineHeight;
        
        extractedData.experience.forEach(exp => {
          doc.setFontSize(12);
          doc.text(`${exp.position} at ${exp.company}`, margin, yPosition);
          yPosition += lineHeight;
          
          if (exp.startDate || exp.endDate) {
            doc.setFontSize(10);
            doc.text(`${exp.startDate} - ${exp.endDate}`, margin, yPosition);
            yPosition += lineHeight;
          }
          
          if (exp.description) {
            const descLines = doc.splitTextToSize(exp.description, 170);
            doc.text(descLines, margin, yPosition);
            yPosition += descLines.length * lineHeight;
          }
          yPosition += lineHeight * 0.5;
        });
      }
      
      // Skills
      if (extractedData.skills.length > 0) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text('Skills', margin, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(10);
        const skillsText = extractedData.skills.join(', ');
        const skillsLines = doc.splitTextToSize(skillsText, 170);
        doc.text(skillsLines, margin, yPosition);
        yPosition += skillsLines.length * lineHeight;
      }
      
      // Education
      if (extractedData.education.length > 0) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text('Education', margin, yPosition);
        yPosition += lineHeight;
        
        extractedData.education.forEach(edu => {
          doc.setFontSize(12);
          doc.text(`${edu.degree} - ${edu.school}`, margin, yPosition);
          yPosition += lineHeight;
        });
      }
      
      const filename = extractedData.personal.fullName 
        ? `${extractedData.personal.fullName.replace(/[^a-z0-9]/gi, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      doc.save(filename);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  // Main processing function
  const processFileWithAdvancedExtraction = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setProcessingStep('Initializing document processor...');
    
    try {
      // Step 1: Text extraction
      setProgress(25);
      setProcessingStep('Extracting text from document...');
      
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractPDFText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractDOCXText(file);
      } else if (file.type === 'text/plain') {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
      
      if (!text || text.length < 10) {
        throw new Error('Could not extract readable text from the file.');
      }
      
      // Step 2: Intelligent parsing with AI enhancement
      setProgress(60);
      setProcessingStep('AI analyzing and structuring data...');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const parsedData = await parseTextToCV(text);
      
      // Step 3: Data validation and enhancement
      setProgress(85);
      setProcessingStep('Finalizing and validating data...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExtractedData(parsedData);
      setProgress(100);
      setProcessingStep('Processing complete!');
      
      toast.success('🎉 CV data extracted and organized successfully!');
      
      if (onDataExtracted) {
        onDataExtracted(parsedData);
      }
      
      // Show template immediately
      setTimeout(() => setShowTemplate(true), 300);
      
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
      processFileWithAdvancedExtraction(file);
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
    maxSize: 10 * 1024 * 1024
  });

  const startManualEntry = () => {
    const emptyData = createEmptyData();
    setExtractedData(emptyData);
    setShowTemplate(true);
    toast.success('📝 Manual entry template ready!');
  };

  if (showTemplate && extractedData) {
    return (
      <div className="space-y-4">
        {/* Action buttons */}
        <div className="flex justify-between items-center bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Resume Editor</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => saveResumeData(extractedData)}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Resume'}
            </Button>
            <Button
              onClick={downloadResume}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={() => {
                setShowTemplate(false);
                if (onClose) onClose();
              }}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
        
        <EditableCVTemplate 
          data={extractedData}
          onDataChange={setExtractedData}
          onClose={() => {
            setShowTemplate(false);
            if (onClose) onClose();
          }}
        />
      </div>
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
              Smart CV Data Extractor
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your CV and see it automatically organized in a professional template
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
                  {isProcessing ? (
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
              
              {uploadedFile && !isProcessing ? (
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-6 py-4 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                  <div className="text-left">
                    <span className="font-medium text-lg block">{uploadedFile.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Processing Complete
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isDragActive ? '✨ Drop your CV here!' : 
                     isProcessing ? '🔄 Processing your CV...' : 
                     '🚀 Upload your CV'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {isProcessing ? 
                      'Your CV is being automatically processed and organized into a professional template.' :
                      'Support for PDF, DOC, DOCX, and TXT files up to 10MB. Your data will be automatically extracted and organized.'
                    }
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      PDF, DOC, DOCX, TXT
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Auto-Extract
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      AI-Enhanced
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
                <div className={`flex items-center gap-1 ${progress >= 25 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 25 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Text Extraction
                </div>
                <div className={`flex items-center gap-1 ${progress >= 60 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 60 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  AI Analysis
                </div>
                <div className={`flex items-center gap-1 ${progress >= 85 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 85 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Validation
                </div>
                <div className={`flex items-center gap-1 ${progress >= 100 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Complete
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Entry Option */}
      <div className="flex justify-center">
        <Button
          onClick={startManualEntry}
          variant="outline"
          size="lg"
          className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 px-8 py-3 text-lg"
          disabled={isProcessing}
        >
          <FileText className="w-5 h-5 mr-2" />
          Start with Empty Template
        </Button>
      </div>

      {/* Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900 dark:text-purple-300">AI-Enhanced Extraction</h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">Advanced AI validates and improves data accuracy</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Auto Organization</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">Intelligently structures your data</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900 dark:text-green-300">Instant Preview</h4>
            <p className="text-sm text-green-700 dark:text-green-400">See your organized CV immediately</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoCVProcessor;
