import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Brain,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface EnhancedCVParserProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

type ExtractionMode = 'manual' | 'ai' | 'rapidapi';

const EnhancedCVParser: React.FC<EnhancedCVParserProps> = ({ onDataExtracted, onClose }) => {
  const { apiKey } = useAPIKey();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [extractionStats, setExtractionStats] = useState<any>(null);
  const [mode, setMode] = useState<ExtractionMode>('rapidapi');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // --- RapidAPI Resume Parser extraction ---
  const extractWithRapidAPI = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          setProgress(30);
          const base64Data = fileReader.result as string;
          const base64Content = base64Data.split(',')[1];
          setProgress(45);

          const { data: result, error } = await supabase.functions.invoke('resume-parser-api', {
            body: { 
              fileContent: base64Content,
              fileName: file.name,
              fileType: file.type
            }
          });

          setProgress(75);
          if (error) throw error;

          if (result?.extractedData) {
            setExtractedData(result.extractedData);

            // Collect stats for better preview
            setExtractionStats({
              experienceEntries: result.extractedData?.experience?.length ?? 0,
              educationEntries: result.extractedData?.education?.length ?? 0,
              skillsFound: result.extractedData?.skills?.length ?? 0,
              projectsFound: result.extractedData?.projects?.length ?? 0,
              certificationsFound: result.extractedData?.certifications?.length ?? 0,
              languagesFound: result.extractedData?.languages?.length ?? 0,
            });

            setProgress(100);
            toast.success('CV extracted successfully with RapidAPI!');
          } else {
            throw new Error('No data could be extracted from your CV with RapidAPI.');
          }
        } catch (err: any) {
          toast.error(err.message || 'RapidAPI extraction failed!');
        } finally {
          setIsProcessing(false);
        }
      };
      fileReader.readAsDataURL(file);
    } catch (err: any) {
      setIsProcessing(false);
      toast.error('Failed to read file for RapidAPI extraction');
    }
  };

  // --- AI-powered extraction ---
  const extractWithAI = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    try {
      if (!apiKey) {
        toast.error('Please set your Gemini API key in Settings');
        setIsProcessing(false);
        return;
      }
      // Convert file to base64
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          setProgress(30);
          const base64String = fileReader.result as string;
          const base64Content = base64String.split(',')[1];
          setProgress(45);

          const { data: result, error } = await supabase.functions.invoke('cv-reader-ai', {
            body: { 
              fileContent: base64Content,
              fileName: file.name,
              fileType: file.type,
              apiKey
            }
          });

          setProgress(75);
          if (error) throw error;

          if (result?.extractedData) {
            setExtractedData(result.extractedData);

            // Collect stats for better preview
            setExtractionStats({
              experienceEntries: result.extractedData?.experience?.length ?? 0,
              educationEntries: result.extractedData?.education?.length ?? 0,
              skillsFound: result.extractedData?.skills?.length ?? 0,
              projectsFound: result.extractedData?.projects?.length ?? 0,
              certificationsFound: result.extractedData?.certifications?.length ?? 0,
              languagesFound: result.extractedData?.languages?.length ?? 0,
            });

            setProgress(100);
            toast.success('AI CV extraction complete!');
          } else {
            throw new Error('No data could be extracted from your CV with AI.');
          }
        } catch (err: any) {
          toast.error(err.message || 'AI extraction failed!');
        } finally {
          setIsProcessing(false);
        }
      };
      fileReader.readAsDataURL(file);
    } catch (err: any) {
      setIsProcessing(false);
      toast.error('Failed to read file for AI extraction');
    }
  };

  // --- Manual/local extraction ---
  const advancedTextExtraction = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          let text = reader.result as string;
          // Enhanced text cleaning and preprocessing
          text = text
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/[^\x20-\x7E\n]/g, ' ')
            .trim();
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const enhancedResumeParser = (text: string) => {
    try {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      
      // Initialize comprehensive data structure
      const data = {
        personal: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          website: '',
          linkedin: '',
          github: ''
        },
        experience: [] as any[],
        education: [] as any[],
        skills: [] as string[],
        projects: [] as any[],
        certifications: [] as any[],
        languages: [] as any[],
        interests: [] as string[],
        achievements: [] as string[]
      };

      // Enhanced email extraction with multiple patterns
      const emailPatterns = [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        /mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi
      ];
      
      for (const pattern of emailPatterns) {
        const matches = text.match(pattern);
        if (matches) {
          data.personal.email = matches[0].replace('mailto:', '');
          break;
        }
      }

      // Enhanced phone extraction with international formats
      const phonePatterns = [
        /[\+]?[1-9]?[\-\s\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}/g,
        /[\+]?[0-9]{1,3}[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,4}/g
      ];
      
      for (const pattern of phonePatterns) {
        const matches = text.match(pattern);
        if (matches) {
          data.personal.phone = matches[0];
          break;
        }
      }

      // Enhanced name extraction with multiple strategies
      const namePatterns = [
        /^([A-Z][a-z]+ [A-Z][a-z]+)/,
        /Name:\s*([A-Z][a-z]+ [A-Z][a-z]+)/i,
        /([A-Z][A-Z\s]+[A-Z])/
      ];
      
      for (const pattern of namePatterns) {
        for (const line of lines.slice(0, 10)) {
          const match = line.match(pattern);
          if (match && !line.includes('@') && line.length < 60) {
            data.personal.fullName = match[1] || match[0];
            break;
          }
        }
        if (data.personal.fullName) break;
      }

      // Extract website/portfolio links
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      const urls = text.match(urlPattern) || [];
      for (const url of urls) {
        if (url.includes('linkedin')) {
          data.personal.linkedin = url;
        } else if (url.includes('github')) {
          data.personal.github = url;
        } else if (!data.personal.website) {
          data.personal.website = url;
        }
      }

      // Enhanced location extraction
      const locationPatterns = [
        /([A-Z][a-z]+,\s*[A-Z]{2}(\s+\d{5})?)/,
        /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2})/,
        /Location:\s*([A-Z][a-z,\s]+)/i,
        /Address:\s*([A-Z][a-z,\s]+)/i
      ];
      
      for (const pattern of locationPatterns) {
        const locationMatch = text.match(pattern);
        if (locationMatch) {
          data.personal.location = locationMatch[1].replace(/Location:|Address:/i, '').trim();
          break;
        }
      }

      // Enhanced skills extraction with categorization
      const technicalSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
        'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS',
        'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Oracle', 'SQLite',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
        'Git', 'SVN', 'Mercurial', 'Linux', 'Unix', 'Windows', 'macOS',
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib',
        'Figma', 'Adobe Creative Suite', 'Sketch', 'InVision'
      ];

      const softSkills = [
        'Leadership', 'Project Management', 'Team Management', 'Communication', 'Problem Solving',
        'Critical Thinking', 'Analytical Thinking', 'Creative Thinking', 'Strategic Planning',
        'Time Management', 'Multitasking', 'Adaptability', 'Flexibility', 'Collaboration',
        'Teamwork', 'Conflict Resolution', 'Negotiation', 'Public Speaking', 'Presentation Skills'
      ];

      // Check for skills in text
      [...technicalSkills, ...softSkills].forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(text)) {
          if (!data.skills.includes(skill)) {
            data.skills.push(skill);
          }
        }
      });

      // Extract skills from dedicated sections
      const skillsSectionRegex = /(?:skills|competencies|technologies|expertise)[\s:]*([^]*?)(?=\n(?:[A-Z][a-z]+|$))/gi;
      const skillsMatches = text.match(skillsSectionRegex);
      if (skillsMatches) {
        skillsMatches.forEach(section => {
          const extractedSkills = section
            .split(/[,\n•·\-\|]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 30)
            .map(s => s.replace(/^(skills|competencies|technologies|expertise)[\s:]*/, '').trim())
            .filter(s => s);
          
          extractedSkills.forEach(skill => {
            if (!data.skills.includes(skill) && skill.length > 2) {
              data.skills.push(skill);
            }
          });
        });
      }

      // Enhanced experience extraction
      const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience', 'career history'];
      const educationKeywords = ['education', 'academic', 'university', 'college', 'degree', 'qualification'];
      const projectKeywords = ['projects', 'portfolio', 'work samples'];
      
      let currentSection = '';
      let experienceEntry: any = {};
      let educationEntry: any = {};
      let projectEntry: any = {};
      
      lines.forEach((line, index) => {
        const lowerLine = line.toLowerCase();
        
        // Identify sections
        if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'experience';
          return;
        }
        
        if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'education';
          return;
        }

        if (projectKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'projects';
          return;
        }

        // Enhanced experience parsing
        if (currentSection === 'experience') {
          // Multiple job title patterns
          const jobPatterns = [
            /^([A-Z][a-zA-Z\s]+)\s+at\s+([A-Z][a-zA-Z\s&.]+)/,
            /^([A-Z][a-zA-Z\s]+)\s+[-–]\s+([A-Z][a-zA-Z\s&.]+)/,
            /^([A-Z][a-zA-Z\s]+),\s+([A-Z][a-zA-Z\s&.]+)/
          ];
          
          for (const pattern of jobPatterns) {
            const match = line.match(pattern);
            if (match) {
              if (experienceEntry.position) {
                data.experience.push({ ...experienceEntry, id: Date.now() + Math.random() });
              }
              
              experienceEntry = {
                position: match[1].trim(),
                company: match[2].trim(),
                location: '',
                startDate: '',
                endDate: '',
                description: ''
              };
              break;
            }
          }
          
          // Enhanced date parsing
          const datePatterns = [
            /(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present)/i,
            /(\d{4})\s*[-–]\s*(\d{4}|present)/i,
            /(\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{4}|present)/i
          ];
          
          for (const pattern of datePatterns) {
            const dateMatch = line.match(pattern);
            if (dateMatch && experienceEntry.position) {
              experienceEntry.startDate = dateMatch[1];
              experienceEntry.endDate = dateMatch[2];
              break;
            }
          }
          
          // Enhanced description parsing
          if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*') ||
               (line.length > 20 && !line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) && !line.includes('|'))) &&
               experienceEntry.position) {
            experienceEntry.description += (experienceEntry.description ? '\n' : '') + line;
          }
        }

        // Enhanced education parsing
        if (currentSection === 'education') {
          const degreePatterns = [
            /(Bachelor|Master|PhD|Doctorate|Associate|Certificate|Diploma).*in.*([A-Z][a-zA-Z\s]+)/i,
            /(B\.S\.|B\.A\.|M\.S\.|M\.A\.|Ph\.D\.).*([A-Z][a-zA-Z\s]+)/i
          ];
          
          for (const pattern of degreePatterns) {
            const match = line.match(pattern);
            if (match) {
              if (educationEntry.degree) {
                data.education.push({ ...educationEntry, id: Date.now() + Math.random() });
              }
              
              educationEntry = {
                degree: match[0],
                school: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: ''
              };
              break;
            }
          }
          
          // Extract school name
          if (line.includes('University') || line.includes('College') || line.includes('Institute')) {
            if (educationEntry.degree && !educationEntry.school) {
              educationEntry.school = line;
            }
          }
          
          // Extract GPA
          const gpaMatch = line.match(/GPA:\s*(\d+\.?\d*)/i);
          if (gpaMatch && educationEntry.degree) {
            educationEntry.gpa = gpaMatch[1];
          }
        }

        // Project parsing
        if (currentSection === 'projects') {
          if (line.length > 10 && !line.startsWith('•') && !line.startsWith('-')) {
            if (projectEntry.name) {
              data.projects.push({ ...projectEntry, id: Date.now() + Math.random() });
            }
            
            projectEntry = {
              name: line,
              description: '',
              technologies: '',
              link: '',
              startDate: '',
              endDate: ''
            };
          } else if (projectEntry.name && (line.startsWith('•') || line.startsWith('-'))) {
            projectEntry.description += (projectEntry.description ? '\n' : '') + line;
          }
        }
      });

      // Add the last entries
      if (experienceEntry.position) {
        data.experience.push({ ...experienceEntry, id: Date.now() + Math.random() });
      }
      if (educationEntry.degree) {
        data.education.push({ ...educationEntry, id: Date.now() + Math.random() });
      }
      if (projectEntry.name) {
        data.projects.push({ ...projectEntry, id: Date.now() + Math.random() });
      }

      // Extract summary/objective with better patterns
      const summaryPatterns = [
        /(?:summary|objective|profile|about)[\s:]*([^]*?)(?=\n(?:experience|education|skills|employment))/gi,
        /(?:professional summary)[\s:]*([^]*?)(?=\n[A-Z])/gi
      ];
      
      for (const pattern of summaryPatterns) {
        const summaryMatch = text.match(pattern);
        if (summaryMatch && summaryMatch[1]) {
          data.personal.summary = summaryMatch[1].trim().substring(0, 500);
          break;
        }
      }

      // Extract certifications
      const certificationPatterns = [
        /(?:certifications?|certificates?)[\s:]*([^]*?)(?=\n(?:[A-Z][a-z]+|$))/gi
      ];
      
      certificationPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(section => {
            const certs = section
              .split(/\n/)
              .map(cert => cert.trim())
              .filter(cert => cert && cert.length > 5)
              .slice(0, 10);
            
            certs.forEach(cert => {
              data.certifications.push({
                id: Date.now() + Math.random(),
                name: cert,
                issuer: '',
                date: '',
                credentialId: ''
              });
            });
          });
        }
      });

      // Extract languages
      const languagePattern = /(?:languages?)[\s:]*([^]*?)(?=\n(?:[A-Z][a-z]+|$))/gi;
      const languageMatches = text.match(languagePattern);
      if (languageMatches) {
        languageMatches.forEach(section => {
          const langs = section
            .split(/[,\n•·\-]/)
            .map(lang => lang.trim())
            .filter(lang => lang && lang.length > 2 && lang.length < 30);
          
          langs.forEach(lang => {
            data.languages.push({
              id: Date.now() + Math.random(),
              language: lang,
              proficiency: 'Professional'
            });
          });
        });
      }

      return data;
    } catch (error) {
      console.error('Error parsing resume text:', error);
      throw new Error('Failed to parse resume content');
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(20);
      
      const text = await advancedTextExtraction(file);
      setProgress(60);

      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract sufficient text from the file. Please ensure the file contains readable text content.');
      }

      const parsedData = enhancedResumeParser(text);
      setProgress(90);

      // Calculate extraction statistics
      const stats = {
        totalSections: Object.keys(parsedData).length,
        personalInfoComplete: Object.values(parsedData.personal).filter(v => v).length,
        experienceEntries: parsedData.experience.length,
        educationEntries: parsedData.education.length,
        skillsFound: parsedData.skills.length,
        projectsFound: parsedData.projects.length,
        certificationsFound: parsedData.certifications.length,
        languagesFound: parsedData.languages.length
      };

      // Validate extracted data
      if (!parsedData.personal.fullName && !parsedData.personal.email && 
          parsedData.experience.length === 0 && parsedData.skills.length === 0) {
        throw new Error('Could not find sufficient information in CV. Please check the file content and format.');
      }

      setProgress(100);
      setExtractedData(parsedData);
      setExtractionStats(stats);
      
      toast.success(`CV parsed successfully! Extracted ${stats.skillsFound} skills, ${stats.experienceEntries} experience entries, and more.`);
      
    } catch (error: any) {
      console.error('CV parsing error:', error);
      toast.error(error.message || 'Failed to parse CV. Please try a different file or format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);

      // Choose extraction method based on mode
      if (mode === 'rapidapi') {
        extractWithRapidAPI(file);
      } else if (mode === 'ai') {
        extractWithAI(file);
      } else {
        processFile(file);
      }
    }
  }, [mode, apiKey]);

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

  const handleUseData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Enhanced CV Parser
            <Badge variant={mode === 'rapidapi' ? "default" : mode === 'ai' ? "secondary" : "outline"} className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              {mode === 'rapidapi' ? "RapidAPI Parser" : mode === 'ai' ? "AI Extraction" : "Manual Extraction"}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <label className="text-sm font-medium">Extraction Method:</label>
            <div className="flex flex-row gap-2">
              <Button
                variant={mode === 'rapidapi' ? 'default' : 'outline'}
                onClick={() => setMode('rapidapi')}
                className={mode === 'rapidapi' ? 'bg-gradient-to-r from-purple-500 to-pink-700' : ''}
              >
                RapidAPI Parser (Recommended)
              </Button>
              <Button
                variant={mode === 'ai' ? 'default' : 'outline'}
                onClick={() => setMode('ai')}
                className={mode === 'ai' ? 'bg-gradient-to-r from-blue-500 to-purple-700' : ''}
              >
                AI Extraction
              </Button>
              <Button
                variant={mode === 'manual' ? 'default' : 'outline'}
                onClick={() => setMode('manual')}
                className={mode === 'manual' ? 'bg-gradient-to-r from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-900' : ''}
              >
                Manual (Local Parser)
              </Button>
            </div>
          </div>

          {/* Dropzone for upload */}
          {!extractedData && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'}
                ${isProcessing ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <p className="text-lg font-medium">
                    {isProcessing
                      ? (mode === 'rapidapi'
                          ? 'RapidAPI is analyzing your CV...'
                          : mode === 'ai'
                          ? 'AI is analyzing your CV...'
                          : 'Processing your CV...')
                      : 'Upload your CV'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    PDF, DOC, DOCX, or TXT, max 10MB.
                  </p>
                </div>
              </div>
              
              {isProcessing && (
                <div className="mt-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
                </div>
              )}
            </div>
          )}

          {/* Extraction Results */}
          {extractedData && extractionStats && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Extraction Complete
                </h3>
                <Button onClick={handleUseData} className="bg-green-600 hover:bg-green-700">
                  Use This Data
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <User className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">Personal Info</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {extractedData.personal?.fullName ? '✓' : '✗'} Complete
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <Briefcase className="w-6 h-6 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {extractionStats.experienceEntries} entries
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                  <GraduationCap className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                  <p className="text-sm font-medium">Education</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {extractionStats.educationEntries} entries
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                  <Award className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                  <p className="text-sm font-medium">Skills</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {extractionStats.skillsFound} found
                  </p>
                </div>
              </div>

              {/* Preview of extracted data */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h4 className="font-medium mb-3">Extracted Data Preview:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {extractedData.personal?.fullName || 'Not found'}</p>
                  <p><strong>Email:</strong> {extractedData.personal?.email || 'Not found'}</p>
                  <p><strong>Phone:</strong> {extractedData.personal?.phone || 'Not found'}</p>
                  <p><strong>Skills:</strong> {extractedData.skills?.slice(0, 5).join(', ') || 'None found'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCVParser;
