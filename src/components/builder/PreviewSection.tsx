
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';

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
  skills: string[] | Array<{ name: string; level: string; category: string }>;
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

interface PreviewSectionProps {
  resumeData: ResumeData;
  selectedTemplate: number;
  previewScale: number;
}

interface PreviewSectionProps {
  resumeData: ResumeData;
  selectedTemplate: number;
  previewScale: number;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  resumeData,
  selectedTemplate,
  previewScale
}) => {
  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl w-full">
      <CardHeader className="pb-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-xs sm:text-sm text-gray-900 dark:text-white">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            Live Preview
          </CardTitle>
          
          <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 self-start sm:self-auto">
            Template {selectedTemplate + 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-gray-50 dark:bg-gray-900 p-1 rounded-b-lg">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
            <div className="transform-gpu">
              <ImprovedResumePreview 
                data={resumeData} 
                template={selectedTemplate}
                scale={previewScale}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
