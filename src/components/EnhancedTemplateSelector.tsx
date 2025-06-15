
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Star, Palette, CheckCircle, Zap } from 'lucide-react';
import ImprovedResumePreview from './ImprovedResumePreview';

interface EnhancedTemplateSelectorProps {
  isOpen: boolean;
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
  onClose: () => void;
}

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  atsScore: number;
  popular: boolean;
  color: string;
  industry: string[];
  features: string[];
}

const EnhancedTemplateSelector: React.FC<EnhancedTemplateSelectorProps> = ({
  isOpen,
  selectedTemplate,
  onSelectTemplate,
  onClose
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const templates: Template[] = [
    {
      id: 0,
      name: 'Modern Professional',
      category: 'professional',
      description: 'Clean, modern design perfect for most industries',
      atsScore: 95,
      popular: true,
      color: 'bg-gradient-to-br from-blue-600 to-blue-800',
      industry: ['Technology', 'Business', 'Consulting', 'Finance'],
      features: ['ATS Optimized', 'Clean Layout', 'Professional Typography']
    },
    {
      id: 1,
      name: 'Executive Leadership',
      category: 'executive',
      description: 'Premium design for senior-level positions',
      atsScore: 92,
      popular: true,
      color: 'bg-gradient-to-br from-gray-700 to-gray-900',
      industry: ['Executive', 'C-Level', 'Management', 'Leadership'],
      features: ['Executive Focus', 'Achievement Highlights', 'Leadership Emphasis']
    },
    {
      id: 2,
      name: 'Classic Corporate',
      category: 'corporate',
      description: 'Traditional professional format for conservative industries',
      atsScore: 98,
      popular: false,
      color: 'bg-gradient-to-br from-slate-600 to-slate-800',
      industry: ['Banking', 'Legal', 'Government', 'Insurance'],
      features: ['Traditional Layout', 'Maximum ATS Score', 'Conservative Design']
    },
    {
      id: 3,
      name: 'Creative Designer',
      category: 'creative',
      description: 'Visually appealing design for creative professionals',
      atsScore: 88,
      popular: true,
      color: 'bg-gradient-to-br from-purple-600 to-pink-600',
      industry: ['Design', 'Marketing', 'Advertising', 'Media'],
      features: ['Visual Appeal', 'Creative Layout', 'Portfolio Integration']
    },
    {
      id: 4,
      name: 'Tech Specialist',
      category: 'tech',
      description: 'Technical focus for IT and engineering roles',
      atsScore: 94,
      popular: true,
      color: 'bg-gradient-to-br from-green-600 to-teal-600',
      industry: ['Software', 'Engineering', 'IT', 'Data Science'],
      features: ['Technical Skills Focus', 'Project Highlights', 'Tech-Friendly']
    },
    {
      id: 5,
      name: 'Minimalist Clean',
      category: 'minimal',
      description: 'Ultra-clean design with maximum readability',
      atsScore: 96,
      popular: false,
      color: 'bg-gradient-to-br from-gray-400 to-gray-600',
      industry: ['Any Industry', 'Startups', 'Modern Companies'],
      features: ['Maximum Readability', 'Minimal Design', 'Universal Appeal']
    },
    {
      id: 6,
      name: 'Professional Blue',
      category: 'professional',
      description: 'Classic blue-themed professional design',
      atsScore: 94,
      popular: false,
      color: 'bg-gradient-to-br from-blue-700 to-indigo-800',
      industry: ['Corporate', 'Finance', 'Healthcare', 'Education'],
      features: ['Professional', 'Trust-Building', 'Classic']
    },
    {
      id: 7,
      name: 'Legal Professional',
      category: 'legal',
      description: 'Authoritative design for legal professionals',
      atsScore: 97,
      popular: false,
      color: 'bg-gradient-to-br from-stone-600 to-gray-700',
      industry: ['Legal', 'Law', 'Compliance', 'Government'],
      features: ['Professional Authority', 'Legal Focus', 'Conservative Design']
    },
    {
      id: 8,
      name: 'Engineering Focus',
      category: 'engineering',
      description: 'Technical precision for engineering professionals',
      atsScore: 95,
      popular: false,
      color: 'bg-gradient-to-br from-slate-700 to-zinc-700',
      industry: ['Engineering', 'Manufacturing', 'Technical'],
      features: ['Technical Precision', 'Project Focus', 'Engineering Metrics']
    },
    {
      id: 9,
      name: 'Data Specialist',
      category: 'tech',
      description: 'Analytics-focused design for data professionals',
      atsScore: 89,
      popular: false,
      color: 'bg-gradient-to-br from-cyan-600 to-blue-600',
      industry: ['Data Science', 'Analytics', 'AI/ML', 'Research'],
      features: ['Data Focus', 'Analytics Emphasis', 'Technical Skills']
    },
    {
      id: 10,
      name: 'Supply Chain Manager',
      category: 'operations',
      description: 'Operations-focused design for supply chain professionals',
      atsScore: 91,
      popular: false,
      color: 'bg-gradient-to-br from-orange-600 to-red-600',
      industry: ['Supply Chain', 'Logistics', 'Operations', 'Manufacturing'],
      features: ['Operations Focus', 'Process Emphasis', 'Results-Driven']
    },
    {
      id: 11,
      name: 'Clean Modern',
      category: 'modern',
      description: 'Contemporary design with clean aesthetics',
      atsScore: 93,
      popular: false,
      color: 'bg-gradient-to-br from-teal-500 to-green-600',
      industry: ['Modern Companies', 'Startups', 'Tech', 'Creative'],
      features: ['Modern Design', 'Clean Aesthetics', 'Contemporary']
    },
    {
      id: 12,
      name: 'Marketing Creative',
      category: 'marketing',
      description: 'Brand-focused design for marketing professionals',
      atsScore: 89,
      popular: false,
      color: 'bg-gradient-to-br from-violet-600 to-purple-600',
      industry: ['Marketing', 'Brand Management', 'Digital Marketing'],
      features: ['Brand Focus', 'Creative Elements', 'Marketing Metrics']
    },
    {
      id: 13,
      name: 'Academic Scholar',
      category: 'academic',
      description: 'Scholarly design for academic and research positions',
      atsScore: 93,
      popular: false,
      color: 'bg-gradient-to-br from-amber-600 to-yellow-600',
      industry: ['Academia', 'Research', 'Education', 'Science'],
      features: ['Academic Focus', 'Publication Ready', 'Research Emphasis']
    },
    {
      id: 14,
      name: 'Sales Champion',
      category: 'sales',
      description: 'Results-driven design highlighting achievements',
      atsScore: 90,
      popular: false,
      color: 'bg-gradient-to-br from-red-500 to-orange-500',
      industry: ['Sales', 'Business Development', 'Account Management'],
      features: ['Achievement Focus', 'Results Driven', 'Performance Metrics']
    },
    {
      id: 15,
      name: 'Consulting Elite',
      category: 'consulting',
      description: 'Premium design for consulting professionals',
      atsScore: 93,
      popular: false,
      color: 'bg-gradient-to-br from-sky-600 to-blue-700',
      industry: ['Consulting', 'Strategy', 'Business Advisory'],
      features: ['Strategic Focus', 'Problem Solving', 'Client Results']
    },
    {
      id: 16,
      name: 'Modern Creative',
      category: 'creative',
      description: 'Balanced creativity with professionalism',
      atsScore: 85,
      popular: true,
      color: 'bg-gradient-to-br from-purple-600 to-blue-600',
      industry: ['UX/UI', 'Design', 'Creative', 'Digital'],
      features: ['Creative Balance', 'Modern Design', 'Professional Appeal']
    },
    {
      id: 17,
      name: 'Creative Portfolio',
      category: 'creative',
      description: 'Artistic design with geometric visual elements',
      atsScore: 82,
      popular: true,
      color: 'bg-gradient-to-br from-pink-500 to-orange-500',
      industry: ['Design', 'Art', 'Creative Direction', 'Visual Arts'],
      features: ['Artistic Design', 'Visual Portfolio', 'Creative Showcase']
    },
    {
      id: 18,
      name: 'Minimalist Elegant',
      category: 'minimalist',
      description: 'Sophisticated minimalism with elegant typography',
      atsScore: 94,
      popular: false,
      color: 'bg-gradient-to-br from-gray-500 to-slate-600',
      industry: ['Executive', 'Luxury', 'Professional Services', 'Consulting'],
      features: ['Elegant Design', 'Sophisticated Layout', 'Premium Feel']
    },
    {
      id: 19,
      name: 'Tech Innovator',
      category: 'tech',
      description: 'Dark theme code-inspired design for developers',
      atsScore: 88,
      popular: true,
      color: 'bg-gradient-to-br from-gray-800 to-black',
      industry: ['Software Development', 'DevOps', 'Tech Innovation', 'Programming'],
      features: ['Dark Theme', 'Code Aesthetic', 'Developer-Focused']
    },
    {
      id: 20,
      name: 'Executive Elite',
      category: 'executive',
      description: 'Luxury design for C-level executives and leaders',
      atsScore: 91,
      popular: false,
      color: 'bg-gradient-to-br from-yellow-600 to-yellow-800',
      industry: ['C-Level', 'Executive Leadership', 'Board Positions', 'Senior Management'],
      features: ['Luxury Design', 'Executive Presence', 'Premium Quality']
    },
    {
      id: 21,
      name: 'Creative Designer Pro',
      category: 'creative',
      description: 'Advanced creative design with artistic flair',
      atsScore: 86,
      popular: true,
      color: 'bg-gradient-to-br from-rose-500 to-purple-600',
      industry: ['Creative Direction', 'Art Direction', 'Design Leadership', 'Creative Strategy'],
      features: ['Advanced Design', 'Artistic Elements', 'Creative Leadership']
    }
  ];

  const mockResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Experienced software engineer with expertise in full-stack development.'
    },
    experience: [
      {
        id: 1,
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led development of scalable web applications using React and Node.js.'
      }
    ],
    education: [
      {
        id: 1,
        school: 'University of California',
        degree: 'Bachelor of Science in Computer Science',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    certifications: [],
    languages: [],
    interests: [],
    projects: []
  };

  const handleSelect = (templateId: number) => {
    onSelectTemplate(templateId);
    onClose();
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-100';
    if (score >= 90) return 'text-blue-600 bg-blue-100';
    if (score >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Palette className="w-6 h-6" />
            Choose Your Resume Template
          </DialogTitle>
          <DialogDescription>
            Select from {templates.length} professionally designed templates optimized for ATS systems
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Template List */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {/* Template Header */}
                    <div className={`h-20 ${template.color} relative`}>
                      {template.popular && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500 text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      )}
                      
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-2 rounded flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-sm font-semibold">{template.name}</div>
                          <div className="text-xs opacity-80">{template.category}</div>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        {template.name}
                        {selectedTemplate === template.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* ATS Score */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ATS Score</span>
                        <Badge className={`${getATSScoreColor(template.atsScore)} text-xs`}>
                          {template.atsScore}%
                        </Badge>
                      </div>

                      {/* Features */}
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Features</span>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Industry Tags */}
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Best For</span>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {template.industry.slice(0, 2).join(', ')}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewTemplate(previewTemplate === template.id ? null : template.id)}
                          className="flex-1 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {previewTemplate === template.id ? 'Hide' : 'Preview'}
                        </Button>
                        <Button
                          onClick={() => handleSelect(template.id)}
                          className={`flex-1 text-xs ${
                            selectedTemplate === template.id
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                          }`}
                        >
                          {selectedTemplate === template.id ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 mr-1" />
                              Select
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="h-[60vh]">
              <CardHeader>
                <CardTitle className="text-lg">Template Preview</CardTitle>
                <CardDescription>
                  {previewTemplate !== null ? `Previewing: ${templates[previewTemplate]?.name}` : 'Select a template to preview'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full overflow-hidden">
                {previewTemplate !== null ? (
                  <div className="h-full bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-auto">
                    <div className="transform scale-[0.3] origin-top-left w-[300%]">
                      <ImprovedResumePreview 
                        data={mockResumeData} 
                        template={previewTemplate}
                        scale={1}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Preview" on any template to see it here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedTemplateSelector;
