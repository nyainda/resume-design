
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import UserProfile from '@/components/UserProfile';
import NotificationsCenter from '@/components/NotificationsCenter';
import SettingsComponent from '@/components/Settings';
import JobMarket from '@/components/JobMarket';
import ResumeTrackingDashboard from '@/components/ResumeTrackingDashboard';
import ATSChecker from '@/pages/ATSChecker';
import CVUploadEditor from '@/components/CVUploadEditor';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MobileNavigation from '@/components/dashboard/MobileNavigation';
import QuickActions from '@/components/dashboard/QuickActions';
import DocumentsSection from '@/components/dashboard/DocumentsSection';

interface Resume {
  id: string;
  title: string;
  template_id: number;
  created_at: string;
  updated_at: string;
}

interface CoverLetter {
  id: string;
  title: string;
  company_name: string;
  position_title: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('resumes');
  const [currentView, setCurrentView] = useState('overview');
  const [showCVUploader, setShowCVUploader] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('id, title, template_id, created_at, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (resumesError) {
        console.error('Error loading resumes:', resumesError);
      }

      // Load cover letters
      const { data: coverLettersData, error: coverLettersError } = await (supabase as any)
        .from('cover_letters')
        .select('id, title, company_name, position_title, created_at, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (coverLettersError) {
        console.error('Error loading cover letters:', coverLettersError);
      }

      setResumes(resumesData || []);
      setCoverLetters(coverLettersData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user?.id,
          title: 'New Resume',
          personal_info: {},
          experience: [],
          education: [],
          skills: [],
          certifications: [],
          languages: [],
          interests: [],
          projects: []
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New resume created"
      });

      navigate(`/builder?id=${data.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast({
        title: "Error",
        description: "Failed to create resume",
        variant: "destructive"
      });
    }
  };

  const createNewCoverLetter = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('cover_letters')
        .insert([{
          user_id: user?.id,
          title: 'New Cover Letter',
          content: 'Your personalized cover letter content goes here...',
          company_name: '',
          position_title: ''
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New cover letter created"
      });

      navigate(`/cover-letter-builder?id=${data.id}`);
    } catch (error) {
      console.error('Error creating cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to create cover letter",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) throw error;

      setResumes(prev => prev.filter(r => r.id !== resumeId));
      toast({
        title: "Success",
        description: "Resume deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCoverLetter = async (coverLetterId: string) => {
    if (!user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('cover_letters')
        .delete()
        .eq('id', coverLetterId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCoverLetters(prev => prev.filter(cl => cl.id !== coverLetterId));
      toast({
        title: "Success",
        description: "Cover letter deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to delete cover letter",
        variant: "destructive"
      });
    }
  };

  const previewResume = (resume: Resume) => {
    window.open(`/builder?id=${resume.id}&preview=true`, '_blank');
  };

  const previewCoverLetter = (coverLetter: CoverLetter) => {
    window.open(`/cover-letter-builder?id=${coverLetter.id}&preview=true`, '_blank');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tracking':
        return <ResumeTrackingDashboard />;
      case 'ats':
        return <ATSChecker />;
      case 'profile':
        return <UserProfile />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'settings':
        return <SettingsComponent />;
      case 'jobs':
        return <JobMarket />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <QuickActions 
        createNewResume={createNewResume}
        createNewCoverLetter={createNewCoverLetter}
        setShowCVUploader={setShowCVUploader}
        setCurrentView={setCurrentView}
      />

      <DocumentsSection
        resumes={resumes}
        coverLetters={coverLetters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        createNewResume={createNewResume}
        createNewCoverLetter={createNewCoverLetter}
        handleDeleteResume={handleDeleteResume}
        handleDeleteCoverLetter={handleDeleteCoverLetter}
        previewResume={previewResume}
        previewCoverLetter={previewCoverLetter}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4">
        <Card className="p-6 sm:p-8 text-center shadow-2xl bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 w-full max-w-sm">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading your workspace...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
      <DashboardHeader 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <MobileNavigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
        {renderCurrentView()}
      </div>

      {showCVUploader && (
        <CVUploadEditor onClose={() => setShowCVUploader(false)} />
      )}
    </div>
  );
};

export default Dashboard;
