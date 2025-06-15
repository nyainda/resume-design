
import React from 'react';
import EnhancedTemplateSelector from '@/components/EnhancedTemplateSelector';
import EnhancedJobDescriptionParser from '@/components/EnhancedJobDescriptionParser';
import JobScanner from '@/components/JobScanner';
import CVReaderEnhanced from '@/components/enhanced-forms/CVReaderEnhanced';
import { toast } from 'sonner';

interface ModalsProps {
  showTemplateSelector: boolean;
  showJobParser: boolean;
  showJobScanner: boolean;
  showCVParser: boolean;
  selectedTemplate: number;
  onCloseTemplateSelector: () => void;
  onCloseJobParser: () => void;
  onCloseJobScanner: () => void;
  onCloseCVParser: () => void;
  onSelectTemplate: (template: number) => void;
  onJobDescriptionParsed: (data: any) => void;
  onCVDataExtracted: (data: any) => void;
}

const Modals: React.FC<ModalsProps> = ({
  showTemplateSelector,
  showJobParser,
  showJobScanner,
  showCVParser,
  selectedTemplate,
  onCloseTemplateSelector,
  onCloseJobParser,
  onCloseJobScanner,
  onCloseCVParser,
  onSelectTemplate,
  onJobDescriptionParsed,
  onCVDataExtracted
}) => {
  return (
    <>
      {showTemplateSelector && (
        <EnhancedTemplateSelector
          isOpen={showTemplateSelector}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={onSelectTemplate}
          onClose={onCloseTemplateSelector}
        />
      )}

      {showJobParser && (
        <EnhancedJobDescriptionParser
          isOpen={showJobParser}
          onClose={onCloseJobParser}
          onParsed={onJobDescriptionParsed}
        />
      )}

      {showJobScanner && (
        <JobScanner
          isOpen={showJobScanner}
          onClose={onCloseJobScanner}
          onJobSelected={(job) => {
            toast.success('Job requirements applied to resume!');
            onCloseJobScanner();
          }}
        />
      )}

      {showCVParser && (
        <CVReaderEnhanced
          onDataExtracted={onCVDataExtracted}
          onClose={onCloseCVParser}
        />
      )}
    </>
  );
};

export default Modals;
