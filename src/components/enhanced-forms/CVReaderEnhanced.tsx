
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle, Zap, Brain } from 'lucide-react';
import ImprovedCVProcessor from './ImprovedCVProcessor';

interface CVReaderEnhancedProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVReaderEnhanced: React.FC<CVReaderEnhancedProps> = ({ onDataExtracted, onClose }) => {
  const [showProcessor, setShowProcessor] = useState(false);

  if (showProcessor) {
    return (
      <ImprovedCVProcessor
        onDataExtracted={onDataExtracted}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            AI-Powered CV Processor
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Extract, enhance, and edit your CV data with advanced AI technology
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-300">AI Analysis</h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">Smart content extraction</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-300">Live Preview</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">See changes in real-time</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Zap className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-green-900 dark:text-green-300">Auto Enhancement</h4>
              <p className="text-xs text-green-700 dark:text-green-400">AI-powered improvements</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-1">Enhanced Features:</h4>
                <ul className="text-purple-800 dark:text-purple-400 space-y-1">
                  <li>• Background processing with real-time progress tracking</li>
                  <li>• AI-powered content enhancement and formatting</li>
                  <li>• Live editable template with instant preview</li>
                  <li>• Support for PDF, DOC, DOCX, and TXT files</li>
                  <li>• Smart data validation and error handling</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => setShowProcessor(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start AI Processing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVReaderEnhanced;
