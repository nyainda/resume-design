
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Brain, Sparkles, Target, Code2, Upload, ScanLine, Wand2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface BuilderHeaderProps {
  saving: boolean;
  importingProfile: boolean;
  onUploadCV: () => void;
  onImportProfile: () => void;
  onJobScan: () => void;
  onJobParse: () => void;
  onTemplateSelect: () => void;
  onAIOptimize: () => void;
  onDownloadPDF: () => void;
  onSave: () => void;
}

const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  saving,
  importingProfile,
  onUploadCV,
  onImportProfile,
  onJobScan,
  onJobParse,
  onTemplateSelect,
  onAIOptimize,
  onDownloadPDF,
  onSave
}) => {
  const navigate = useNavigate();
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);

  const handleAdvancedAIOptimize = () => {
    setShowAdvancedAI(!showAdvancedAI);
    if (!showAdvancedAI) {
      toast.success('🚀 Advanced AI features activated! Use the AI buttons in each section to enhance your resume with targeted content.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Header with AI Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          {/* Back to Dashboard Button */}
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

          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Resume Builder
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create your professional resume with AI assistance
            </p>
          </div>
          {showAdvancedAI && (
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Enhancement Button - Enhanced */}
          <Button
            onClick={handleAdvancedAIOptimize}
            disabled={saving}
            variant={showAdvancedAI ? "default" : "outline"}
            size="sm"
            className={showAdvancedAI ? 
              "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg" :
              "border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300"
            }
          >
            <Brain className="w-4 h-4 mr-1" />
            AI Enhancement
            {showAdvancedAI && <Sparkles className="w-3 h-3 ml-1" />}
          </Button>

          {/* Enhanced Job Parse Button */}
          <Button
            onClick={onJobParse}
            variant="outline"
            size="sm"
            className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300"
          >
            <Target className="w-4 h-4 mr-1" />
            Job Parser
          </Button>

          {/* Import Profile Button */}
          <Button
            onClick={onImportProfile}
            disabled={importingProfile}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
          >
            <ScanLine className="w-4 h-4 mr-1" />
            Import Profile
          </Button>

          {/* Upload CV Button */}
          <Button
            onClick={onUploadCV}
            variant="outline"
            size="sm"
            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-300"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload CV
          </Button>

          {/* Job Scanner Button */}
          <Button
            onClick={onJobScan}
            variant="outline"
            size="sm"
            className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300"
          >
            <Target className="w-4 h-4 mr-1" />
            Job Scanner
          </Button>

          {/* Template Select Button */}
          <Button onClick={onTemplateSelect} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            Templates
          </Button>

          {/* Save Button */}
          <Button onClick={onSave} disabled={saving} className="flex items-center gap-2">
            {saving ? 'Saving...' : 'Save'}
          </Button>

          {/* Download PDF Button */}
          <Button onClick={onDownloadPDF} variant="outline" size="sm">
            Download PDF
          </Button>
        </div>
      </div>

      {/* Advanced AI Notice */}
      {showAdvancedAI && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-300">
              AI-Powered Resume Enhancement Active
            </h3>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
            Enhanced AI features are now available in each section. Look for the AI buttons to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded border">
              <Wand2 className="w-4 h-4 text-blue-600" />
              <span>Generate targeted summaries from job descriptions</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded border">
              <Target className="w-4 h-4 text-green-600" />
              <span>Create relevant experience entries</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded border">
              <Code2 className="w-4 h-4 text-purple-600" />
              <span>Generate projects matching job requirements</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderHeader;
