
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield, Sparkles } from 'lucide-react';
import ATSOptimizer from '@/components/ATSOptimizer';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: any[];
  education: any[];
  skills: string[];
  certifications: any[];
  languages: any[];
  interests: string[];
  projects: any[];
  references: any[];
}

interface StatusCardsProps {
  selectedTemplate: number;
  atsOptimization: any;
  resumeData: ResumeData;
  onOptimize: (optimization: any) => void;
}

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

const StatusCards: React.FC<StatusCardsProps> = ({
  selectedTemplate,
  atsOptimization,
  resumeData,
  onOptimize
}) => {
  return (
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
        onOptimize={onOptimize}
      />
    </div>
  );
};

export default StatusCards;
