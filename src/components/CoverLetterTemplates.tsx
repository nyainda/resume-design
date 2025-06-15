
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Star, FileText } from 'lucide-react';

interface CoverLetterTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  tone: string;
  color: string;
  popular: boolean;
  preview: string;
  industry: string[];
  seoKeywords: string[];
}

interface CoverLetterTemplatesProps {
  onSelectTemplate: (templateId: number) => void;
  selectedTemplate?: number;
}

const CoverLetterTemplates: React.FC<CoverLetterTemplatesProps> = ({
  onSelectTemplate,
  selectedTemplate = 0
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const templates: CoverLetterTemplate[] = [
    {
      id: 0,
      name: "Professional Executive",
      category: "professional",
      description: "Perfect for corporate and executive positions with formal tone",
      tone: "Formal & Professional",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      preview: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position] role at [Company]. With [X years] of progressive experience in [Industry], I am confident that my proven track record of [Key Achievement] and expertise in [Core Skill] make me an ideal candidate for this position.\n\nIn my current role as [Current Position] at [Current Company], I have successfully [Specific Achievement with metrics]. This experience has strengthened my ability to [Relevant Skill] while developing expertise in [Technical/Industry Knowledge].\n\nI am particularly drawn to [Company] because of [Specific reason related to company/role]. I am excited about the opportunity to contribute to [Company Goal/Initiative] and would welcome the chance to discuss how my background in [Relevant Area] can benefit your team.\n\nThank you for your consideration. I look forward to hearing from you.\n\nSincerely,\n[Your Name]",
      industry: ["Corporate", "Finance", "Healthcare", "Legal", "Government"],
      seoKeywords: ["professional cover letter", "executive cover letter", "formal application letter", "corporate job application"]
    },
    {
      id: 1,
      name: "Creative & Modern",
      category: "creative",
      description: "Engaging tone perfect for design, marketing, and creative roles",
      tone: "Creative & Engaging",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: true,
      preview: "Hello [Hiring Manager Name],\n\nYour [Position] opportunity immediately caught my attention – it's exactly the kind of creative challenge I've been seeking! As a passionate [Your Role] with a proven track record of [Creative Achievement], I'm excited to bring my unique perspective to [Company].\n\nWhat sets me apart is my ability to [Unique Skill/Approach]. In my recent project at [Previous Company/Project], I [Creative Achievement with Impact]. This experience taught me that great design isn't just about aesthetics – it's about solving real problems and creating meaningful connections.\n\nI'm particularly excited about [Company]'s approach to [Specific Company Initiative]. Your recent [Campaign/Project/Product] resonated with me because [Personal Connection]. I believe my experience in [Relevant Skill] and passion for [Industry/Cause] would make me a valuable addition to your creative team.\n\nI'd love to show you how my creative vision can contribute to [Company]'s continued success. Let's chat!\n\nBest regards,\n[Your Name]",
      industry: ["Design", "Marketing", "Advertising", "Media", "Entertainment"],
      seoKeywords: ["creative cover letter", "design cover letter", "marketing application letter", "creative job application"]
    },
    {
      id: 2,
      name: "Tech Specialist",
      category: "tech",
      description: "Technical yet personable tone for technology and engineering roles",
      tone: "Technical & Clear",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      preview: "Dear [Hiring Manager],\n\nI'm excited to apply for the [Position] role at [Company]. Having worked extensively with [Technologies/Programming Languages] and successfully delivered [Technical Achievement], I'm eager to contribute to your engineering team's continued innovation.\n\nIn my current role, I've focused on [Technical Specialty] where I [Specific Technical Achievement with metrics]. My experience includes building scalable applications using [Tech Stack], optimizing system performance by [Performance Improvement], and leading the implementation of [Technical Initiative].\n\nWhat particularly interests me about [Company] is [Technical Aspect/Product/Challenge]. I've been following your work on [Specific Technology/Product] and am impressed by [Technical Innovation]. My background in [Relevant Technology] and experience with [Relevant Methodology] would allow me to make immediate contributions to your development efforts.\n\nI'm passionate about writing clean, efficient code and believe in the power of technology to solve complex problems. I'd welcome the opportunity to discuss how my technical skills and problem-solving approach can benefit [Company].\n\nLooking forward to connecting,\n[Your Name]",
      industry: ["Software", "Engineering", "IT", "Data Science", "Cybersecurity"],
      seoKeywords: ["tech cover letter", "software engineer cover letter", "technical application letter", "programming job application"]
    },
    {
      id: 3,
      name: "Sales & Business",
      category: "sales",
      description: "Results-driven tone highlighting achievements and metrics",
      tone: "Results-Driven & Confident",
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      popular: false,
      preview: "Dear [Hiring Manager],\n\nI'm thrilled to apply for the [Position] role at [Company]. With a proven track record of exceeding sales targets by [Percentage]% and generating over $[Amount] in revenue, I'm confident I can drive significant growth for your organization.\n\nIn my previous role as [Previous Position], I consistently ranked in the top [Percentage]% of sales performers by:\n• Developing and nurturing relationships with [Number] key accounts\n• Implementing strategic sales processes that increased conversion rates by [Percentage]%\n• Collaborating with cross-functional teams to deliver solutions that exceeded client expectations\n\nWhat excites me most about [Company] is [Business Opportunity/Market Position]. I believe my experience in [Relevant Industry/Market] and my ability to [Key Sales Skill] would be valuable assets as you continue to expand your market presence.\n\nI'm eager to bring my passion for building relationships and driving results to your sales team. Let's discuss how I can contribute to [Company]'s continued success.\n\nBest regards,\n[Your Name]",
      industry: ["Sales", "Business Development", "Account Management", "Real Estate"],
      seoKeywords: ["sales cover letter", "business development cover letter", "account manager application", "sales job application"]
    },
    {
      id: 4,
      name: "Healthcare Professional",
      category: "healthcare",
      description: "Compassionate and professional tone for medical and healthcare roles",
      tone: "Compassionate & Professional",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      popular: false,
      preview: "Dear Hiring Committee,\n\nI am writing to express my sincere interest in the [Position] role at [Healthcare Facility]. With [X years] of dedicated experience in [Medical Specialty] and a deep commitment to patient-centered care, I am excited about the opportunity to contribute to your healthcare team.\n\nThroughout my career, I have maintained a focus on [Healthcare Specialty/Area], where I have [Medical Achievement/Experience]. My approach to healthcare emphasizes [Patient Care Philosophy], and I take pride in [Specific Patient Care Achievement]. I am also committed to staying current with medical advances and hold certifications in [Relevant Certifications].\n\nI am particularly drawn to [Healthcare Facility] because of your reputation for [Specific Healthcare Focus/Excellence]. Your commitment to [Healthcare Initiative/Value] aligns perfectly with my own values and career goals. I am eager to contribute my clinical expertise and compassionate care approach to support your mission of providing exceptional patient outcomes.\n\nI would welcome the opportunity to discuss how my medical expertise and dedication to patient care can benefit your team and the patients we serve.\n\nSincerely,\n[Your Name]",
      industry: ["Healthcare", "Medical", "Nursing", "Therapy", "Pharmacy"],
      seoKeywords: ["healthcare cover letter", "medical cover letter", "nursing application letter", "healthcare job application"]
    },
    {
      id: 5,
      name: "Academic & Research",
      category: "academic",
      description: "Scholarly and detailed tone for academic and research positions",
      tone: "Scholarly & Detailed",
      color: "bg-gradient-to-br from-amber-600 to-yellow-600",
      popular: false,
      preview: "Dear Search Committee,\n\nI write to express my strong interest in the [Position] at [Institution]. My research in [Research Area] and publications in [Relevant Journals] align closely with your department's mission and research priorities.\n\nMy doctoral work focused on [Research Focus], where I [Research Achievement]. This research contributed to the field by [Research Impact/Contribution]. I have published [Number] peer-reviewed articles and presented my findings at [Number] conferences, including [Notable Conference].\n\nAs an educator, I am committed to fostering critical thinking and intellectual curiosity in students. My teaching philosophy centers on [Teaching Approach], and I have received positive evaluations for my courses in [Subject Areas]. I am particularly interested in developing curricula that [Educational Innovation/Approach].\n\nI am excited about the opportunity to contribute to [Institution]'s research excellence and educational mission. My research agenda for the next five years includes [Future Research Plans], which would complement your department's current research initiatives.\n\nI look forward to the opportunity to discuss my research and teaching contributions with you.\n\nSincerely,\n[Your Name], Ph.D.",
      industry: ["Academia", "Research", "Education", "Science", "Non-profit"],
      seoKeywords: ["academic cover letter", "research cover letter", "professor application letter", "academic job application"]
    },
    {
      id: 6,
      name: "Startup & Innovation",
      category: "startup",
      description: "Dynamic and entrepreneurial tone for startup and innovative companies",
      tone: "Dynamic & Entrepreneurial",
      color: "bg-gradient-to-br from-rose-500 to-pink-600",
      popular: false,
      preview: "Hi [Hiring Manager],\n\nI'm excited about the opportunity to join [Startup] as [Position]. Having thrived in fast-paced, innovative environments and successfully launched [Achievement/Project], I'm ready to help [Startup] disrupt [Industry] and achieve its ambitious goals.\n\nWhat draws me to startup life is the opportunity to wear multiple hats and make a real impact. In my previous role, I [Startup-relevant Achievement] while working with limited resources and tight deadlines. I'm comfortable with ambiguity, excel at rapid prototyping, and believe that failure is just another word for learning.\n\nI'm particularly excited about [Startup]'s approach to [Product/Service/Mission]. Your vision to [Company Vision/Goal] resonates with me because [Personal Connection]. I bring experience in [Relevant Skills] and a scrappy, get-things-done mentality that I believe would fit perfectly with your team culture.\n\nI'm ready to roll up my sleeves and help build something amazing. When can we chat about how I can contribute to [Startup]'s next growth phase?\n\nCheers,\n[Your Name]",
      industry: ["Startups", "Innovation", "Entrepreneurship", "Venture Capital"],
      seoKeywords: ["startup cover letter", "innovation cover letter", "entrepreneurial application letter", "startup job application"]
    }
  ];

  const handlePreview = (templateId: number) => {
    setPreviewTemplate(previewTemplate === templateId ? null : templateId);
  };

  const handleSelect = (templateId: number) => {
    onSelectTemplate(templateId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <FileText className="w-6 h-6" />
          Professional Cover Letter Templates
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from {templates.length} SEO-optimized cover letter templates tailored to different industries and tones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            {/* Template Header */}
            <div className={`h-24 ${template.color} relative`}>
              {template.popular && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500 text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Popular
                </Badge>
              )}
              
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-3 rounded flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm font-semibold">{template.name}</div>
                  <div className="text-xs opacity-80">{template.tone}</div>
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {template.name}
                {selectedTemplate === template.id && (
                  <Badge className="bg-blue-500 text-white">Selected</Badge>
                )}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tone Badge */}
              <Badge variant="outline" className="text-xs">
                {template.tone}
              </Badge>

              {/* Industry Tags */}
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Best for:</span>{' '}
                {template.industry.join(', ')}
              </div>

              {/* SEO Keywords */}
              <div className="text-xs text-gray-500">
                <span className="font-medium">SEO optimized for:</span>{' '}
                {template.seoKeywords.slice(0, 2).join(', ')}
              </div>

              {/* Preview Text */}
              {previewTemplate === template.id && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs max-h-48 overflow-y-auto">
                  <div className="font-medium mb-2">Preview:</div>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {template.preview}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template.id)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {previewTemplate === template.id ? 'Hide' : 'Preview'}
                </Button>
                <Button
                  onClick={() => handleSelect(template.id)}
                  className={`flex-1 ${
                    selectedTemplate === template.id
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SEO Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">✨ SEO-Optimized Templates</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our cover letter templates are optimized for Applicant Tracking Systems (ATS) and include 
            industry-specific keywords to improve your application's visibility and ranking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterTemplates;
