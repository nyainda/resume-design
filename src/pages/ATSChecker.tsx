
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Zap, Brain, Target } from 'lucide-react';
import ATSAnalyzer from '@/components/ATSAnalyzer';
import { toast } from 'sonner';

const ATSChecker: React.FC = () => {
  const [resumeData, setResumeData] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('text')) {
      toast.error('Please upload a PDF or text file');
      return;
    }

    setIsUploading(true);
    try {
      // For demo purposes, create sample resume data
      // In a real implementation, you'd parse the uploaded file
      const sampleData = {
        personal: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          summary: 'Experienced software engineer with 5+ years in full-stack development'
        },
        experience: [
          {
            id: 1,
            company: 'Tech Corp',
            position: 'Senior Developer',
            location: 'New York, NY',
            startDate: '2020-01',
            endDate: 'Present',
            description: '• Led development of 3 major features\n• Improved performance by 40%\n• Managed team of 4 developers'
          }
        ],
        education: [
          {
            id: 1,
            school: 'University of Technology',
            degree: 'Bachelor of Computer Science',
            location: 'New York, NY',
            startDate: '2016-09',
            endDate: '2020-05',
            gpa: '3.8'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git'],
        projects: [],
        certifications: [],
        languages: [],
        interests: [],
        references: []
      };

      setResumeData(sampleData);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error('Failed to process resume file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSampleResume = () => {
    const sampleData = {
      personal: {
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        summary: 'Results-driven marketing professional with 7+ years of experience in digital marketing, brand management, and data analytics. Proven track record of increasing revenue by 35% through strategic campaigns.'
      },
      experience: [
        {
          id: 1,
          company: 'Digital Marketing Agency',
          position: 'Senior Marketing Manager',
          location: 'San Francisco, CA',
          startDate: '2020-03',
          endDate: 'Present',
          description: '• Managed $2M annual marketing budget across 15+ campaigns\n• Increased lead generation by 45% through SEO and content optimization\n• Led cross-functional team of 8 marketing specialists\n• Implemented data-driven strategies resulting in 35% revenue growth'
        },
        {
          id: 2,
          company: 'StartupXYZ',
          position: 'Marketing Coordinator',
          location: 'San Francisco, CA',
          startDate: '2018-06',
          endDate: '2020-02',
          description: '• Developed and executed social media strategy reaching 100K+ followers\n• Created content calendar and managed 5 social platforms\n• Analyzed campaign performance using Google Analytics and HubSpot'
        }
      ],
      education: [
        {
          id: 1,
          school: 'UC Berkeley',
          degree: 'Bachelor of Business Administration',
          location: 'Berkeley, CA',
          startDate: '2014-09',
          endDate: '2018-05',
          gpa: '3.7'
        }
      ],
      skills: [
        'Digital Marketing', 'SEO/SEM', 'Google Analytics', 'HubSpot', 'Social Media Marketing',
        'Content Strategy', 'Data Analysis', 'A/B Testing', 'Email Marketing', 'PPC Campaigns',
        'Brand Management', 'Project Management', 'Team Leadership'
      ],
      projects: [
        {
          id: 1,
          name: 'Brand Refresh Campaign',
          description: 'Led complete brand overhaul resulting in 50% increase in brand recognition',
          technologies: 'Adobe Creative Suite, Figma, Market Research',
          link: '',
          startDate: '2021-01',
          endDate: '2021-06'
        }
      ],
      certifications: [
        {
          id: 1,
          name: 'Google Analytics Certified',
          issuer: 'Google',
          date: '2021-03',
          credentialId: 'GA-12345'
        },
        {
          id: 2,
          name: 'HubSpot Content Marketing',
          issuer: 'HubSpot',
          date: '2020-11',
          credentialId: 'HUB-67890'
        }
      ],
      languages: [
        {
          id: 1,
          language: 'English',
          proficiency: 'Native'
        },
        {
          id: 2,
          language: 'Spanish',
          proficiency: 'Conversational'
        }
      ],
      interests: ['Digital Innovation', 'Data Visualization', 'Travel Photography'],
      references: []
    };

    setResumeData(sampleData);
    toast.success('Sample resume loaded for analysis!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            AI-Powered ATS Resume Checker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Analyze your resume for ATS compatibility and get AI-powered optimization suggestions
          </p>
        </div>

        {!resumeData ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Upload Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Drop your resume here or click to upload
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Supports PDF and text files
                      </p>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">or</span>
                  </div>

                  <Button
                    onClick={handleSampleResume}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Try with Sample Resume
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Description (Optional)
                    </label>
                    <Textarea
                      placeholder="Paste the job description here to get targeted ATS analysis and keyword matching..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Adding a job description helps with keyword analysis and ATS optimization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resume Info Card */}
            <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {resumeData.personal.fullName || 'Resume Loaded'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ready for ATS analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Ready
                    </Badge>
                    <Button
                      onClick={() => setResumeData(null)}
                      variant="outline"
                      size="sm"
                    >
                      Upload Different Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description Input */}
            <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Job Description Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here for targeted analysis and keyword matching..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px]"
                />
                {jobDescription && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">
                      {jobDescription.split(' ').length} words analyzed
                    </Badge>
                    <Badge variant="outline">
                      Keyword matching enabled
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ATS Analyzer Component */}
            <ATSAnalyzer 
              resumeData={resumeData}
              jobDescription={jobDescription}
              onOptimizationApplied={(optimizedData) => {
                setResumeData(optimizedData);
                toast.success('Optimization applied to resume!');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
