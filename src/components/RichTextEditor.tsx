
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link,
  Type,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start typing...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertBulletList = () => {
    execCommand('insertUnorderedList');
  };

  const insertNumberedList = () => {
    execCommand('insertOrderedList');
  };

  const formatText = (command: string) => {
    execCommand(command);
  };

  const alignText = (alignment: string) => {
    execCommand(`justify${alignment}`);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const changeFontSize = (size: string) => {
    execCommand('fontSize', size);
  };

  const changeTextColor = (color: string) => {
    execCommand('foreColor', color);
  };

  return (
    <Card className={`w-full ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 mr-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('bold')}
              className="p-2"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('italic')}
              className="p-2"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('underline')}
              className="p-2"
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex gap-1 mr-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={insertBulletList}
              className="p-2"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={insertNumberedList}
              className="p-2"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 mr-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => alignText('Left')}
              className="p-2"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => alignText('Center')}
              className="p-2"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => alignText('Right')}
              className="p-2"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Link */}
          <div className="flex gap-1 mr-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={insertLink}
              className="p-2"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>

          {/* Font Size */}
          <div className="flex gap-1 mr-3">
            <select 
              onChange={(e) => changeFontSize(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="1">Small</option>
              <option value="3" selected>Normal</option>
              <option value="5">Large</option>
              <option value="7">X-Large</option>
            </select>
          </div>

          {/* Text Color */}
          <div className="flex gap-1">
            <input
              type="color"
              onChange={(e) => changeTextColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Text Color"
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          className={`p-4 min-h-[200px] outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            !value && !isEditorFocused ? 'text-gray-400' : 'text-gray-900'
          }`}
          style={{ 
            lineHeight: '1.6',
            fontFamily: 'inherit'
          }}
          suppressContentEditableWarning={true}
        >
          {!value && !isEditorFocused && (
            <span className="text-gray-400 pointer-events-none">
              {placeholder}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2">
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span>Use toolbar for formatting</span>
          <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
        </div>
      </div>
    </Card>
  );
};

export default RichTextEditor;
