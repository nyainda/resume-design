import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import components
import BuilderHeader from '@/components/builder/BuilderHeader';
import FormSection from '@/components/builder/FormSection';
import PreviewSection from '@/components/builder/PreviewSection';
import Modals from '@/components/builder/Modals';
import JobDescriptionEmbedder from '@/components/JobDescriptionEmbedder';
import ComingSoonFeatures from '@/components/ComingSoonFeatures';
import LiveFeatures from '@/components/LiveFeatures';
import PDFGenerator from '@/components/PDFGenerator';
import { ProfileIntegrationService } from '@/services/profileIntegration';
import { useAPIKey } from '@/hooks/useAPIKey';

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
  references: Array<{
    id: number;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

const Builder: React.FC = () => {
  const { user } = useAuth();
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
    projects: [],
    references: []
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
  const [previewScale] = useState(0.3);
  const [showCVParser, setShowCVParser] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  // Make sure activeTab state change is properly handled
  const handleTabChange = (newTab: string) => {
    console.log('Builder: Tab changing to', newTab);
    setActiveTab(newTab);
  };

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
          projects: Array.isArray(resume.projects) ? resume.projects as ResumeData['projects'] : [],
          references: Array.isArray(resume.references) ? resume.references as ResumeData['references'] : []
        });
      }
    } catch (error: any) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume data');
    }
  };

  const saveResumeData = async () => {
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
        references: resumeData.references,
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

  const updateExperience = (data: any[]) => {
    const formattedData = data.map(exp => ({
      ...exp,
      description: exp.description ? formatWithBullets(exp.description) : ''
    }));
    setResumeData(prev => ({ ...prev, experience: formattedData }));
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

  const updateReferences = (data: any[]) => {
    setResumeData(prev => ({ ...prev, references: data }));
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
        projects: [...prev.projects, ...mergedData.projects],
        references: [...prev.references, ...(mergedData.references || [])]
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
    setResumeData(prev => ({
      personal: { 
        ...prev.personal, 
        ...extractedData.personal,
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
      projects: [...prev.projects, ...extractedData.projects],
      references: [...prev.references, ...(extractedData.references || [])]
    }));
    
    setActiveTab('personal');
    toast.success('CV data successfully imported! Review and edit as needed.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">Please sign in to use the resume builder.</p>
          <Button onClick={() => window.location.href = '/auth'} className="w-full">Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 max-w-7xl">
        
        {/* Enhanced Header */}
        <div className="mb-4 sm:mb-6">
          <BuilderHeader
            saving={saving}
            importingProfile={importingProfile}
            onUploadCV={() => setShowCVParser(true)}
            onImportProfile={handleImportFromProfile}
            onJobScan={() => setShowJobScanner(true)}
            onJobParse={() => setShowJobParser(true)}
            onTemplateSelect={() => setShowTemplateSelector(true)}
            onAIOptimize={handleAIOptimize}
            onDownloadPDF={handleDownloadPDF}
            onSave={saveResumeData}
          />
        </div>

        {/* Job Description Embedder */}
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

        {/* Live Features Section */}
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

        {/* Main Content - Improved Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Form Section - Takes more space on larger screens */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            <FormSection
              resumeData={resumeData}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onPersonalInfoChange={updatePersonalInfo}
              onExperienceChange={updateExperience}
              onEducationChange={updateEducation}
              onSkillsChange={updateSkills}
              onProjectsChange={updateProjects}
              onCertificationsChange={updateCertifications}
              onLanguagesChange={updateLanguages}
              onInterestsChange={updateInterests}
              onReferencesChange={updateReferences}
            />
          </div>

          {/* Preview Section - Optimized spacing */}
          <div className="xl:col-span-2 order-first xl:order-last">
            <div className="sticky top-3 sm:top-6">
              <PreviewSection
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                previewScale={previewScale}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modals
        showTemplateSelector={showTemplateSelector}
        showJobParser={showJobParser}
        showJobScanner={showJobScanner}
        showCVParser={showCVParser}
        selectedTemplate={selectedTemplate}
        onCloseTemplateSelector={() => setShowTemplateSelector(false)}
        onCloseJobParser={() => setShowJobParser(false)}
        onCloseJobScanner={() => setShowJobScanner(false)}
        onCloseCVParser={() => setShowCVParser(false)}
        onSelectTemplate={setSelectedTemplate}
        onJobDescriptionParsed={handleJobDescriptionParsed}
        onCVDataExtracted={handleCVDataExtracted}
      />
    </div>
  );
};

export default Builder;
