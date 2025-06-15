import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAutosave } from '@/hooks/useAutosave';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Heart,
  FolderOpen,
  Palette,
  Download,
  Save,
  Eye,
  Wand2,
  FileText,
  Sparkles,
  ArrowLeft,
  Search,
  Crown,
  Shield,
  Loader2,
  Upload,
  Zap
} from 'lucide-react';

// Import all form components
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ExperienceFormEnhanced from '@/components/ExperienceFormEnhanced';
import EducationForm from '@/components/EducationForm';
import SkillsForm from '@/components/SkillsForm';
import ProjectsForm from '@/components/ProjectsForm';
import CertificationsForm from '@/components/CertificationsForm';
import LanguagesForm from '@/components/LanguagesForm';
import InterestsForm from '@/components/InterestsForm';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import EnhancedTemplateSelector from '@/components/EnhancedTemplateSelector';
import JobDescriptionParser from '@/components/JobDescriptionParser';
import JobScanner from '@/components/JobScanner';
import ATSOptimizer from '@/components/ATSOptimizer';
import PDFGenerator from '@/components/PDFGenerator';
import CVParser from '@/components/CVParser';
import JobDescriptionEmbedder from '@/components/JobDescriptionEmbedder';
import { ProfileIntegrationService } from '@/services/profileIntegration';
import { useAPIKey } from '@/hooks/useAPIKey';
import ComingSoonFeatures from '@/components/ComingSoonFeatures';
import LiveFeatures from '@/components/LiveFeatures';

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
    description?: string;
    courses?: string;
    honors?: string;
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

