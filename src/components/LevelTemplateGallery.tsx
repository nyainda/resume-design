
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Crown,
  Eye,
  Check
} from 'lucide-react';

interface TemplateGalleryProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
}

const LevelTemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplateCategories();
  }, []);

  const loadTemplateCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('template_categories')
        .select('*')
        .eq('is_active', true)
        .order('level');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading template categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'internship':
        return <GraduationCap className="w-5 h-5" />;
      case 'junior':
        return <Briefcase className="w-5 h-5" />;
      case 'mid-level':
        return <Award className="w-5 h-5" />;
      case 'senior':
        return <Crown className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'internship':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'junior':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'mid-level':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'senior':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const mockTemplates = {
    internship: [
      { id: 0, name: 'Clean Academic', preview: '/api/placeholder/300/400' },
      { id: 1, name: 'Student Focus', preview: '/api/placeholder/300/400' },
      { id: 2, name: 'Fresh Graduate', preview: '/api/placeholder/300/400' }
    ],
    junior: [
      { id: 3, name: 'Modern Professional', preview: '/api/placeholder/300/400' },
      { id: 4, name: 'Tech Starter', preview: '/api/placeholder/300/400' },
      { id: 5, name: 'Creative Entry', preview: '/api/placeholder/300/400' }
    ],
    'mid-level': [
      { id: 6, name: 'Executive Professional', preview: '/api/placeholder/300/400' },
      { id: 7, name: 'Industry Expert', preview: '/api/placeholder/300/400' },
      { id: 8, name: 'Leadership Ready', preview: '/api/placeholder/300/400' }
    ],
    senior: [
      { id: 9, name: 'C-Suite Executive', preview: '/api/placeholder/300/400' },
      { id: 10, name: 'Senior Director', preview: '/api/placeholder/300/400' },
      { id: 11, name: 'VP Professional', preview: '/api/placeholder/300/400' }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="internship" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.level} 
              value={category.level}
              className="flex items-center gap-2"
            >
              {getLevelIcon(category.level)}
              <span className="capitalize">{category.level}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.level} value={category.level} className="space-y-4">
            <div className="text-center py-4">
              <Badge className={`${getLevelColor(category.level)} mb-2`}>
                {category.level.toUpperCase()}
              </Badge>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {category.description}
              </p>
              {category.template_data?.emphasis && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  Emphasis: {category.template_data.emphasis}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {mockTemplates[category.level as keyof typeof mockTemplates]?.map((template) => (
                <Card 
                  key={template.id} 
                  className={`group cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => onSelectTemplate(template.id)}
                >
                  <div className="relative">
                    {/* Template Preview */}
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-400 dark:text-gray-500">
                        <Eye className="w-12 h-12" />
                        <p className="text-sm mt-2">Preview</p>
                      </div>
                    </div>
                    
                    {/* Selected Indicator */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <Badge className={getLevelColor(category.level)}>
                        {category.level.replace('-', ' ')}
                      </Badge>
                      <Button
                        size="sm"
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate(template.id);
                        }}
                      >
                        {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LevelTemplateGallery;
