import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Check, Eye } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (template: number) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
  onClose
}) => {
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
      name: "Minimalist Clean", 
      category: "minimalist",
      description: "Ultra-clean design with maximum readability",
      color: "bg-gradient-to-br from-gray-400 to-gray-600",
      popular: false,
      atsScore: 96,
      features: ["Minimal", "Clean", "Readable"],
      industry: ["Any Industry", "Startups", "Modern"]
    },
    {
      id: 5,
      name: "Corporate Classic",
      category: "professional", 
      description: "Traditional professional format",
      color: "bg-gradient-to-br from-blue-700 to-indigo-800",
      popular: false,
      atsScore: 94,
      features: ["Classic", "Professional", "Reliable"],
      industry: ["Corporate", "Traditional", "Formal"]
    },
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
      name: "Legal Professional",
      category: "professional",
      description: "Authoritative design for legal professionals",
      color: "bg-gradient-to-br from-stone-600 to-gray-700",
      popular: false,
      atsScore: 97,
      features: ["Authoritative", "Conservative", "Professional"],
      industry: ["Legal", "Law", "Compliance"]
    },
    {
      id: 8,
      name: "Engineering Focus",
      category: "tech",
      description: "Technical precision for engineering professionals",
      color: "bg-gradient-to-br from-slate-700 to-zinc-700",
      popular: false,
      atsScore: 95,
      features: ["Technical", "Precise", "Engineering"],
      industry: ["Engineering", "Manufacturing", "Technical"]
    },
    {
      id: 9,
      name: "Data Specialist",
      category: "tech",
      description: "Analytics-focused design for data professionals",
      color: "bg-gradient-to-br from-cyan-600 to-blue-600",
      popular: false,
      atsScore: 89,
      features: ["Analytics", "Data-Driven", "Technical"],
      industry: ["Data Science", "Analytics", "AI/ML"]
    },
    {
      id: 10,
      name: "Supply Chain",
      category: "professional",
      description: "Logistics-focused professional design",
      color: "bg-gradient-to-br from-orange-600 to-red-600",
      popular: false,
      atsScore: 91,
      features: ["Logistics", "Operations", "Professional"],
      industry: ["Supply Chain", "Logistics", "Operations"]
    },
    {
      id: 11,
      name: "Clean Modern",
      category: "modern",
      description: "Contemporary clean design for modern professionals",
      color: "bg-gradient-to-br from-teal-500 to-green-600",
      popular: false,
      atsScore: 93,
      features: ["Modern", "Clean", "Professional"],
      industry: ["Modern", "Startups", "Tech"]
    },
    {
      id: 12,
      name: "Marketing Creative",
      category: "creative",
      description: "Brand-focused design for marketing professionals",
      color: "bg-gradient-to-br from-violet-600 to-purple-600",
      popular: false,
      atsScore: 89,
      features: ["Creative", "Marketing", "Brand-Focused"],
      industry: ["Marketing", "Brand", "Digital"]
    },
    {
      id: 13,
      name: "Academic Scholar",
      category: "academic",
      description: "Scholarly design for academic and research positions",
      color: "bg-gradient-to-br from-amber-600 to-yellow-600",
      popular: false,
      atsScore: 93,
      features: ["Academic", "Research", "Scholarly"],
      industry: ["Academia", "Research", "Education"]
    },
    {
      id: 14,
      name: "Sales Champion",
      category: "sales",
      description: "Results-driven design highlighting achievements",
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      popular: false,
      atsScore: 90,
      features: ["Results-Driven", "Achievement", "Sales"],
      industry: ["Sales", "Business Development", "Account Management"]
    },
    {
      id: 15,
      name: "Consulting Elite",
      category: "consulting",
      description: "Premium design for consulting professionals",
      color: "bg-gradient-to-br from-sky-600 to-blue-700",
      popular: false,
      atsScore: 93,
      features: ["Strategic", "Premium", "Elite"],
      industry: ["Consulting", "Strategy", "Advisory"]
    },
    {
      id: 16,
      name: "Modern Creative",
      category: "creative",
      description: "Balanced creativity with professionalism",
      color: "bg-gradient-to-br from-purple-600 to-blue-600",
      popular: true,
      atsScore: 85,
      features: ["Modern", "Creative", "Balanced"],
      industry: ["UX/UI", "Design", "Creative"]
    },
    {
      id: 17,
      name: "Creative Portfolio",
      category: "creative",
      description: "Artistic design with geometric elements",
      color: "bg-gradient-to-br from-pink-500 to-orange-500",
      popular: true,
      atsScore: 82,
      features: ["Artistic", "Portfolio", "Visual"],
      industry: ["Design", "Art", "Creative"]
    },
    {
      id: 18,
      name: "Minimalist Elegant",
      category: "minimalist",
      description: "Sophisticated minimalism with elegant typography",
      color: "bg-gradient-to-br from-gray-500 to-slate-600",
      popular: false,
      atsScore: 94,
      features: ["Elegant", "Minimal", "Sophisticated"],
      industry: ["Any Industry", "Executive", "Professional"]
    },
    {
      id: 19,
      name: "Tech Innovator",
      category: "tech",
      description: "Dark theme code-inspired design for developers",
      color: "bg-gradient-to-br from-gray-800 to-black",
      popular: true,
      atsScore: 88,
      features: ["Dark Theme", "Code-Inspired", "Modern"],
      industry: ["Software", "Development", "Tech"]
    },
    {
      id: 20,
      name: "Executive Elite",
      category: "executive",
      description: "Luxury design for C-level executives",
      color: "bg-gradient-to-br from-yellow-600 to-yellow-800",
      popular: false,
      atsScore: 91,
      features: ["Luxury", "Executive", "Premium"],
      industry: ["C-Level", "Executive", "Leadership"]
    },
    {
      id: 21,
      name: "Creative Designer Pro",
      category: "creative",
      description: "Advanced creative design with artistic elements",
      color: "bg-gradient-to-br from-rose-500 to-purple-600",
      popular: true,
      atsScore: 86,
      features: ["Artistic", "Advanced", "Creative"],
      industry: ["Design", "Creative", "Art Direction"]
    }
  ];

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
  };

  const handleSelectTemplate = (templateId: number) => {
    console.log('Selecting template:', templateId);
    onSelectTemplate(templateId);
  };

  const handlePreviewTemplate = (templateId: number) => {
    console.log('Previewing template:', templateId);
    // For now, just select the template when previewing
    handleSelectTemplate(templateId);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Template</DialogTitle>
          <p className="text-gray-600 text-center">Select from {templates.length} professional templates that best fit your industry and style</p>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Template Preview */}
              <div className={`h-32 ${template.color} relative`}>
                {template.popular && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500 text-xs">
                    <Star className="w-2 h-2 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
                
                <Badge 
                  className={`absolute top-2 left-2 text-xs ${getATSScoreColor(template.atsScore)}`}
                >
                  ATS: {template.atsScore}%
                </Badge>
                
                {selectedTemplate === template.id && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                {/* Template Preview Content */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-3 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-6 h-6 bg-white/20 rounded mx-auto mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-0.5 bg-white/30 rounded w-8 mx-auto"></div>
                      <div className="h-0.5 bg-white/30 rounded w-6 mx-auto"></div>
                      <div className="h-0.5 bg-white/20 rounded w-5 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{template.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">{template.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.features.slice(0, 2).map((feature) => (
                    <span 
                      key={feature} 
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1 py-0.5 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-1">
                  <Button 
                    className={`flex-1 text-xs py-1 h-7 ${
                      selectedTemplate === template.id 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template.id);
                    }}
                  >
                    {selectedTemplate === template.id ? 'Selected' : 'Select'}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="px-2 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewTemplate(template.id);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            {selectedTemplate !== undefined ? `Template ${selectedTemplate + 1} selected` : 'No template selected'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {selectedTemplate !== undefined && (
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                Use Selected Template
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
