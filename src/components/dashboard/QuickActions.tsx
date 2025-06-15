
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Mail, Upload, Brain } from 'lucide-react';

interface QuickActionsProps {
  createNewResume: () => void;
  createNewCoverLetter: () => void;
  setShowCVUploader: (show: boolean) => void;
  setCurrentView: (view: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  createNewResume,
  createNewCoverLetter,
  setShowCVUploader,
  setCurrentView
}) => {
  const actions = [
    {
      title: 'Create Resume',
      description: 'Build professional resumes with AI',
      icon: Plus,
      action: createNewResume,
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      shadowColor: 'dark:shadow-blue-950/20',
      textColor: 'text-blue-900 dark:text-blue-100',
      descColor: 'text-blue-700 dark:text-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500',
      buttonText: 'New'
    },
    {
      title: 'Cover Letter',
      description: 'Write compelling cover letters',
      icon: Mail,
      action: createNewCoverLetter,
      bgColor: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800/50',
      shadowColor: 'dark:shadow-green-950/20',
      textColor: 'text-green-900 dark:text-green-100',
      descColor: 'text-green-700 dark:text-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500',
      buttonText: 'New'
    },
    {
      title: 'CV Upload & Editor',
      description: 'AI-powered CV extraction & editing',
      icon: Upload,
      action: () => setShowCVUploader(true),
      bgColor: 'from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-800/50',
      shadowColor: 'dark:shadow-orange-950/20',
      textColor: 'text-orange-900 dark:text-orange-100',
      descColor: 'text-orange-700 dark:text-orange-200',
      buttonColor: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500',
      buttonText: 'Upload'
    },
    {
      title: 'ATS Checker',
      description: 'AI-powered ATS analysis',
      icon: Brain,
      action: () => setCurrentView('ats'),
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800/50',
      shadowColor: 'dark:shadow-purple-950/20',
      textColor: 'text-purple-900 dark:text-purple-100',
      descColor: 'text-purple-700 dark:text-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500',
      buttonText: 'Check'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {actions.map((action, index) => (
        <Card key={index} className={`p-3 sm:p-4 lg:p-6 bg-gradient-to-br ${action.bgColor} ${action.borderColor} shadow-lg ${action.shadowColor}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm sm:text-base lg:text-lg font-semibold ${action.textColor} mb-1 sm:mb-2 truncate`}>
                {action.title}
              </h3>
              <p className={`${action.descColor} text-xs sm:text-sm lg:text-base line-clamp-2`}>
                {action.description}
              </p>
            </div>
            <Button onClick={action.action} size="sm" className={`${action.buttonColor} text-white shadow-md text-xs sm:text-sm shrink-0`}>
              <action.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{action.buttonText}</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
