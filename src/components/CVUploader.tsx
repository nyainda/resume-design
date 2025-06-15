
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Download, Edit, Eye, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import PDFGenerator from '@/components/PDFGenerator';

interface ResumeData {
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

const parseResumeData = (text: string): ResumeData => {
  // Basic parsing logic - improve as needed
  const lines = text.split('\n');
  const data: any = {
    personal: {},
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    interests: [],
    projects: []
  };

  let currentSection = null;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line.toLowerCase().includes('summary')) {
      currentSection = 'summary';
    } else if (line.toLowerCase().includes('experience')) {
      currentSection = 'experience';
      data.experience.push({});
    } else if (line.toLowerCase().includes('education')) {
      currentSection = 'education';
      data.education.push({});
    } else if (line.toLowerCase().includes('skills')) {
      currentSection = 'skills';
    } else {
      if (currentSection === 'summary' && !data.personal.summary) {
        data.personal.summary = line;
      } else if (currentSection === 'skills') {
        data.skills.push(line);
      }
    }
  });

  return data as ResumeData;
};

const CVUploader: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [editedText, setEditedText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [optimizing, setOptimizing] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = async (event: any) => {
      const text = event.target.result;
      setExtractedText(text);
      setEditedText(text);
      toast.success('File uploaded and text extracted!');
    };

    reader.onerror = () => {
      toast.error('Error reading file. Please try again.');
    };

    if (file.type === 'application/pdf') {
      // For simplicity, read as text.  Consider using a PDF parsing library for better results.
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const optimizeWithAI = async () => {
    setOptimizing(true);
    try {
      // Mock AI optimization
      const atsScore = Math.floor(Math.random() * (99 - 75 + 1) + 75);
      const keywordMatches = ['React', 'JavaScript', 'Node.js'];
      const suggestions = [
        'Add more details to your project descriptions',
        'Quantify your achievements with numbers',
        'Tailor your skills section to match the job description'
      ];

      setOptimizationResults({ atsScore, keywordMatches, suggestions });
      toast.success('CV optimized with AI suggestions!');
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize CV with AI. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };

  const downloadOptimizedPDF = async () => {
    try {
      toast.info('Generating optimized PDF... This may take a moment.');
      
      // Mock resume data for PDF generation
      const resumeData: ResumeData = parseResumeData(editedText);
      
      // Add job description for ATS optimization
      const resumeDataWithJob = {
        ...resumeData,
        jobDescription: jobDescription
      };
      
      const filename = 'optimized_resume.pdf';
      await PDFGenerator.generateTextPDF(resumeDataWithJob, selectedTemplate, filename);
      
      toast.success('Optimized PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download optimized PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CV Optimizer Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Upload, optimize, and download your professional resume with AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Upload and Edit Section */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  CV Upload & Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="edit" className="flex items-center gap-2" disabled={!extractedText}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="optimize" className="flex items-center gap-2" disabled={!extractedText}>
                      <Sparkles className="w-4 h-4" />
                      Optimize
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                        isDragActive 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Drop your CV here or click to browse
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Supports PDF, DOC, DOCX, and TXT files
                          </p>
                        </div>
                      </div>
                    </div>

                    {uploadedFile && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="edit" className="space-y-4">
                    {extractedText && (
                      <div>
                        <Label htmlFor="cv-editor" className="text-base font-semibold mb-3 block">
                          Edit Your CV Content
                        </Label>
                        <RichTextEditor
                          value={editedText}
                          onChange={setEditedText}
                          placeholder="Your CV content will appear here for editing..."
                          className="min-h-[400px]"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="optimize" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job-description" className="text-base font-semibold mb-3 block">
                          Job Description (Optional)
                        </Label>
                        <Textarea
                          id="job-description"
                          placeholder="Paste the job description here for ATS optimization..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="template-select" className="text-base font-semibold mb-3 block">
                          Select Template
                        </Label>
                        <Select value={selectedTemplate.toString()} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Modern Professional</SelectItem>
                            <SelectItem value="1">Executive Leadership</SelectItem>
                            <SelectItem value="2">Creative Designer</SelectItem>
                            <SelectItem value="3">Tech Specialist</SelectItem>
                            <SelectItem value="4">Minimalist Clean</SelectItem>
                            <SelectItem value="5">Corporate Classic</SelectItem>
                            <SelectItem value="6">Professional Blue</SelectItem>
                            <SelectItem value="7">Legal Professional</SelectItem>
                            <SelectItem value="8">Engineering Focus</SelectItem>
                            <SelectItem value="9">Data Specialist</SelectItem>
                            <SelectItem value="10">Supply Chain Manager</SelectItem>
                            <SelectItem value="11">Clean Modern</SelectItem>
                            <SelectItem value="12">Marketing Creative</SelectItem>
                            <SelectItem value="13">Academic Scholar</SelectItem>
                            <SelectItem value="14">Sales Champion</SelectItem>
                            <SelectItem value="15">Consulting Elite</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="mt-4 space-y-3">
                          <Button 
                            onClick={optimizeWithAI} 
                            disabled={!extractedText || optimizing}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            {optimizing ? (
                              <>
                                <Zap className="w-4 h-4 mr-2 animate-spin" />
                                Optimizing with AI...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Optimize with AI
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            onClick={downloadOptimizedPDF} 
                            disabled={!extractedText}
                            variant="outline"
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Optimized PDF
                          </Button>
                        </div>
                      </div>
                    </div>

                    {optimizationResults && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI Optimization Results
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {optimizationResults.atsScore}%
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">ATS Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {optimizationResults.keywordMatches?.length || 0}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">Keywords Matched</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {optimizationResults.suggestions?.length || 0}
                            </div>
                            <div className="text-sm text-orange-700 dark:text-orange-300">Improvements</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6 shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Template {selectedTemplate + 1}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 dark:bg-gray-800 p-4">
                  {extractedText ? (
                    <div className="transform scale-75 origin-top-left w-[133%] h-auto">
                      <ImprovedResumePreview 
                        data={parseResumeData(editedText)}
                        template={selectedTemplate}
                        scale={1}
                      />
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Upload your CV to see the preview
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUploader;
