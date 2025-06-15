
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Eye, Download } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: number) => void;
  selectedTemplate?: number;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ 
  onSelectTemplate, 
  selectedTemplate = 0 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const templates = [
    // Professional Templates
    {
      id: 0,
      name: "Modern Professional",
      category: "professional",
      description: "Clean and contemporary design perfect for corporate roles",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      atsScore: 95,
      features: ["ATS-Friendly", "Clean Layout", "Professional"],
      industry: ["Corporate", "Finance", "Consulting"]
    },
    {
      id: 1,
      name: "Executive Leader",
      category: "professional",
      description: "Sophisticated design for senior management positions",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      popular: false,
      atsScore: 92,
      features: ["Executive", "Elegant", "Leadership"],
      industry: ["Management", "Executive", "C-Level"]
    },
    {
      id: 2,
      name: "Classic Corporate",
      category: "professional",
      description: "Traditional layout with modern touches",
      color: "bg-gradient-to-br from-slate-600 to-slate-800",
      popular: false,
      atsScore: 98,
      features: ["Traditional", "Corporate", "Conservative"],
      industry: ["Banking", "Law", "Government"]
    },
    
    // Creative Templates
    {
      id: 3,
      name: "Creative Designer",
      category: "creative",
      description: "Eye-catching design for creative and design positions",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: true,
      atsScore: 78,
      features: ["Creative", "Colorful", "Stand Out"],
      industry: ["Design", "Marketing", "Advertising"]
    },
    {
      id: 4,
      name: "Artistic Portfolio",
      category: "creative",
      description: "Visual-heavy template for showcasing creative work",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      popular: false,
      atsScore: 72,
      features: ["Portfolio", "Visual", "Creative"],
      industry: ["Art", "Photography", "Design"]
    },
    {
      id: 5,
      name: "Modern Creative",
      category: "creative",
      description: "Balanced creativity with professionalism",
      color: "bg-gradient-to-br from-teal-500 to-cyan-600",
      popular: false,
      atsScore: 85,
      features: ["Modern", "Balanced", "Creative"],
      industry: ["UX/UI", "Branding", "Digital"]
    },

    // Tech Templates
    {
      id: 6,
      name: "Tech Specialist",
      category: "tech",
      description: "Code-inspired layout perfect for developers and engineers",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      atsScore: 90,
      features: ["Tech-Focused", "Unique", "Developer-Friendly"],
      industry: ["Software", "Engineering", "IT"]
    },
    {
      id: 7,
      name: "Full Stack Developer",
      category: "tech",
      description: "Multi-section layout for showcasing technical skills",
      color: "bg-gradient-to-br from-indigo-600 to-purple-600",
      popular: false,
      atsScore: 88,
      features: ["Multi-Column", "Technical", "Skills-Focused"],
      industry: ["Development", "Programming", "Tech"]
    },
    {
      id: 8,
      name: "DevOps Engineer",
      category: "tech",
      description: "Infrastructure-focused design for DevOps professionals",
      color: "bg-gradient-to-br from-emerald-600 to-green-700",
      popular: false,
      atsScore: 86,
      features: ["Infrastructure", "Technical", "Systems"],
      industry: ["DevOps", "Cloud", "Infrastructure"]
    },

    // Academic Templates
    {
      id: 9,
      name: "Research Academic",
      category: "academic",
      description: "Publication-focused layout for researchers",
      color: "bg-gradient-to-br from-amber-600 to-yellow-600",
      popular: false,
      atsScore: 94,
      features: ["Research-Focused", "Publications", "Academic"],
      industry: ["Research", "Academia", "Science"]
    },
    {
      id: 10,
      name: "PhD Candidate",
      category: "academic",
      description: "Balanced education and research experience",
      color: "bg-gradient-to-br from-violet-600 to-purple-700",
      popular: false,
      atsScore: 91,
      features: ["Education-Focused", "Research", "Graduate"],
      industry: ["Academia", "PhD", "Research"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'professional', name: 'Professional', count: templates.filter(t => t.category === 'professional').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'tech', name: 'Technology', count: templates.filter(t => t.category === 'tech').length },
    { id: 'academic', name: 'Academic', count: templates.filter(t => t.category === 'academic').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.features.some(feature => 
                           feature.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => onSelectTemplate(template.id)}
              >
                {/* Template Preview */}
                <div className={`h-48 ${template.color} relative overflow-hidden`}>
                  {template.popular && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                  
                  <Badge 
                    className={`absolute top-3 left-3 ${getATSScoreColor(template.atsScore)}`}
                  >
                    ATS: {template.atsScore}%
                  </Badge>
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                      <Badge className="bg-blue-500 text-white">
                        Selected
                      </Badge>
                    </div>
                  )}
                  
                  {/* Template Preview Content */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-4 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-white/30 rounded w-24 mx-auto"></div>
                        <div className="h-2 bg-white/30 rounded w-20 mx-auto"></div>
                        <div className="h-1 bg-white/20 rounded w-16 mx-auto"></div>
                        <div className="h-1 bg-white/20 rounded w-18 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Template Info */}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Industry Tags */}
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Best for:</span>{' '}
                    {template.industry.join(', ')}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className={`flex-1 ${
                        selectedTemplate === template.id 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template.id);
                      }}
                    >
                      {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No templates found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
