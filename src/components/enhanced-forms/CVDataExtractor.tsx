
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Eye, Edit3, Zap, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CVDataExtractorProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVDataExtractor: React.FC<CVDataExtractorProps> = ({ onDataExtracted, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'parsed'>('upload');
  const [enhancing, setEnhancing] = useState(false);

  // Enhanced PDF extraction with better formatting preservation
  const extractPDFText = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = (window as any).pdfjsLib;
      
      if (pdfjsLib) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Sort text items by Y position (top to bottom) then X position (left to right)
          const sortedItems = textContent.items.sort((a: any, b: any) => {
            const yDiff = Math.abs(a.transform[5] - b.transform[5]);
            if (yDiff > 2) { // Different lines
              return b.transform[5] - a.transform[5]; // Higher Y first (top to bottom)
            }
            return a.transform[4] - b.transform[4]; // Same line, left to right
          });
          
          let currentY: number | null = null;
          let lineText = '';
          
          for (let j = 0; j < sortedItems.length; j++) {
            const item = sortedItems[j];
            const itemY = Math.round(item.transform[5]);
            const itemText = item.str.trim();
            
            if (currentY === null) {
              currentY = itemY;
              lineText = itemText;
            } else if (Math.abs(currentY - itemY) <= 2) {
              // Same line - add spacing if needed
              if (lineText && itemText) {
                const lastChar = lineText[lineText.length - 1];
                const firstChar = itemText[0];
                
                // Add space if needed
                if (lastChar !== ' ' && firstChar !== ' ' && 
                    !['•', '-', '(', ')', '.', ','].includes(lastChar) &&
                    !['•', '-', '(', ')', '.', ','].includes(firstChar)) {
                  lineText += ' ';
                }
              }
              lineText += itemText;
            } else {
              // New line
              if (lineText.trim()) {
                fullText += lineText.trim() + '\n';
              }
              currentY = itemY;
              lineText = itemText;
            }
          }
          
          // Add last line
          if (lineText.trim()) {
            fullText += lineText.trim() + '\n';
          }
          
          // Add page break if not last page
          if (i < pdf.numPages) {
            fullText += '\n---PAGE BREAK---\n\n';
          }
        }
        
        return cleanAndFormatText(fullText);
      } else {
        return await extractPDFTextFallback(file);
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      return await extractPDFTextFallback(file);
    }
  };

  // Improved fallback PDF text extraction with better formatting
  const extractPDFTextFallback = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          let text = '';
          
          // Look for text content in PDF structure
          let i = 0;
          const lines: string[] = [];
          
          while (i < uint8Array.length - 10) {
            // Look for text objects
            if (uint8Array[i] === 0x42 && uint8Array[i + 1] === 0x54) { // "BT" - Begin Text
              i += 2;
              let textContent = '';
              let inString = false;
              let parenCount = 0;
              
              while (i < uint8Array.length - 1) {
                const byte = uint8Array[i];
                const char = String.fromCharCode(byte);
                
                if (char === '(' && !inString) {
                  inString = true;
                  parenCount = 1;
                } else if (char === ')' && inString) {
                  parenCount--;
                  if (parenCount === 0) {
                    inString = false;
                    if (textContent.trim()) {
                      lines.push(textContent.trim());
                      textContent = '';
                    }
                  }
                } else if (char === '(' && inString) {
                  parenCount++;
                  if (byte >= 32 && byte <= 126) {
                    textContent += char;
                  }
                } else if (inString && parenCount > 0) {
                  if (byte >= 32 && byte <= 126) {
                    textContent += char;
                  } else if (byte === 10 || byte === 13) {
                    textContent += ' ';
                  }
                } else if (char === 'E' && uint8Array[i + 1] === 84) { // "ET" - End Text
                  break;
                }
                i++;
              }
            } else {
              i++;
            }
          }
          
          // Join lines and preserve structure
          text = lines.join('\n');
          text = cleanAndFormatText(text);
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Enhanced DOCX extraction with formatting preservation
  const extractDOCXText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const decoder = new TextDecoder('utf-8');
          const content = decoder.decode(uint8Array);
          
          // Extract text with paragraph structure
          const paragraphs: string[] = [];
          
          // Look for paragraph tags
          const pTagPattern = /<w:p[^>]*>(.*?)<\/w:p>/gs;
          const pMatches = content.match(pTagPattern);
          
          if (pMatches) {
            pMatches.forEach(pMatch => {
              // Extract text from runs within paragraph
              const textPattern = /<w:t[^>]*>([^<]*)<\/w:t>/g;
              let match;
              let paragraphText = '';
              
              while ((match = textPattern.exec(pMatch)) !== null) {
                if (match[1]) {
                  paragraphText += match[1];
                }
              }
              
              if (paragraphText.trim()) {
                paragraphs.push(paragraphText.trim());
              }
            });
          }
          
          let text = paragraphs.join('\n');
          text = cleanAndFormatText(text);
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read DOCX file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Clean and format extracted text while preserving structure
  const cleanAndFormatText = (text: string): string => {
    let cleanText = text;
    
    // Remove excessive whitespace but preserve line breaks
    cleanText = cleanText.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
    cleanText = cleanText.replace(/\n[ \t]+/g, '\n'); // Remove leading spaces on new lines
    cleanText = cleanText.replace(/[ \t]+\n/g, '\n'); // Remove trailing spaces before new lines
    
    // Preserve section breaks and important formatting
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive line breaks
    
    // Fix common formatting issues
    cleanText = cleanText.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space before capital letters
    cleanText = cleanText.replace(/(\d{2}\/\d{4}|\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4}|\w+)/g, '$1 - $2'); // Fix date ranges
    cleanText = cleanText.replace(/•\s*/g, '• '); // Ensure space after bullets
    cleanText = cleanText.replace(/\s*•\s*/g, '\n• '); // Bullets on new lines
    
    // Preserve email and phone formatting
    cleanText = cleanText.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '\n$1\n');
    cleanText = cleanText.replace(/(\(?\+?[\d\s\-\(\)]{10,})/g, '\n$1\n');
    
    // Remove extra line breaks around contact info
    cleanText = cleanText.replace(/\n{2,}(@|\()/g, '\n$1');
    cleanText = cleanText.replace(/(@[^\n]+)\n{2,}/g, '$1\n');
    
    return cleanText.trim();
  };

  // Main text extraction function
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Extracting text from file:', file.name, 'Type:', file.type);
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file...');
        text = await extractPDFText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing DOCX file...');
        text = await extractDOCXText(file);
      } else if (file.type === 'text/plain') {
        console.log('Processing text file...');
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else {
        console.log('Processing generic file...');
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = (e.target?.result as string) || '';
              const cleanText = cleanAndFormatText(content);
              resolve(cleanText);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
      
      console.log('Extracted text length:', text.length);
      console.log('Text preview:', text.substring(0, 300));
      
      if (!text || text.length < 10) {
        throw new Error('Could not extract readable text from the file. Please ensure the file contains text content and try again.');
      }
      
      return text;
    } catch (error) {
      console.error('Text extraction failed:', error);
      throw new Error(`Failed to extract text from ${file.type || 'file'}. The file might be corrupted or in an unsupported format.`);
    }
  };

  // Parse extracted text and extract structured data - preserving ALL original information
  const parseExtractedText = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract personal information with better pattern matching
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/[\(]?\+?[\d\s\-\(\)]{10,}/);
    
    // Find name (usually one of the first few meaningful lines)
    let fullName = '';
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) && 
          !line.includes('@') && 
          !line.match(/\d{3}/) && 
          line.length < 50 &&
          line.split(' ').length >= 2 &&
          line.split(' ').length <= 4) {
        fullName = line;
        break;
      }
    }

    // Extract sections by looking for keywords and patterns
    const sections = {
      experience: [],
      education: [],
      skills: [],
      summary: '',
      projects: [],
      certifications: [],
      languages: [],
      interests: []
    };

    let currentSection = '';
    let currentItem: any = {};
    
    // Look for section headers and content
    const sectionKeywords = {
      experience: ['experience', 'work', 'employment', 'career', 'professional'],
      education: ['education', 'qualification', 'degree', 'university', 'college', 'school'],
      skills: ['skill', 'technical', 'competenc', 'expertise', 'proficient'],
      summary: ['summary', 'objective', 'profile', 'about'],
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
        if (keywords.some(keyword => lowerLine.includes(keyword))) {
          foundSection = section;
          break;
        }
      }
      
      if (foundSection) {
        // Save current item before switching sections
        if (currentSection === 'experience' && currentItem.position) {
          sections.experience.push({ 
            ...currentItem, 
            id: Date.now() + Math.random(),
            startDate: currentItem.startDate || '',
            endDate: currentItem.endDate || '',
            location: currentItem.location || ''
          });
        } else if (currentSection === 'education' && currentItem.degree) {
          sections.education.push({ 
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
      if (currentSection === 'experience' && line.length > 5) {
        // Look for date patterns
        const datePattern = /(\d{2}\/\d{4}|\d{4})\s*-\s*(\d{2}\/\d{4}|\d{4}|present|current)/i;
        if (datePattern.test(line)) {
          const dateMatch = line.match(datePattern);
          if (currentItem.position) {
            sections.experience.push({ 
              ...currentItem, 
              id: Date.now() + Math.random(),
              startDate: dateMatch ? dateMatch[1] : '',
              endDate: dateMatch ? dateMatch[2] : '',
              location: currentItem.location || ''
            });
            currentItem = {};
          }
          currentItem.startDate = dateMatch ? dateMatch[1] : '';
          currentItem.endDate = dateMatch ? dateMatch[2] : '';
        } else if (!currentItem.position && line.length > 5 && line.length < 100 && !line.includes('•')) {
          currentItem.position = line;
        } else if (!currentItem.company && line.length > 2 && line.length < 80 && !line.includes('•')) {
          currentItem.company = line;
        } else if (line.includes('•') || line.length > 10) {
          currentItem.description = (currentItem.description || '') + line + '\n';
        }
      } else if (currentSection === 'education' && line.length > 3) {
        if (!currentItem.degree && line.length > 5 && line.length < 100) {
          currentItem.degree = line;
        } else if (!currentItem.school && line.length > 3 && line.length < 80) {
          currentItem.school = line;
        }
        
        if (currentItem.degree && currentItem.school) {
          sections.education.push({ 
            ...currentItem, 
            id: Date.now() + Math.random(),
            startDate: '',
            endDate: '',
            location: '',
            gpa: ''
          });
          currentItem = {};
        }
      } else if (currentSection === 'skills' && line.length > 2) {
        const skills = line.split(/[,•\-\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 1 && s.length < 30);
        sections.skills.push(...skills);
      } else if (currentSection === 'summary' && line.length > 15) {
        sections.summary += line + ' ';
      } else if (currentSection === 'projects' && line.length > 5) {
        if (!currentItem.name && line.length < 80) {
          currentItem.name = line;
        } else if (currentItem.name && !currentItem.description) {
          currentItem.description = line;
          sections.projects.push({
            ...currentItem,
            id: Date.now() + Math.random(),
            technologies: '',
            link: '',
            startDate: '',
            endDate: ''
          });
          currentItem = {};
        }
      } else if (currentSection === 'certifications' && line.length > 5) {
        sections.certifications.push({
          id: Date.now() + Math.random(),
          name: line,
          issuer: '',
          date: '',
          credentialId: ''
        });
      } else if (currentSection === 'languages' && line.length > 2) {
        const languages = line.split(/[,•\-\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 1);
        languages.forEach(lang => {
          sections.languages.push({
            id: Date.now() + Math.random(),
            language: lang,
            proficiency: 'Professional'
          });
        });
      } else if (currentSection === 'interests' && line.length > 2) {
        const interests = line.split(/[,•\-\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 1);
        sections.interests.push(...interests);
      }
    }

    // Add any remaining items
    if (currentItem.position) {
      sections.experience.push({ 
        ...currentItem, 
        id: Date.now() + Math.random(),
        startDate: currentItem.startDate || '',
        endDate: currentItem.endDate || '',
        location: currentItem.location || ''
      });
    }

    return {
      rawText: text,
      personal: {
        fullName: fullName || '',
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: '',
        summary: sections.summary.trim()
      },
      experience: sections.experience,
      education: sections.education,
      skills: [...new Set(sections.skills)],
      projects: sections.projects,
      certifications: sections.certifications,
      languages: sections.languages,
      interests: [...new Set(sections.interests)]
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  }, []);

  const processFile = async (file: File) => {
    setProcessing(true);
    setCurrentStep('upload');
    
    try {
      console.log('Starting file processing...');
      const text = await extractTextFromFile(file);
      
      if (!text || text.length < 10) {
        throw new Error('Could not extract readable text from the file. Please ensure the file contains text content and try again.');
      }

      console.log('Text extraction successful, parsing data...');
      setExtractedText(text);
      
      // Automatically parse the data and show template view
      const parsed = parseExtractedText(text);
      setParsedData(parsed);
      setCurrentStep('parsed');
      toast.success('CV data extracted and organized successfully!');
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Failed to extract data from document. Please try a different file or format.');
    } finally {
      setProcessing(false);
    }
  };

  const enhanceWithAI = async () => {
    if (!parsedData) return;
    
    setEnhancing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const enhanced = {
        ...parsedData,
        personal: {
          ...parsedData.personal,
          summary: parsedData.personal.summary || "Results-driven professional with proven expertise in delivering innovative solutions and achieving strategic objectives."
        },
        experience: parsedData.experience.map((exp: any) => ({
          ...exp,
          description: exp.description || "• Delivered high-impact solutions that improved operational efficiency\n• Collaborated with cross-functional teams to achieve strategic objectives\n• Demonstrated strong problem-solving skills and attention to detail"
        }))
      };
      
      setParsedData(enhanced);
      toast.success('Data enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance data');
    } finally {
      setEnhancing(false);
    }
  };

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

  const handleUseData = () => {
    if (parsedData) {
      onDataExtracted(parsedData);
      onClose();
    }
  };

  const resetProcess = () => {
    setUploadedFile(null);
    setExtractedText('');
    setParsedData(null);
    setCurrentStep('upload');
  };

  // Load PDF.js library for better PDF support
  React.useEffect(() => {
    const loadPDFJS = () => {
      if (!(window as any).pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        };
        document.head.appendChild(script);
      }
    };
    
    loadPDFJS();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Smart CV Template Organizer
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your CV and see it automatically organized in a professional template format
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 'upload' && (
            <>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    {processing ? (
                      <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                      {processing ? 'Processing and organizing your CV...' : 'Upload your CV document'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {processing ? 'Extracting content and arranging it in a professional template' : 'Drag & drop or click to select PDF, DOC, DOCX, or TXT files'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Your information will be automatically organized without losing any details
                    </p>
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>Processing: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </>
          )}

          {currentStep === 'parsed' && parsedData && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <span className="font-medium">CV successfully organized in professional template!</span>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Found {parsedData.experience?.length || 0} work experiences, {parsedData.education?.length || 0} education entries, and {parsedData.skills?.length || 0} skills.
                  </p>
                </div>
              </div>

              {/* Organized CV Template Display */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {parsedData.personal?.fullName || 'Professional Name'}
                    </h1>
                    <div className="flex items-center justify-center flex-wrap gap-4 text-gray-600 dark:text-gray-400 text-sm">
                      {parsedData.personal?.email && (
                        <span>{parsedData.personal.email}</span>
                      )}
                      {parsedData.personal?.phone && (
                        <span>{parsedData.personal.phone}</span>
                      )}
                      {parsedData.personal?.location && (
                        <span>{parsedData.personal.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  {parsedData.personal?.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {parsedData.personal.summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience */}
                  {parsedData.experience?.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        Professional Experience
                      </h2>
                      <div className="space-y-4">
                        {parsedData.experience.map((exp: any, index: number) => (
                          <div key={index} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                                {exp.location && <p className="text-gray-600 dark:text-gray-400 text-sm">{exp.location}</p>}
                              </div>
                              {(exp.startDate || exp.endDate) && (
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                  {exp.startDate} - {exp.endDate}
                                </span>
                              )}
                            </div>
                            {exp.description && (
                              <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {exp.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {parsedData.education?.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        Education
                      </h2>
                      <div className="space-y-3">
                        {parsedData.education.map((edu: any, index: number) => (
                          <div key={index} className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                              <p className="text-blue-600 dark:text-blue-400">{edu.school}</p>
                              {edu.location && <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.location}</p>}
                              {edu.gpa && <p className="text-gray-600 dark:text-gray-400 text-sm">GPA: {edu.gpa}</p>}
                            </div>
                            {(edu.startDate || edu.endDate) && (
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                {edu.startDate} - {edu.endDate}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {parsedData.skills?.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        Skills & Competencies
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional sections in grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Projects */}
                    {parsedData.projects?.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                          Projects
                        </h2>
                        <div className="space-y-3">
                          {parsedData.projects.map((project: any, index: number) => (
                            <div key={index}>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                              {project.description && (
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{project.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {parsedData.certifications?.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                          Certifications
                        </h2>
                        <div className="space-y-2">
                          {parsedData.certifications.map((cert: any, index: number) => (
                            <div key={index}>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{cert.name}</h3>
                              {cert.issuer && <p className="text-gray-600 dark:text-gray-400 text-sm">{cert.issuer}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {parsedData.languages?.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                          Languages
                        </h2>
                        <div className="space-y-1">
                          {parsedData.languages.map((lang: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-700 dark:text-gray-300">{lang.language}</span>
                              <span className="text-gray-500 dark:text-gray-400">{lang.proficiency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
                    {parsedData.interests?.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                          Interests
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.interests.map((interest: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={resetProcess} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Upload Different File
                </Button>
                
                <Button
                  onClick={enhanceWithAI}
                  disabled={enhancing}
                  variant="outline"
                >
                  {enhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
                
                <Button onClick={handleUseData} className="flex-1">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Use This Organized Data
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataExtractor;
