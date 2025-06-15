
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
  Award
} from 'lucide-react';

interface CVParserProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVParser: React.FC<CVParserProps> = ({ onDataExtracted, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Convert to string and try to extract readable text
          let text = '';
          for (let i = 0; i < uint8Array.length; i++) {
            const char = String.fromCharCode(uint8Array[i]);
            if (char.match(/[a-zA-Z0-9\s@\.\-\(\)]/)) {
              text += char;
            } else if (char.match(/[\n\r]/)) {
              text += ' ';
            }
          }
          
          // Clean up the text
          text = text.replace(/\s+/g, ' ').trim();
          console.log('Extracted PDF text length:', text.length);
          console.log('Extracted PDF text preview:', text.substring(0, 500));
          
          resolve(text);
        } catch (error) {
          console.error('PDF extraction error:', error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Extract text from Word document
          let text = '';
          for (let i = 0; i < uint8Array.length; i++) {
            const char = String.fromCharCode(uint8Array[i]);
            if (char.match(/[a-zA-Z0-9\s@\.\-\(\)]/)) {
              text += char;
            }
          }
          
          text = text.replace(/\s+/g, ' ').trim();
          console.log('Extracted Word text length:', text.length);
          console.log('Extracted Word text preview:', text.substring(0, 500));
          
          resolve(text);
        } catch (error) {
          console.error('Word extraction error:', error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const parseResumeText = (text: string) => {
    try {
      console.log('Starting to parse text:', text.substring(0, 200));
      
      // Initialize data structure
      const data = {
        personal: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: ''
        },
        experience: [] as any[],
        education: [] as any[],
        skills: [] as string[],
        projects: [] as any[],
        certifications: [] as any[],
        languages: [] as any[],
        interests: [] as string[]
      };

      // More comprehensive email extraction
      const emailPatterns = [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi
      ];
      
      for (const pattern of emailPatterns) {
        const emailMatch = text.match(pattern);
        if (emailMatch && emailMatch[0]) {
          data.personal.email = emailMatch[0];
          console.log('Found email:', data.personal.email);
          break;
        }
      }

      // Enhanced phone extraction
      const phonePatterns = [
        /\+?[\d\s\-\(\)]{10,}/g,
        /[\(]?\d{3}[\)]?[\s\-\.]?\d{3}[\s\-\.]?\d{4}/g,
        /\d{3}\s?\d{3}\s?\d{4}/g
      ];
      
      for (const pattern of phonePatterns) {
        const phoneMatch = text.match(pattern);
        if (phoneMatch && phoneMatch[0] && phoneMatch[0].replace(/\D/g, '').length >= 10) {
          data.personal.phone = phoneMatch[0].trim();
          console.log('Found phone:', data.personal.phone);
          break;
        }
      }

      // Enhanced name extraction
      const lines = text.split(/[\n\r]/).map(line => line.trim()).filter(line => line.length > 0);
      
      // Look for name in first few lines
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i];
        // Skip lines with email or phone
        if (line.includes('@') || line.match(/\d{3}.*\d{3}.*\d{4}/)) continue;
        
        // Look for name patterns
        if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) && line.length < 50 && !line.toLowerCase().includes('resume')) {
          data.personal.fullName = line;
          console.log('Found name:', data.personal.fullName);
          break;
        }
      }

      // Enhanced skills extraction
      const allSkillKeywords = [
        // Programming languages
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
        // Web technologies
        'React', 'Angular', 'Vue', 'Node.js', 'Express', 'HTML', 'CSS', 'TypeScript', 'jQuery',
        // Frameworks and libraries
        'Laravel', 'Django', 'Flask', 'Spring', 'Rails', 'Bootstrap', 'Tailwind',
        // Databases
        'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Oracle',
        // Cloud and DevOps
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
        // Tools and software
        'Linux', 'Windows', 'MacOS', 'Photoshop', 'Illustrator', 'Figma', 'Sketch',
        // Soft skills
        'Leadership', 'Management', 'Communication', 'Problem Solving', 'Teamwork', 'Project Management'
      ];

      allSkillKeywords.forEach(skill => {
        const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (regex.test(text) && !data.skills.includes(skill)) {
          data.skills.push(skill);
        }
      });

      console.log('Found skills:', data.skills);

      // Basic experience extraction
      const experienceKeywords = ['experience', 'work', 'employment', 'career', 'position', 'job'];
      const hasExperienceSection = experienceKeywords.some(keyword => 
        text.toLowerCase().includes(keyword)
      );

      if (hasExperienceSection) {
        // Look for company names and positions
        const companyPatterns = [
          /at\s+([A-Z][a-zA-Z\s&.,]{2,30})/gi,
          /([A-Z][a-zA-Z\s&.,]{2,30})\s*[-–]\s*\d{4}/gi
        ];

        let experienceCount = 0;
        for (const pattern of companyPatterns) {
          const matches = [...text.matchAll(pattern)];
          matches.forEach((match, index) => {
            if (experienceCount < 3) { // Limit to avoid too many false positives
              data.experience.push({
                id: Date.now() + index,
                company: match[1]?.trim() || `Company ${experienceCount + 1}`,
                position: 'Position',
                location: '',
                startDate: '',
                endDate: '',
                description: 'Professional experience'
              });
              experienceCount++;
            }
          });
        }
      }

      console.log('Found experience entries:', data.experience.length);

      // Enhanced education extraction
      const educationKeywords = ['university', 'college', 'bachelor', 'master', 'degree', 'phd', 'education'];
      const hasEducationSection = educationKeywords.some(keyword => 
        text.toLowerCase().includes(keyword)
      );

      if (hasEducationSection) {
        const degreePatterns = [
          /bachelor[^\n]*/gi,
          /master[^\n]*/gi,
          /phd[^\n]*/gi,
          /degree[^\n]*/gi
        ];

        degreePatterns.forEach((pattern, index) => {
          const matches = text.match(pattern);
          if (matches && matches[0] && data.education.length < 2) {
            data.education.push({
              id: Date.now() + index,
              degree: matches[0].trim(),
              school: 'University',
              location: '',
              startDate: '',
              endDate: '',
              gpa: ''
            });
          }
        });
      }

      console.log('Found education entries:', data.education.length);

      // Extract summary from first paragraph
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
      if (paragraphs.length > 0) {
        data.personal.summary = paragraphs[0].substring(0, 300).trim();
        console.log('Found summary:', data.personal.summary.substring(0, 100));
      }

      console.log('Final parsed data:', {
        hasName: !!data.personal.fullName,
        hasEmail: !!data.personal.email,
        hasPhone: !!data.personal.phone,
        experienceCount: data.experience.length,
        educationCount: data.education.length,
        skillsCount: data.skills.length
      });

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
      
      let text = '';
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      console.log('Processing file:', fileName, 'Type:', fileType);
      
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        text = await extractTextFromWord(file);
      } else {
        // Try to read as plain text
        const reader = new FileReader();
        text = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      setProgress(60);

      if (!text || text.trim().length < 20) {
        throw new Error('Could not extract sufficient text from the file. The file might be empty, corrupted, or in an unsupported format.');
      }

      console.log('Text extracted successfully, length:', text.length);

      const parsedData = parseResumeText(text);
      
      setProgress(90);

      // More lenient validation - accept if we found ANY useful information
      const hasAnyInfo = parsedData.personal.fullName || 
                        parsedData.personal.email || 
                        parsedData.personal.phone ||
                        parsedData.experience.length > 0 || 
                        parsedData.education.length > 0 ||
                        parsedData.skills.length > 0 ||
                        parsedData.personal.summary;

      if (!hasAnyInfo) {
        console.warn('No useful information found in CV');
        // Still allow the user to proceed but with a warning
        toast.warning('Limited information extracted from CV. You may need to fill in details manually.');
        
        // Provide minimal structure so user can still use the parser
        parsedData.personal.fullName = 'Your Name';
        parsedData.personal.summary = 'Professional summary to be updated';
      }

      setProgress(100);
      setExtractedData(parsedData);
      
      if (hasAnyInfo) {
        toast.success('CV parsed successfully! Review the extracted data.');
      }
      
    } catch (error: any) {
      console.error('CV parsing error:', error);
      toast.error(error.message || 'Failed to parse CV. Please try a different file or check if the file contains readable text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
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

  const handleUseData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Enhanced CV Parser
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!extractedData && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
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
                    {isProcessing ? 'Processing your CV...' : 'Upload your CV'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX, and TXT files (max 10MB)
                  </p>
                </div>
                
                {isProcessing && (
                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-center mt-1">{progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {extractedData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">CV parsed successfully!</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Personal Info</span>
                  </div>
                  <div className="text-sm space-y-1">
                    {extractedData.personal.fullName && (
                      <p><strong>Name:</strong> {extractedData.personal.fullName}</p>
                    )}
                    {extractedData.personal.email && (
                      <p><strong>Email:</strong> {extractedData.personal.email}</p>
                    )}
                    {extractedData.personal.phone && (
                      <p><strong>Phone:</strong> {extractedData.personal.phone}</p>
                    )}
                    {extractedData.personal.location && (
                      <p><strong>Location:</strong> {extractedData.personal.location}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">Experience</span>
                  </div>
                  <p className="text-sm">{extractedData.experience.length} positions found</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Education</span>
                  </div>
                  <p className="text-sm">{extractedData.education.length} entries found</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Skills</span>
                  </div>
                  <p className="text-sm">{extractedData.skills.length} skills identified</p>
                </div>
              </div>

              {extractedData.skills.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Detected Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.slice(0, 10).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {extractedData.skills.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{extractedData.skills.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUseData} className="flex-1">
                  Use This Data
                </Button>
                <Button variant="outline" onClick={() => setExtractedData(null)}>
                  Upload Different File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVParser;
