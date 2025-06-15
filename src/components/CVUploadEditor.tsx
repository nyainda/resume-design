
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import AutoCVProcessor from './enhanced-forms/AutoCVProcessor';

interface CVUploadEditorProps {
  onClose: () => void;
}

const CVUploadEditor: React.FC<CVUploadEditorProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            CV Upload & Editor
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>
        
        <div className="p-6">
          <AutoCVProcessor onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadEditor;
