
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';
import ImprovedResumePreview from './ImprovedResumePreview';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;
  templateName: string;
  onSelectTemplate: (templateId: number) => void;
  selectedTemplate?: number;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  templateId,
  templateName,
  onSelectTemplate,
  selectedTemplate
}) => {
  // Sample resume data for preview
  const sampleData = {
    personal: {
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      summary: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about creating scalable solutions and leading cross-functional teams to deliver high-quality products.",
      website: "www.johnsmith.dev",
      linkedin: "linkedin.com/in/johnsmith",
      github: "github.com/johnsmith"
    },
    experience: [
      {
        id: 1,
        company: "Tech Solutions Inc.",
        position: "Senior Software Engineer",
        location: "New York, NY",
        startDate: "Jan 2022",
        endDate: "Present",
        description: "Led development of microservices architecture serving 1M+ users, resulting in 40% improved performance and 99.9% uptime. Mentored junior developers and implemented CI/CD pipelines.",
        achievements: [
          "Reduced deployment time by 60% through automated CI/CD implementation",
          "Led team of 5 developers in successful product launch",
          "Improved application performance by 40% through optimization"
        ]
      },
      {
        id: 2,
        company: "StartupCorp",
        position: "Full Stack Developer",
        location: "San Francisco, CA",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        description: "Built and maintained React-based web applications with Node.js backends. Collaborated with product teams to deliver features for 50,000+ active users.",
        achievements: [
          "Developed 15+ responsive web components",
          "Integrated third-party APIs reducing manual work by 30%"
        ]
      }
    ],
    education: [
      {
        id: 1,
        school: "Stanford University",
        degree: "Bachelor of Science in Computer Science",
        location: "Stanford, CA",
        startDate: "2016",
        endDate: "2020",
        gpa: "3.8",
        honors: "Magna Cum Laude"
      }
    ],
    skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", 
      "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Git", "Agile"
    ],
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, and order processing.",
        technologies: "React, Node.js, MongoDB, Stripe API",
        link: "github.com/johnsmith/ecommerce",
        startDate: "Mar 2023",
        endDate: "Jun 2023",
        highlights: [
          "Implemented secure payment processing",
          "Built responsive design for mobile and desktop"
        ]
      },
      {
        id: 2,
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates using WebSocket technology.",
        technologies: "Vue.js, Express.js, Socket.io, MySQL",
        link: "taskmanager.johnsmith.dev",
        startDate: "Jan 2023",
        endDate: "Feb 2023"
      }
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
        credentialId: "AWS-SA-12345",
        expiryDate: "2026"
      },
      {
        id: 2,
        name: "Certified Kubernetes Administrator",
        issuer: "Cloud Native Computing Foundation",
        date: "2022",
        credentialId: "CKA-67890"
      }
    ],
    languages: [
      {
        id: 1,
        language: "English",
        proficiency: "Native"
      },
      {
        id: 2,
        language: "Spanish",
        proficiency: "Conversational"
      },
      {
        id: 3,
        language: "French",
        proficiency: "Basic"
      }
    ],
    interests: [
      "Open Source Contributing", "Machine Learning", "Rock Climbing", 
      "Photography", "Chess", "Travel"
    ]
  };

  const handleSelectTemplate = () => {
    onSelectTemplate(templateId);
    onClose();
  };

  const templateInfo = getTemplateInfo(templateId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{templateName}</span>
            {templateInfo.popular && (
              <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Popular
              </Badge>
            )}
            {selectedTemplate === templateId && (
              <Badge className="bg-green-500 text-white">
                <Check className="w-3 h-3 mr-1" />
                Selected
              </Badge>
            )}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>ATS Score: <span className="font-semibold text-green-600">{templateInfo.atsScore}%</span></span>
            <span>•</span>
            <span>Category: <span className="font-semibold">{templateInfo.category}</span></span>
            <span>•</span>
            <span>Best for: {templateInfo.industry.join(', ')}</span>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Template Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ImprovedResumePreview 
                data={sampleData} 
                template={templateId} 
                scale={0.4}
              />
            </div>
          </div>
          
          {/* Template Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Template Features</h3>
              <div className="space-y-2">
                {templateInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{templateInfo.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Best Suited For</h3>
              <div className="flex flex-wrap gap-2">
                {templateInfo.industry.map((industry) => (
                  <Badge key={industry} variant="outline" className="text-sm">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">ATS Compatibility</h3>
              <div className="flex items-center gap-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      templateInfo.atsScore >= 90 ? 'bg-green-500' : 
                      templateInfo.atsScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${templateInfo.atsScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{templateInfo.atsScore}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {templateInfo.atsScore >= 90 ? 'Excellent ATS compatibility' : 
                 templateInfo.atsScore >= 80 ? 'Good ATS compatibility' : 'Moderate ATS compatibility'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              Download Sample
            </Button>
            <Button 
              onClick={handleSelectTemplate}
              className={`${
                selectedTemplate === templateId 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {selectedTemplate === templateId ? 'Template Selected' : 'Use This Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getTemplateInfo = (templateId: number) => {
  const templates = [
    {
      id: 0,
      name: "Modern Professional",
      category: "Professional",
      description: "A clean, contemporary design perfect for corporate roles and professional environments. Features clear sections and excellent readability.",
      atsScore: 95,
      popular: true,
      features: [
        "ATS-Optimized Layout",
        "Clean Typography",
        "Professional Color Scheme",
        "Clear Section Hierarchy",
        "Contact Information Prominent",
        "Skills Section Highlighted"
      ],
      industry: ["Corporate", "Finance", "Consulting", "Healthcare"]
    },
    {
      id: 1,
      name: "Executive Leadership",
      category: "Executive",
      description: "Sophisticated design tailored for senior management and C-level positions. Emphasizes leadership experience and strategic achievements.",
      atsScore: 92,
      popular: false,
      features: [
        "Executive Summary Focus",
        "Leadership Emphasis",
        "Strategic Achievement Highlight",
        "Professional Typography",
        "Conservative Design",
        "Results-Oriented Layout"
      ],
      industry: ["Management", "Executive", "C-Level", "Strategy"]
    },
    {
      id: 2,
      name: "Classic Corporate",
      category: "Traditional",
      description: "Traditional layout with modern touches, perfect for conservative industries and formal business environments.",
      atsScore: 98,
      popular: false,
      features: [
        "Traditional Layout",
        "Conservative Design",
        "Excellent ATS Score",
        "Formal Typography",
        "Standard Sections",
        "Professional Appearance"
      ],
      industry: ["Banking", "Law", "Government", "Insurance"]
    },
    {
      id: 3,
      name: "Creative Designer",
      category: "Creative",
      description: "Eye-catching design for creative professionals. Balances creativity with professionalism and includes space for portfolio highlights.",
      atsScore: 78,
      popular: true,
      features: [
        "Creative Color Scheme",
        "Visual Hierarchy",
        "Portfolio Integration",
        "Creative Typography",
        "Unique Layout",
        "Brand Expression"
      ],
      industry: ["Design", "Marketing", "Advertising", "Media"]
    },
    {
      id: 4,
      name: "Tech Specialist",
      category: "Technical",
      description: "Code-inspired layout perfect for developers and engineers. Features technical skills prominently and includes project showcases.",
      atsScore: 90,
      popular: true,
      features: [
        "Technical Skills Focus",
        "Project Showcase",
        "Code-Inspired Design",
        "Developer-Friendly",
        "GitHub Integration",
        "Technology Stack Highlight"
      ],
      industry: ["Software", "Engineering", "IT", "Development"]
    },
    {
      id: 5,
      name: "Minimalist",
      category: "Clean",
      description: "Clean, minimal design that focuses on content over decoration. Perfect for those who prefer simplicity and elegance.",
      atsScore: 94,
      popular: false,
      features: [
        "Minimal Design",
        "Content Focus",
        "Clean Typography",
        "Elegant Layout",
        "Simple Color Scheme",
        "Easy to Read"
      ],
      industry: ["Any Industry", "Consulting", "Academia", "Research"]
    },
    {
      id: 6,
      name: "Two Column",
      category: "Structured",
      description: "Structured two-column layout that maximizes space efficiency. Perfect for professionals with diverse skills and experience.",
      atsScore: 88,
      popular: false,
      features: [
        "Two-Column Layout",
        "Space Efficient",
        "Skills Sidebar",
        "Structured Design",
        "Information Dense",
        "Professional Appearance"
      ],
      industry: ["General", "Consulting", "Project Management", "Operations"]
    }
  ];

  return templates.find(t => t.id === templateId) || templates[0];
};

export default TemplatePreviewModal;
