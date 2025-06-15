
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EnhancedExperienceTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedExperienceTextarea: React.FC<EnhancedExperienceTextareaProps> = ({
  value,
  onChange,
  placeholder = "Describe your responsibilities and achievements...",
  className = ""
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;
    const currentValue = textarea.value;

    // Handle Enter key to create new bullet points
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const beforeCursor = currentValue.substring(0, selectionStart);
      const afterCursor = currentValue.substring(selectionEnd);
      
      // Check if we're at the beginning of a line or if the current line is empty
      const lines = beforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      
      let newText;
      if (currentLine.trim() === '' || currentLine.trim() === '•') {
        // If current line is empty or just a bullet, add a new bullet point
        newText = beforeCursor + '\n• ' + afterCursor;
      } else if (currentLine.trim().startsWith('•')) {
        // If current line has content and starts with bullet, add new bullet
        newText = beforeCursor + '\n• ' + afterCursor;
      } else {
        // If current line doesn't start with bullet, add bullet to current line and new line
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const lineContent = beforeCursor.substring(lineStart);
        const beforeLine = beforeCursor.substring(0, lineStart);
        
        if (!lineContent.startsWith('• ')) {
          newText = beforeLine + '• ' + lineContent + '\n• ' + afterCursor;
        } else {
          newText = beforeCursor + '\n• ' + afterCursor;
        }
      }
      
      onChange(newText);
      
      // Set cursor position after the new bullet point
      setTimeout(() => {
        const newCursorPos = newText.indexOf('• ', selectionStart) + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
    
    // Handle Backspace to remove bullet points intelligently
    else if (e.key === 'Backspace') {
      const beforeCursor = currentValue.substring(0, selectionStart);
      const afterCursor = currentValue.substring(selectionEnd);
      
      // Check if we're at the start of a bullet point
      if (beforeCursor.endsWith('• ')) {
        e.preventDefault();
        const newText = beforeCursor.slice(0, -2) + afterCursor;
        onChange(newText);
        
        setTimeout(() => {
          textarea.setSelectionRange(selectionStart - 2, selectionStart - 2);
        }, 0);
      }
    }
    
    // Handle Tab to indent (optional enhancement)
    else if (e.key === 'Tab') {
      e.preventDefault();
      const beforeCursor = currentValue.substring(0, selectionStart);
      const afterCursor = currentValue.substring(selectionEnd);
      
      const newText = beforeCursor + '  ' + afterCursor; // Add 2 spaces for indentation
      onChange(newText);
      
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const formatWithBullets = () => {
    if (!value.trim()) return;
    
    const lines = value.split('\n').map(line => line.trim()).filter(line => line);
    const formattedLines = lines.map(line => {
      if (!line.startsWith('• ') && line.length > 0) {
        return `• ${line}`;
      }
      return line;
    });
    
    onChange(formattedLines.join('\n'));
  };

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`min-h-[120px] resize-none transition-all duration-200 ${className}`}
        style={{ height: 'auto' }}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={formatWithBullets}
          className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
        >
          Auto-format with bullets
        </button>
        <span className="text-xs text-gray-500">
          Press Enter for new bullet • Press Backspace to remove bullets • Press Tab to indent
        </span>
      </div>
    </div>
  );
};

export default EnhancedExperienceTextarea;