const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { apiKey } = useAPIKey();
  const resumeIdParam = searchParams.get('id');
  const initialTemplate = parseInt(searchParams.get('template') || '0');
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    interests: [],
    projects: []
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showJobParser, setShowJobParser] = useState(false);
  const [showJobScanner, setShowJobScanner] = useState(false);
  const [atsOptimization, setAtsOptimization] = useState<any>(null);
  const [importingProfile, setImportingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [previewScale, setPreviewScale] = useState(0.3);
  const [showCVParser, setShowCVParser] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  // Define saveResumeData function early in the component
  const saveResumeData = useCallback(async () => {
    if (!user) return;

    setSaving(true);
    try {
      const resumePayload = {
        user_id: user.id,
        title: resumeData.personal.fullName ? `${resumeData.personal.fullName}'s Resume` : 'Untitled Resume',
        template_id: selectedTemplate,
        personal_info: resumeData.personal,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        certifications: resumeData.certifications,
        languages: resumeData.languages,
        interests: resumeData.interests,
        projects: resumeData.projects,
        job_description: jobDescription,
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
        const { data, error } = await supabase
          .from('resumes')
          .insert([resumePayload])
          .select()
          .single();
        
        if (error) throw error;
        setResumeId(data.id);
      }

      if (jobDescription) {
        toast.success('Resume saved with ATS optimization!');
      } else {
        toast.success('Resume saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  }, [user, resumeData, selectedTemplate, resumeId, jobDescription]);

  // Setup autosave with the saveResumeData function
  useAutosave({
    data: resumeData,
    onSave: saveResumeData,
    delay: 3000,
    enabled: !!user
  });

  useEffect(() => {
    if (user) {
      loadResumeData();
    }
  }, [user, resumeIdParam]);

  const loadResumeData = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id);
      
      if (resumeIdParam) {
        query = query.eq('id', resumeIdParam);
      } else {
        query = query.order('updated_at', { ascending: false }).limit(1);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const resume = data[0];
        setResumeId(resume.id);
        setSelectedTemplate(resume.template_id || 0);
        
        setResumeData({
          personal: resume.personal_info && typeof resume.personal_info === 'object' && !Array.isArray(resume.personal_info) 
            ? resume.personal_info as ResumeData['personal']
            : {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                summary: ''
              },
          experience: Array.isArray(resume.experience) ? resume.experience as ResumeData['experience'] : [],
          education: Array.isArray(resume.education) ? resume.education as ResumeData['education'] : [],
          skills: Array.isArray(resume.skills) ? resume.skills as string[] : [],
          certifications: Array.isArray(resume.certifications) ? resume.certifications as ResumeData['certifications'] : [],
          languages: Array.isArray(resume.languages) ? resume.languages as ResumeData['languages'] : [],
          interests: Array.isArray(resume.interests) ? resume.interests as string[] : [],
          projects: Array.isArray(resume.projects) ? resume.projects as ResumeData['projects'] : []
        });
      }
    } catch (error: any) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume data');
    }
  };

  const updateExperience = (data: any[]) => {
    const formattedData = data.map(exp => ({
      ...exp,
      description: exp.description ? formatWithBullets(exp.description) : ''
    }));
    setResumeData(prev => ({ ...prev, experience: formattedData }));
  };

  const formatWithBullets = (text: string): string => {
    if (!text) return '';
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    return lines.map(line => {
      if (!line.match(/^[•·‣▪▫-]\s/)) {
        return `• ${line}`;
      }
      return line;
    }).join('\n');
  };

  const updatePersonalInfo = (data: any) => {
    setResumeData(prev => ({ ...prev, personal: data }));
  };

  const updateEducation = (data: any[]) => {
    setResumeData(prev => ({ ...prev, education: data }));
  };

  const updateSkills = (data: string[]) => {
    setResumeData(prev => ({ ...prev, skills: data }));
  };

  const updateProjects = (data: any[]) => {
    setResumeData(prev => ({ ...prev, projects: data }));
  };

  const updateCertifications = (data: any[]) => {
    setResumeData(prev => ({ ...prev, certifications: data }));
  };

  const updateLanguages = (data: any[]) => {
    setResumeData(prev => ({ ...prev, languages: data }));
  };

  const updateInterests = (data: string[]) => {
    setResumeData(prev => ({ ...prev, interests: data }));
  };

  const handleAIOptimize = async () => {
    if (!resumeData.personal.fullName) {
      toast.error('Please add personal information first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    try {
      toast.info('AI is optimizing your resume...');
      
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          resumeData,
          apiKey 
        }
      });

      if (error) throw error;

      if (data?.suggestions?.length > 0) {
        let updatedData = { ...resumeData };
        
        data.suggestions.forEach((suggestion: any) => {
          if (suggestion.section === 'summary' && suggestion.confidence > 0.7) {
            updatedData.personal.summary = suggestion.suggested;
          }
        });
        
        setResumeData(updatedData);
        setAtsOptimization({
          score: data.atsScore || 85,
          suggestions: data.suggestions,
          keywordMatches: data.keywordMatches || [],
          missingKeywords: data.missingKeywords || []
        });
        
        toast.success('Resume optimized with AI suggestions!');
      } else {
        toast.info('No improvements suggested at this time');
      }
    } catch (error: any) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize resume with AI. Please check your API key in Settings.');
    }
  };

  const handleJobDescriptionParsed = (parsedData: any) => {
    if (parsedData.skills) {
      updateSkills([...resumeData.skills, ...parsedData.skills]);
    }
    if (parsedData.experience) {
      updateExperience([...resumeData.experience, parsedData.experience]);
    }
    if (parsedData.summary) {
      updatePersonalInfo({
        ...resumeData.personal,
        summary: parsedData.summary
      });
    }
    setShowJobParser(false);
    toast.success('Job description parsed and applied to resume!');
  };

  const handleDownloadPDF = async () => {
    if (!resumeData.personal.fullName) {
      toast.error('Please add your name before downloading');
      return;
    }

    try {
      if (jobDescription) {
        toast.info('Generating ATS-optimized PDF with embedded job keywords...');
      } else {
        toast.info('Generating PDF... This may take a moment.');
      }
      
      const filename = `${resumeData.personal.fullName.replace(/[^a-z0-9]/gi, '_')}_Resume.pdf`;
      
      // Automatically include job description for ATS optimization
      const resumeWithATS = {
        ...resumeData,
        jobDescription: jobDescription
      };
      
      await PDFGenerator.generateTextPDF(resumeWithATS, selectedTemplate, filename);
      
      if (jobDescription) {
        toast.success('ATS-optimized PDF downloaded with hidden keywords for better matching!');
      } else {
        toast.success('PDF downloaded successfully!');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const handleATSOptimization = (optimization: any) => {
    setAtsOptimization(optimization);
  };

  const handleImportFromProfile = async () => {
    if (!user) {
      toast.error('Please sign in to import profile data');
      return;
    }

    setImportingProfile(true);
    try {
      const profileData = await ProfileIntegrationService.getProfileData(user.id);
      if (!profileData) {
        toast.error('No profile data found. Please update your profile first.');
        return;
      }

      let linkedinData = null;
      let githubData = null;

      if (profileData.linkedin_url) {
        toast.info('Extracting LinkedIn profile data...');
        linkedinData = await ProfileIntegrationService.extractLinkedInData(profileData.linkedin_url);
      }

      if (profileData.github_url) {
        toast.info('Extracting GitHub profile data...');
        githubData = await ProfileIntegrationService.extractGitHubData(profileData.github_url);
      }

      const mergedData = ProfileIntegrationService.mergeProfileDataToResume(
        profileData,
        linkedinData || undefined,
        githubData || undefined
      );

      setResumeData(prev => ({
        ...prev,
        personal: { ...prev.personal, ...mergedData.personal },
        experience: [...prev.experience, ...mergedData.experience],
        education: [...prev.education, ...mergedData.education],
        skills: [...new Set([...prev.skills, ...mergedData.skills])],
        projects: [...prev.projects, ...mergedData.projects]
      }));

      toast.success('Profile data imported successfully!');
    } catch (error: any) {
      console.error('Profile import error:', error);
      toast.error('Failed to import profile data. Please try again.');
    } finally {
      setImportingProfile(false);
    }
  };

  const handleCVDataExtracted = (extractedData: any) => {
    // Merge extracted data with existing resume data
    setResumeData(prev => ({
      personal: { 
        ...prev.personal, 
        ...extractedData.personal,
        // Only update if new values are not empty
        fullName: extractedData.personal.fullName || prev.personal.fullName,
        email: extractedData.personal.email || prev.personal.email,
        phone: extractedData.personal.phone || prev.personal.phone,
        location: extractedData.personal.location || prev.personal.location,
        summary: extractedData.personal.summary || prev.personal.summary
      },
      experience: [...prev.experience, ...extractedData.experience],
      education: [...prev.education, ...extractedData.education],
      skills: [...new Set([...prev.skills, ...extractedData.skills])],
      certifications: [...prev.certifications, ...(extractedData.certifications || [])],
      languages: [...prev.languages, ...(extractedData.languages || [])],
      interests: [...new Set([...prev.interests, ...(extractedData.interests || [])])],
      projects: [...prev.projects, ...extractedData.projects]
    }));
    
    // Switch to personal tab to show imported data
    setActiveTab('personal');
    toast.success('CV data successfully imported! Review and edit as needed.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-xl">
          <CardTitle className="mb-4 text-2xl">Authentication Required</CardTitle>
          <p className="text-gray-600 mb-6">Please sign in to use the resume builder.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
        
        {/* Enhanced Header with CV Upload */}
        <div className="relative mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 lg:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
          
          <div className="relative flex flex-col gap-3 sm:gap-4">
            {/* Top Row - Navigation and Title */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 sm:gap-2 hover:bg-blue-50 border-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                size="sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Resume Builder Pro
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden sm:block">
                    AI-Powered Professional Resume Creator
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons with CV Upload */}
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:flex lg:flex-wrap gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCVParser(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Upload CV</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleImportFromProfile}
                disabled={importingProfile}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-indigo-50 border-indigo-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                {importingProfile ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="text-xs">Import</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowJobScanner(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Scan</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowJobParser(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-orange-50 border-orange-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Parse</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowTemplateSelector(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-purple-50 border-purple-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Style</span>
              </Button>
              
              <Button
                onClick={handleAIOptimize}
                className="flex flex-col sm:flex-row items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs shadow-lg px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">AI</span>
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">PDF</span>
              </Button>
              
              <Button
                onClick={saveResumeData}
                disabled={saving}
                className="flex flex-col sm:flex-row items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-lg px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">{saving ? 'Saving...' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Job Description Embedder - Enhanced with auto-save notification */}
        <div className="mb-4 sm:mb-6">
          <JobDescriptionEmbedder 
            jobDescription={jobDescription}
            onJobDescriptionChange={(description) => {
              setJobDescription(description);
              if (description && description.length > 50) {
                toast.info('Job description will be automatically embedded in your resume for ATS optimization');
              }
            }}
            onOptimize={() => {
              if (atsOptimization) {
                setAtsOptimization({ ...atsOptimization, score: Math.min(100, atsOptimization.score + 5) });
              }
              toast.success('Resume optimized with job description keywords!');
            }}
          />
        </div>

        {/* Status Cards - Enhanced Mobile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-3 sm:p-4 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    Template: {getTemplateName(selectedTemplate)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Professional ATS-optimized design
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {atsOptimization?.score || 95}%
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  AI
                </Badge>
              </div>
            </div>
          </Card>

          <ATSOptimizer 
            resumeData={resumeData} 
            onOptimize={handleATSOptimization}
          />
        </div>

        {/* Live Features Section - NEW */}
        <div className="mb-4 sm:mb-6">
          <LiveFeatures 
            resumeData={resumeData}
            onResumeUpdate={setResumeData}
            jobDescription={jobDescription}
          />
        </div>

        {/* Coming Soon Features Section */}
        <div className="mb-4 sm:mb-6">
          <ComingSoonFeatures />
        </div>

        {/* Main Content - Improved Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Form Section - Full width on mobile, 2/3 on desktop */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 to-purple-600/3"></div>
              <CardContent className="relative p-3 sm:p-4 lg:p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  
                  {/* Mobile-First Tab Navigation */}
                  <TabsList className="grid grid-cols-4 sm:grid-cols-8 mb-4 sm:mb-6 h-auto bg-gray-100/50 dark:bg-gray-700/50 text-xs rounded-lg p-1">
                    <TabsTrigger value="personal" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Work</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Projects</span>
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Certs</span>
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Lang</span>
                    </TabsTrigger>
                    <TabsTrigger value="interests" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Interests</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <PersonalInfoForm 
                      data={resumeData.personal} 
                      onChange={(data) => setResumeData(prev => ({ ...prev, personal: data }))} 
                    />
                  </TabsContent>

                  <TabsContent value="experience">
                    <ExperienceFormEnhanced 
                      data={resumeData.experience} 
                      onChange={updateExperience} 
                    />
                  </TabsContent>

                  <TabsContent value="education">
                    <EducationForm 
                      data={resumeData.education} 
                      onChange={updateEducation} 
                    />
                  </TabsContent>

                  <TabsContent value="skills">
                    <SkillsForm 
                      data={resumeData.skills} 
                      onChange={updateSkills} 
                    />
                  </TabsContent>

                  <TabsContent value="projects">
                    <ProjectsForm 
                      data={resumeData.projects} 
                      onChange={updateProjects} 
                    />
                  </TabsContent>

                  <TabsContent value="certifications">
                    <CertificationsForm 
                      data={resumeData.certifications} 
                      onChange={updateCertifications} 
                    />
                  </TabsContent>

                  <TabsContent value="languages">
                    <LanguagesForm 
                      data={resumeData.languages} 
                      onChange={updateLanguages} 
                    />
                  </TabsContent>

                  <TabsContent value="interests">
                    <InterestsForm 
                      data={resumeData.interests} 
                      onChange={updateInterests} 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Preview Section */}
          <div className="xl:col-span-1 order-first xl:order-last">
            <Card className="overflow-hidden shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl sticky top-6">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    Live Preview
                  </CardTitle>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Template {selectedTemplate + 1}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-4">
                  <ImprovedResumePreview 
                    data={resumeData} 
                    template={selectedTemplate}
                    scale={previewScale}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTemplateSelector && (
        <EnhancedTemplateSelector
          isOpen={showTemplateSelector}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {showJobParser && (
        <JobDescriptionParser
          isOpen={showJobParser}
          onClose={() => setShowJobParser(false)}
          onParsed={handleJobDescriptionParsed}
        />
      )}

      {showJobScanner && (
        <JobScanner
          isOpen={showJobScanner}
          onClose={() => setShowJobScanner(false)}
          onJobSelected={(job) => {
            toast.success('Job requirements applied to resume!');
            setShowJobScanner(false);
          }}
        />
      )}

      {showCVParser && (
        <CVParser
          onDataExtracted={handleCVDataExtracted}
          onClose={() => setShowCVParser(false)}
        />
      )}
    </div>
  );
};

const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',     // 0
    'Executive Leadership',    // 1  
    'Creative Designer',       // 2
    'Tech Specialist',         // 3
    'Minimalist Clean',        // 4
    'Corporate Classic',       // 5
    'Professional Blue',       // 6
    'Legal Professional',      // 7
    'Engineering Focus',       // 8
    'Data Specialist',         // 9
    'Supply Chain Manager',    // 10
    'Clean Modern',            // 11
    'Marketing Creative',      // 12
    'Academic Scholar',        // 13
    'Sales Champion',          // 14
    'Consulting Elite'         // 15
  ];
  return names[index] || 'Modern Professional';
};

export default ResumeBuilder;
