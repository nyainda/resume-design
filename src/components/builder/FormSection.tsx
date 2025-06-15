
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

// Import working form components
import EducationForm from '@/components/EducationForm';
import EnhancedSkillsForm from '@/components/EnhancedSkillsForm';
import CertificationsFormEnhanced from '@/components/enhanced-forms/CertificationsFormEnhanced';
import LanguagesFormEnhanced from '@/components/enhanced-forms/LanguagesFormEnhanced';
import InterestsFormEnhanced from '@/components/enhanced-forms/InterestsFormEnhanced';
import ReferencesFormEnhanced from '@/components/enhanced-forms/ReferencesFormEnhanced';
import PersonalInfoFormEnhanced from '@/components/enhanced-forms/PersonalInfoFormEnhanced';
import ExperienceFormEnhanced from '@/components/enhanced-forms/ExperienceFormEnhanced';
import ProjectsFormEnhanced from '@/components/enhanced-forms/ProjectsFormEnhanced';

interface FormSectionProps {
  resumeData: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPersonalInfoChange: (data: any) => void;
  onExperienceChange: (data: any[]) => void;
  onEducationChange: (data: any[]) => void;
  onSkillsChange: (data: string[]) => void;
  onProjectsChange: (data: any[]) => void;
  onCertificationsChange: (data: any[]) => void;
  onLanguagesChange: (data: any[]) => void;
  onInterestsChange: (data: string[]) => void;
  onReferencesChange: (data: any[]) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  resumeData,
  activeTab,
  onTabChange,
  onPersonalInfoChange,
  onExperienceChange,
  onEducationChange,
  onSkillsChange,
  onProjectsChange,
  onCertificationsChange,
  onLanguagesChange,
  onInterestsChange,
  onReferencesChange
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoFormEnhanced
            data={resumeData.personal}
            onChange={onPersonalInfoChange}
          />
        );
      case 'experience':
        return (
          <ExperienceFormEnhanced
            data={resumeData.experience}
            onChange={onExperienceChange}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onChange={onEducationChange}
          />
        );
      case 'skills':
        return (
          <EnhancedSkillsForm
            data={resumeData.skills}
            onChange={onSkillsChange}
          />
        );
      case 'projects':
        return (
          <ProjectsFormEnhanced
            data={resumeData.projects}
            onChange={onProjectsChange}
          />
        );
      case 'certifications':
        return (
          <CertificationsFormEnhanced
            data={resumeData.certifications}
            onChange={onCertificationsChange}
          />
        );
      case 'languages':
        return (
          <LanguagesFormEnhanced
            data={resumeData.languages}
            onChange={onLanguagesChange}
          />
        );
      case 'interests':
        return (
          <InterestsFormEnhanced
            data={resumeData.interests}
            onChange={onInterestsChange}
          />
        );
      case 'references':
        return (
          <ReferencesFormEnhanced
            data={resumeData.references}
            onChange={onReferencesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="bg-white/80 dark:bg-gray-900/80 border rounded-lg shadow-sm flex flex-col sm:flex-row justify-between gap-2 h-auto p-2">
        <div className="flex flex-wrap justify-center sm:justify-start overflow-x-auto hide-scrollbar gap-1">
          <TabsTrigger 
            value="personal" 
            onClick={() => onTabChange('personal')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            onClick={() => onTabChange('experience')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Experience
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            onClick={() => onTabChange('education')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Education
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            onClick={() => onTabChange('skills')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Skills
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            onClick={() => onTabChange('projects')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="certifications" 
            onClick={() => onTabChange('certifications')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Certifications
          </TabsTrigger>
          <TabsTrigger 
            value="languages" 
            onClick={() => onTabChange('languages')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Languages
          </TabsTrigger>
          <TabsTrigger 
            value="interests" 
            onClick={() => onTabChange('interests')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Interests
          </TabsTrigger>
          <TabsTrigger 
            value="references" 
            onClick={() => onTabChange('references')} 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            References
          </TabsTrigger>
        </div>
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full self-center sm:self-auto">
          <Sparkles className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs">AI-Powered</span>
        </Badge>
      </TabsList>
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </Tabs>
  );
};

export default FormSection;
