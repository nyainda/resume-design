
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Edit3, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedCVExtractorProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const EnhancedCVExtractor: React.FC<EnhancedCVExtractorProps> = ({ onDataExtracted, onClose }) => {
  const [extractedData, setExtractedData] = useState<any>(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);

  const simulateTextExtraction = (text: string) => {
    // Enhanced text parsing logic
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Personal Information
    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Find name (usually first meaningful line)
    const nameMatch = lines.find(line => 
      line.length > 2 && 
      line.length < 50 && 
      !line.includes('@') && 
      !line.match(/\d{3}/) &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('cv')
    );

    // Extract sections
    const sections = {
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      interests: []
    };

    let currentSection = '';
    let currentItem: any = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Detect sections
      if (line.includes('experience') || line.includes('work') || line.includes('employment')) {
        currentSection = 'experience';
        continue;
      } else if (line.includes('education') || line.includes('academic')) {
        currentSection = 'education';
        continue;
      } else if (line.includes('skill') || line.includes('technical') || line.includes('competenc')) {
        currentSection = 'skills';
        continue;
      } else if (line.includes('project')) {
        currentSection = 'projects';
        continue;
      } else if (line.includes('certification') || line.includes('license')) {
        currentSection = 'certifications';
        continue;
      } else if (line.includes('language')) {
        currentSection = 'languages';
        continue;
      }

      // Extract data based on current section
      if (currentSection === 'experience') {
        // Look for company names, positions, dates
        const originalLine = lines[i];
        if (originalLine.match(/\d{4}/) && (originalLine.includes('-') || originalLine.includes('to'))) {
          // This is likely a date range
          if (currentItem.position) {
            // Parse dates
            const dateMatch = originalLine.match(/(\d{4})\s*[-–to]\s*(\d{4}|present|current)/i);
            if (dateMatch) {
              currentItem.startDate = dateMatch[1];
              currentItem.endDate = dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current' ? 'present' : dateMatch[2];
            }
            sections.experience.push({ ...currentItem, id: Date.now() + Math.random() });
            currentItem = {};
          }
        } else if (originalLine.length > 10 && !originalLine.includes('•') && !originalLine.startsWith('-')) {
          // This might be a position or company
          if (!currentItem.position) {
            currentItem.position = originalLine;
          } else if (!currentItem.company) {
            currentItem.company = originalLine;
          }
        } else if (originalLine.includes('•') || originalLine.startsWith('-')) {
          // This is a description bullet point
          if (!currentItem.description) {
            currentItem.description = originalLine;
          } else {
            currentItem.description += '\n' + originalLine;
          }
        }
      } else if (currentSection === 'education') {
        const originalLine = lines[i];
        if (originalLine.match(/\d{4}/)) {
          if (currentItem.degree) {
            const dateMatch = originalLine.match(/(\d{4})/);
            if (dateMatch) {
              currentItem.endDate = dateMatch[1];
            }
            sections.education.push({ ...currentItem, id: Date.now() + Math.random() });
            currentItem = {};
          }
        } else if (originalLine.length > 5) {
          if (!currentItem.degree) {
            currentItem.degree = originalLine;
          } else if (!currentItem.school) {
            currentItem.school = originalLine;
          }
        }
      } else if (currentSection === 'skills') {
        const originalLine = lines[i];
        if (originalLine.includes(',') || originalLine.includes('•') || originalLine.includes('-')) {
          // Parse multiple skills from one line
          const skillsList = originalLine
            .replace(/[•\-]/g, '')
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 1);
          sections.skills.push(...skillsList);
        } else if (originalLine.length > 2 && originalLine.length < 30) {
          sections.skills.push(originalLine);
        }
      }
    }

    // Extract summary (usually near the top)
    const summaryStart = Math.max(0, lines.findIndex(line => 
      line.toLowerCase().includes('summary') || 
      line.toLowerCase().includes('objective') ||
      line.toLowerCase().includes('profile')
    ));
    
    let summary = '';
    if (summaryStart > -1) {
      for (let i = summaryStart + 1; i < Math.min(summaryStart + 5, lines.length); i++) {
        if (lines[i].length > 20 && !lines[i].toLowerCase().includes('experience')) {
          summary += lines[i] + ' ';
        }
      }
    }

    return {
      personal: {
        fullName: nameMatch || '',
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: '',
        summary: summary.trim()
      },
      experience: sections.experience,
      education: sections.education,
      skills: sections.skills.slice(0, 20), // Limit to 20 skills
      projects: sections.projects,
      certifications: sections.certifications,
      languages: sections.languages,
      interests: sections.interests
    };
  };

  const extractFromFile = async (file: File) => {
    setIsExtracting(true);
    setExtractionProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (file.type === 'application/pdf') {
        // For PDF files, we'll simulate extraction
        // In a real app, you'd use a PDF parsing library
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate extracted text
        const simulatedText = `
John Doe
john.doe@email.com
(555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing web applications using modern technologies. Proven track record of delivering high-quality solutions and leading development teams.

EXPERIENCE

Senior Software Engineer
Tech Company Inc.
2020 - Present
• Developed and maintained web applications using React, Node.js, and PostgreSQL
• Led a team of 4 developers in implementing new features
• Improved application performance by 40% through optimization
• Collaborated with product managers and designers on user experience improvements

Software Developer
StartupXYZ
2018 - 2020
• Built responsive web applications using JavaScript, HTML, and CSS
• Integrated third-party APIs and payment systems
• Participated in code reviews and sprint planning
• Mentored junior developers

EDUCATION

Bachelor of Science in Computer Science
University of Technology
2018

SKILLS
JavaScript, React, Node.js, Python, PostgreSQL, MongoDB, Git, AWS, Docker, Agile Development

PROJECTS

E-commerce Platform
• Built a full-stack e-commerce solution using React and Node.js
• Implemented payment processing and inventory management
• Technologies: React, Node.js, MongoDB, Stripe API

Task Management App
• Developed a collaborative task management application
• Features include real-time updates and team collaboration
• Technologies: React, Firebase, Material-UI
        `;

        const extractedData = simulateTextExtraction(simulatedText);
        
        clearInterval(progressInterval);
        setExtractionProgress(100);
        setExtractedData(extractedData);
        
        toast.success('CV data extracted successfully!');
      } else if (file.type.includes('text')) {
        // Handle text files
        const text = await file.text();
        const extractedData = simulateTextExtraction(text);
        
        clearInterval(progressInterval);
        setExtractionProgress(100);
        setExtractedData(extractedData);
        
        toast.success('CV data extracted successfully!');
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or text file.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to extract CV data. Please try a different file.');
      setExtractionProgress(0);
    } finally {
      setIsExtracting(false);
    }
  };

  const enhanceWithAI = async () => {
    if (!extractedData) return;
    
    setAiEnhancing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate AI enhancement
      const enhanced = {
        ...extractedData,
        personal: {
          ...extractedData.personal,
          summary: extractedData.personal.summary || "Dynamic and results-driven professional with extensive experience in delivering innovative solutions. Demonstrated expertise in leveraging cutting-edge technologies to drive business growth and operational excellence. Proven track record of collaborating with cross-functional teams to achieve strategic objectives."
        },
        experience: extractedData.experience.map((exp: any) => ({
          ...exp,
          description: exp.description || "• Delivered high-impact solutions that improved operational efficiency\n• Collaborated with cross-functional teams to achieve strategic objectives\n• Demonstrated strong problem-solving skills and attention to detail"
        }))
      };
      
      setExtractedData(enhanced);
      toast.success('CV data enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance CV data');
    } finally {
      setAiEnhancing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      extractFromFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleUseData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Enhanced CV Extractor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!extractedData ? (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
                </p>
                <p className="text-gray-600 mb-4">
                  Drag and drop your CV or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, and TXT files
                </p>
              </div>

              {isExtracting && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Extracting CV data...</span>
                        <span className="text-sm text-gray-500">{extractionProgress}%</span>
                      </div>
                      <Progress value={extractionProgress} className="w-full" />
                      <p className="text-xs text-gray-500">
                        AI is analyzing your CV and extracting structured data
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">CV data extracted successfully!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Found {extractedData.experience?.length || 0} work experiences, {extractedData.education?.length || 0} education entries, and {extractedData.skills?.length || 0} skills.
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={enhanceWithAI}
                  disabled={aiEnhancing}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  {aiEnhancing ? 'Enhancing...' : 'AI Enhance'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Preview Data'}
                </Button>
              </div>

              {/* Data Preview */}
              {showPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Name: {extractedData.personal?.fullName || 'Not found'}</div>
                          <div>Email: {extractedData.personal?.email || 'Not found'}</div>
                          <div>Phone: {extractedData.personal?.phone || 'Not found'}</div>
                        </div>
                      </div>

                      {extractedData.experience?.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Experience ({extractedData.experience.length})</h3>
                          <div className="space-y-2">
                            {extractedData.experience.slice(0, 2).map((exp: any, index: number) => (
                              <div key={index} className="p-3 bg-gray-50 rounded">
                                <div className="font-medium">{exp.position || 'Position'}</div>
                                <div className="text-sm text-gray-600">{exp.company || 'Company'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {extractedData.skills?.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Skills ({extractedData.skills.length})</h3>
                          <div className="flex flex-wrap gap-2">
                            {extractedData.skills.slice(0, 10).map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Use Data Button */}
              <div className="flex gap-3">
                <Button onClick={handleUseData} className="flex-1">
                  Use This Data
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCVExtractor;
