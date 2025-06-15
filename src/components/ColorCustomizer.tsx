
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorCustomizerProps {
  onColorChange: (colors: ColorTheme) => void;
  currentColors?: ColorTheme;
}

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ onColorChange, currentColors }) => {
  const [colors, setColors] = useState<ColorTheme>(currentColors || {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    text: '#1F2937',
    background: '#FFFFFF'
  });

  const presetThemes: { name: string; colors: ColorTheme }[] = [
    {
      name: 'Professional Blue',
      colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', text: '#1F2937', background: '#FFFFFF' }
    },
    {
      name: 'Modern Purple',
      colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA', text: '#1F2937', background: '#FFFFFF' }
    },
    {
      name: 'Corporate Green',
      colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399', text: '#1F2937', background: '#FFFFFF' }
    },
    {
      name: 'Executive Black',
      colors: { primary: '#374151', secondary: '#111827', accent: '#6B7280', text: '#1F2937', background: '#FFFFFF' }
    },
    {
      name: 'Creative Orange',
      colors: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C', text: '#1F2937', background: '#FFFFFF' }
    },
    {
      name: 'Tech Cyan',
      colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#22D3EE', text: '#1F2937', background: '#FFFFFF' }
    }
  ];

  const updateColor = (key: keyof ColorTheme, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    onColorChange(newColors);
  };

  const applyPreset = (preset: ColorTheme) => {
    setColors(preset);
    onColorChange(preset);
  };

  const resetToDefault = () => {
    const defaultColors = {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      text: '#1F2937',
      background: '#FFFFFF'
    };
    setColors(defaultColors);
    onColorChange(defaultColors);
  };

  return (
    <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Color Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        
        {/* Color Presets */}
        <div>
          <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Theme Presets</Label>
          <div className="grid grid-cols-2 gap-3">
            {presetThemes.map((theme) => (
              <Button
                key={theme.name}
                variant="outline"
                onClick={() => applyPreset(theme.colors)}
                className="h-auto p-3 flex flex-col items-start gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <div className="flex gap-1 w-full">
                  <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>
                <span className="text-xs font-medium">{theme.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Custom Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{colors.primary}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{colors.secondary}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Accent Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => updateColor('accent', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{colors.accent}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Text Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={colors.text}
                  onChange={(e) => updateColor('text', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{colors.text}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Preview</Label>
          <div 
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
            style={{ backgroundColor: colors.background }}
          >
            <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>
              Sample Heading
            </h3>
            <p className="text-sm mb-2" style={{ color: colors.text }}>
              This is how your resume text will look with the selected colors.
            </p>
            <div className="flex gap-2">
              <span 
                className="px-2 py-1 rounded text-xs text-white shadow-sm" 
                style={{ backgroundColor: colors.secondary }}
              >
                Tag Example
              </span>
              <span 
                className="px-2 py-1 rounded text-xs text-white shadow-sm" 
                style={{ backgroundColor: colors.accent }}
              >
                Accent Tag
              </span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={resetToDefault}
          className="w-full flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  );
};

export default ColorCustomizer;
