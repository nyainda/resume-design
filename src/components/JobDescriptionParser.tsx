
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, Wand2, Loader2, CheckCircle, Brain, Zap, Target, TrendingUp, Star, MapPin, DollarSign } from 'lucide-react';

interface JobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

interface SkillCategories {
  technical: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
    ai_ml: string[];
  };
  soft: {
    leadership: string[];
    communication: string[];
    analytical: string[];
    creative: string[];
    interpersonal: string[];
  };
  business: {
    management: string[];
    strategy: string[];
    analysis: string[];
    finance: string[];
    marketing: string[];
  };
}

const JobDescriptionParser: React.FC<JobDescriptionParserProps> = ({ 
  isOpen, 
  onClose, 
  onParsed 
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [useAI, setUseAI] = useState(true);

  const parseJobDescriptionWithGemini = async (description: string) => {
    try {
      // Get API key from localStorage or Settings
      const apiKey = localStorage.getItem('gemini_api_key') || 'AIzaSyBt35ykr0KCwAdIwYKlLzZRfkABak63AnE';
      
      if (!apiKey) {
        throw new Error('No Gemini API key found. Please add it in Settings.');
      }

      const prompt = `Analyze this job description and return a JSON object with the following structure:
{
  "jobTitle": "string",
  "company": "string", 
  "location": "string",
  "workType": "Remote|Hybrid|On-site",
  "experience": number,
  "salary": "string",
  "industry": "string",
  "jobLevel": "Entry Level|Mid Level|Senior Level|Executive",
  "skills": {
    "technical": {
      "programming": ["skill1", "skill2"],
      "frameworks": ["skill1", "skill2"],
      "databases": ["skill1", "skill2"],
      "cloud": ["skill1", "skill2"],
      "tools": ["skill1", "skill2"],
      "ai_ml": ["skill1", "skill2"]
    },
    "soft": {
      "leadership": ["skill1", "skill2"],
      "communication": ["skill1", "skill2"],
      "analytical": ["skill1", "skill2"],
      "creative": ["skill1", "skill2"],
      "interpersonal": ["skill1", "skill2"]
    },
    "business": {
      "management": ["skill1", "skill2"],
      "strategy": ["skill1", "skill2"],
      "analysis": ["skill1", "skill2"],
      "finance": ["skill1", "skill2"],
      "marketing": ["skill1", "skill2"]
    }
  },
  "requirements": ["req1", "req2"],
  "responsibilities": ["resp1", "resp2"],
  "benefits": ["benefit1", "benefit2"],
  "competitorAnalysis": {
    "similarCompanies": ["company1", "company2"],
    "averageSalary": "string",
    "marketDemand": "High|Medium|Low"
  },
  "careerGrowth": {
    "nextRoles": ["role1", "role2"],
    "skillsToLearn": ["skill1", "skill2"],
    "timeToPromotion": "string"
  },
  "atsOptimization": {
    "keywords": ["keyword1", "keyword2"],
    "phrases": ["phrase1", "phrase2"],
    "recommendations": ["rec1", "rec2"]
  }
}

Job Description:
${description}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsedResult = JSON.parse(jsonMatch[0]);
      
      return {
        ...parsedResult,
        source: 'Gemini AI',
        confidence: 0.95,
        enhancedFeatures: {
          aiAnalysis: true,
          competitorInsights: true,
          careerGrowthPlan: true,
          atsOptimization: true,
          skillCategorization: true
        }
      };
    } catch (error) {
      console.error('Gemini AI parsing failed:', error);
      throw error;
    }
  };

  const enhancedLocalParser = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced skill extraction with subcategories
    const skillCategories: SkillCategories = {
      technical: {
        programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'],
        frameworks: ['React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Next.js'],
        databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Oracle', 'SQLite', 'DynamoDB', 'Cassandra'],
        cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform'],
        tools: ['Git', 'SVN', 'Linux', 'Unix', 'Windows', 'macOS', 'Nginx', 'Apache', 'Figma', 'Sketch'],
        ai_ml: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'OpenAI', 'Hugging Face']
      },
      soft: {
        leadership: ['Leadership', 'Team Management', 'Project Management', 'Mentoring', 'Coaching'],
        communication: ['Communication', 'Presentation', 'Writing', 'Public Speaking', 'Documentation'],
        analytical: ['Analytical Thinking', 'Problem Solving', 'Critical Thinking', 'Data Analysis', 'Research'],
        creative: ['Creative Thinking', 'Innovation', 'Design Thinking', 'Brainstorming', 'Ideation'],
        interpersonal: ['Collaboration', 'Teamwork', 'Conflict Resolution', 'Negotiation', 'Empathy']
      },
      business: {
        management: ['Strategic Planning', 'Budget Management', 'Resource Planning', 'Risk Management'],
        strategy: ['Business Strategy', 'Market Analysis', 'Competitive Analysis', 'Growth Strategy'],
        analysis: ['Business Analysis', 'Market Research', 'Financial Analysis', 'Performance Analysis'],
        finance: ['Financial Planning', 'Budgeting', 'Forecasting', 'Investment Analysis', 'Cost Management'],
        marketing: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Brand Management']
      }
    };

    const extractedSkills: SkillCategories = {
      technical: {
        programming: [],
        frameworks: [],
        databases: [],
        cloud: [],
        tools: [],
        ai_ml: []
      },
      soft: {
        leadership: [],
        communication: [],
        analytical: [],
        creative: [],
        interpersonal: []
      },
      business: {
        management: [],
        strategy: [],
        analysis: [],
        finance: [],
        marketing: []
      }
    };

    // Extract skills by category and subcategory
    (Object.entries(skillCategories) as [keyof SkillCategories, any][]).forEach(([category, subcategories]) => {
      (Object.entries(subcategories) as [string, string[]][]).forEach(([subcategory, skills]) => {
        skills.forEach(skill => {
          if (lowerText.includes(skill.toLowerCase())) {
            const categoryKey = category as keyof SkillCategories;
            const subcategoryKey = subcategory as keyof SkillCategories[typeof categoryKey];
            (extractedSkills[categoryKey][subcategoryKey] as string[]).push(skill);
          }
        });
      });
    });

    // Extract job details with enhanced patterns
    const jobTitle = extractJobTitle(text) || '';
    const company = extractCompany(text) || '';
    const location = extractLocation(text) || '';
    const experience = extractExperience(text) || 0;
    const salary = extractSalary(text) || '';
    const benefits = extractBenefits(text) || [];
    const requirements = extractRequirements(text) || [];
    const responsibilities = extractResponsibilities(text) || [];
    
    const industry = detectIndustry(text) || 'General';
    const jobLevel = detectJobLevel(text) || 'Mid Level';
    const workType = detectWorkType(text) || 'On-site';
    
    const competitorAnalysis = generateCompetitorAnalysis(industry, jobTitle);
    const careerGrowth = generateCareerGrowthPlan(jobLevel, extractedSkills);
    const atsOptimization = generateATSOptimization(text, extractedSkills);

    return {
      jobTitle,
      company,
      location,
      experience,
      salary,
      benefits,
      industry,
      jobLevel,
      workType,
      skills: extractedSkills,
      requirements,
      responsibilities,
      competitorAnalysis,
      careerGrowth,
      atsOptimization,
      source: 'Enhanced Local',
      confidence: 0.85,
      enhancedFeatures: {
        skillCategorization: true,
        industryDetection: true,
        jobLevelAnalysis: true,
        salaryExtraction: true,
        benefitsAnalysis: true,
        competitorInsights: true,
        careerGrowthPlan: true,
        atsOptimization: true
      }
    };
  };

  // Helper functions for enhanced extraction
  const extractJobTitle = (text: string): string | null => {
    const patterns = [
      /(?:job title|position|role)[\s:]*([^\n.!?]+)/gi,
      /(?:seeking|looking for|hiring)(?:\s+a)?\s*([^\n.!?]+)/gi,
      /^([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator|Director|Lead))/m
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  };

  const extractCompany = (text: string): string | null => {
    const patterns = [
      /(?:company|organization|firm)[\s:]*([^\n.!?]+)/gi,
      /(?:at|with|for)[\s]+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions)?)/g
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  };

  const extractLocation = (text: string): string | null => {
    const patterns = [
      /(?:location|based in|office in)[\s:]*([^\n.!?]+)/gi,
      /([A-Z][a-z]+,\s*[A-Z]{2})/g,
      /(?:remote|hybrid|on-site)/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    return null;
  };

  const extractExperience = (text: string): number | null => {
    const patterns = [
      /(\d+)[\s]*(?:\+|\-)?[\s]*(?:years?|yrs?)[\s]*(?:of)?[\s]*(?:experience|exp)/gi,
      /(?:minimum|at least)[\s]*(\d+)[\s]*(?:years?|yrs?)/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }
    return null;
  };

  const extractSalary = (text: string): string | null => {
    const patterns = [
      /\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*per\s*year|\/year|annually)?/gi,
      /(?:salary|compensation)[\s:]*\$[\d,]+/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  };

  const extractBenefits = (text: string): string[] | null => {
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'sick leave', 'flexible hours', 'remote work',
      'professional development', 'training', 'tuition reimbursement',
      'gym membership', 'wellness program', 'stock options', 'equity'
    ];

    const found = [];
    for (const benefit of benefitKeywords) {
      if (text.toLowerCase().includes(benefit)) {
        found.push(benefit);
      }
    }
    return found.length > 0 ? found : null;
  };

  const extractRequirements = (text: string): string[] | null => {
    const requirementSection = text.match(/(?:requirements|qualifications)[\s:]*([^]*?)(?=\n(?:responsibilities|duties|benefits|$))/gi);
    if (requirementSection) {
      const requirements = requirementSection[0]
        .split(/\n/)
        .map(req => req.trim())
        .filter(req => req && req.length > 10)
        .slice(0, 8);
      return requirements.length > 0 ? requirements : null;
    }
    return null;
  };

  const extractResponsibilities = (text: string): string[] | null => {
    const responsibilitySection = text.match(/(?:responsibilities|duties|role)[\s:]*([^]*?)(?=\n(?:requirements|qualifications|benefits|$))/gi);
    if (responsibilitySection) {
      const responsibilities = responsibilitySection[0]
        .split(/\n/)
        .map(resp => resp.trim())
        .filter(resp => resp && resp.length > 10)
        .slice(0, 8);
      return responsibilities.length > 0 ? responsibilities : null;
    }
    return null;
  };

  const detectIndustry = (text: string): string | null => {
    const industries = {
      'Technology': ['software', 'tech', 'saas', 'ai', 'machine learning', 'cloud'],
      'Finance': ['financial', 'bank', 'fintech', 'investment', 'trading'],
      'Healthcare': ['health', 'medical', 'pharmaceutical', 'biotech'],
      'E-commerce': ['ecommerce', 'retail', 'marketplace', 'shopping'],
      'Education': ['education', 'university', 'school', 'learning'],
      'Marketing': ['marketing', 'advertising', 'digital marketing', 'seo']
    };

    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return industry;
      }
    }
    return null;
  };

  const detectJobLevel = (text: string): string | null => {
    const levels = {
      'Entry Level': ['entry', 'junior', 'associate', 'intern', '0-2 years'],
      'Mid Level': ['mid', 'intermediate', '3-5 years', 'experienced'],
      'Senior Level': ['senior', 'lead', '5+ years', 'expert'],
      'Executive': ['director', 'vp', 'executive', 'head of', 'chief']
    };

    for (const [level, keywords] of Object.entries(levels)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return level;
      }
    }
    return null;
  };

  const detectWorkType = (text: string): string | null => {
    if (text.toLowerCase().includes('remote')) return 'Remote';
    if (text.toLowerCase().includes('hybrid')) return 'Hybrid';
    return 'On-site';
  };

  const generateCompetitorAnalysis = (industry: string, jobTitle: string) => {
    const competitorData = {
      'Technology': {
        companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
        averageSalary: '$120,000 - $180,000',
        marketDemand: 'High'
      },
      'Finance': {
        companies: ['JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'Bank of America'],
        averageSalary: '$100,000 - $160,000',
        marketDemand: 'Medium'
      },
      'Healthcare': {
        companies: ['Johnson & Johnson', 'Pfizer', 'UnitedHealth', 'Merck'],
        averageSalary: '$85,000 - $140,000',
        marketDemand: 'High'
      }
    };

    const data = competitorData[industry as keyof typeof competitorData] || {
      companies: ['Industry Leader 1', 'Industry Leader 2', 'Industry Leader 3'],
      averageSalary: '$70,000 - $120,000',
      marketDemand: 'Medium'
    };

    return {
      similarCompanies: data.companies,
      averageSalary: data.averageSalary,
      marketDemand: data.marketDemand
    };
  };

  const generateCareerGrowthPlan = (jobLevel: string, skills: SkillCategories) => {
    const growthData = {
      'Entry Level': {
        nextRoles: ['Senior Developer', 'Team Lead', 'Technical Specialist'],
        skillsToLearn: ['Advanced Programming', 'System Design', 'Leadership'],
        timeToPromotion: '2-3 years'
      },
      'Mid Level': {
        nextRoles: ['Senior Manager', 'Principal Engineer', 'Director'],
        skillsToLearn: ['Strategic Planning', 'Team Management', 'Architecture'],
        timeToPromotion: '3-5 years'
      },
      'Senior Level': {
        nextRoles: ['VP of Engineering', 'CTO', 'Head of Product'],
        skillsToLearn: ['Executive Leadership', 'Business Strategy', 'Innovation'],
        timeToPromotion: '5-7 years'
      }
    };

    return growthData[jobLevel as keyof typeof growthData] || {
      nextRoles: ['Advanced Role', 'Leadership Position', 'Specialist Role'],
      skillsToLearn: ['Leadership', 'Strategic Thinking', 'Innovation'],
      timeToPromotion: '3-5 years'
    };
  };

  const generateATSOptimization = (text: string, skills: SkillCategories) => {
    const allSkills = [
      ...skills.technical.programming,
      ...skills.technical.frameworks,
      ...skills.soft.leadership,
      ...skills.business.management
    ];

    const keywords = allSkills.slice(0, 10);
    const phrases = [
      'results-driven professional',
      'proven track record',
      'cross-functional collaboration',
      'innovative solutions',
      'continuous improvement'
    ];

    const recommendations = [
      'Include specific metrics and achievements',
      'Use industry-standard keywords',
      'Format consistently with bullet points',
      'Include relevant certifications',
      'Optimize for keyword density'
    ];

    return { keywords, phrases, recommendations };
  };

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setParsing(true);
    try {
      let data;
      
      if (useAI) {
        try {
          data = await parseJobDescriptionWithGemini(jobDescription);
          toast.success('Job description analyzed with Gemini AI!');
        } catch (error) {
          console.error('AI parsing failed:', error);
          data = enhancedLocalParser(jobDescription);
          toast.success('Job description parsed with enhanced local analysis!');
        }
      } else {
        data = enhancedLocalParser(jobDescription);
        toast.success('Job description parsed with enhanced analysis!');
      }
      
      setParsedData(data);
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to parse job description');
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (parsedData) {
      onParsed(parsedData);
      onClose();
      toast.success('Job analysis applied to resume!');
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setParsedData(null);
  };

  const renderSkillsByCategory = (skills: SkillCategories) => {
    return (
      <div className="space-y-4">
        {(Object.entries(skills) as [keyof SkillCategories, any][]).map(([category, subcategories]) => (
          <div key={category}>
            <h5 className="font-medium text-sm mb-2 capitalize text-blue-600">{category} Skills:</h5>
            {(Object.entries(subcategories) as [string, string[]][]).map(([subcategory, skillList]) => {
              if (!skillList || !Array.isArray(skillList) || skillList.length === 0) return null;
              return (
                <div key={subcategory} className="mb-2">
                  <span className="text-xs font-medium text-gray-600 capitalize">{subcategory}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skillList.slice(0, 5).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Advanced AI Job Description Parser
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Gemini AI Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Paste Complete Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. Include requirements, skills, responsibilities, benefits, company info, and qualifications for best results..."
                className="min-h-[300px] text-sm"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useAI" className="text-sm font-medium flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Use Gemini AI Analysis (Advanced)
              </label>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={parseJobDescription} 
                disabled={parsing || !jobDescription.trim()}
                className="flex-1"
              >
                {parsing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {useAI ? 'AI Analyzing...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {useAI ? 'Gemini AI Parse' : 'Enhanced Parse'}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {parsedData ? (
              <>
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Job analyzed successfully with {parsedData.source}!
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((parsedData.confidence || 0.85) * 100)}% confidence
                  </Badge>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Job Level</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{parsedData.jobLevel || 'Not specified'}</p>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm">Industry</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{parsedData.industry || 'General'}</p>
                  </Card>

                  {parsedData.competitorAnalysis && (
                    <Card className="p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sm">Market Salary</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{parsedData.competitorAnalysis.averageSalary || 'Not available'}</p>
                    </Card>
                  )}

                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-sm">Work Type</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{parsedData.workType || 'On-site'}</p>
                  </Card>
                </div>

                {/* Main Content */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {parsedData.jobTitle && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Job Title</h4>
                        <p className="text-sm text-gray-700">{parsedData.jobTitle}</p>
                      </div>
                    )}

                    {parsedData.company && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Company</h4>
                        <p className="text-sm text-gray-700">{parsedData.company}</p>
                      </div>
                    )}

                    {parsedData.location && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Location & Work Type</h4>
                        <p className="text-sm text-gray-700">{parsedData.location} • {parsedData.workType}</p>
                      </div>
                    )}

                    {parsedData.experience && parsedData.experience > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Experience Required</h4>
                        <p className="text-sm text-gray-700">{parsedData.experience}+ years</p>
                      </div>
                    )}

                    {parsedData.salary && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Salary Range</h4>
                        <p className="text-sm text-gray-700">{parsedData.salary}</p>
                      </div>
                    )}

                    {parsedData.skills && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Skills Analysis</h4>
                        {renderSkillsByCategory(parsedData.skills)}
                      </div>
                    )}

                    {parsedData.competitorAnalysis && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Market Intelligence</h4>
                        <div className="bg-purple-50 p-3 rounded">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Similar Companies:</span>
                              <p>{Array.isArray(parsedData.competitorAnalysis.similarCompanies) ? parsedData.competitorAnalysis.similarCompanies.join(', ') : 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Market Demand:</span>
                              <Badge variant="outline" className="ml-1">
                                {parsedData.competitorAnalysis.marketDemand || 'Medium'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {parsedData.careerGrowth && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Career Growth Plan</h4>
                        <div className="bg-green-50 p-3 rounded text-xs space-y-2">
                          <div>
                            <span className="font-medium">Next Roles:</span>
                            <p>{Array.isArray(parsedData.careerGrowth.nextRoles) ? parsedData.careerGrowth.nextRoles.join(', ') : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Skills to Learn:</span>
                            <p>{Array.isArray(parsedData.careerGrowth.skillsToLearn) ? parsedData.careerGrowth.skillsToLearn.join(', ') : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Time to Promotion:</span>
                            <p>{parsedData.careerGrowth.timeToPromotion || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {parsedData.atsOptimization && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">ATS Optimization</h4>
                        <div className="bg-blue-50 p-3 rounded text-xs space-y-2">
                          <div>
                            <span className="font-medium">Key Keywords:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.isArray(parsedData.atsOptimization.keywords) ? parsedData.atsOptimization.keywords.slice(0, 6).map((keyword: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              )) : []}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Recommendations:</span>
                            <ul className="list-disc list-inside mt-1">
                              {Array.isArray(parsedData.atsOptimization.recommendations) ? parsedData.atsOptimization.recommendations.slice(0, 3).map((rec: string, index: number) => (
                                <li key={index}>{rec}</li>
                              )) : []}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {parsedData.benefits && Array.isArray(parsedData.benefits) && parsedData.benefits.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Benefits Detected</h4>
                        <div className="flex flex-wrap gap-1">
                          {parsedData.benefits.slice(0, 8).map((benefit: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsedData.enhancedFeatures && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Analysis Features Used</h4>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(parsedData.enhancedFeatures)
                            .filter(([, enabled]) => enabled)
                            .map(([feature]) => (
                            <Badge key={feature} variant="outline" className="text-xs bg-green-50 text-green-700">
                              <Star className="w-3 h-3 mr-1" />
                              {feature.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={handleApply} className="flex-1">
                    Apply Advanced Analysis to Resume
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Enter a job description and click "Parse" to extract enhanced insights</p>
                <p className="text-xs text-gray-400">
                  {useAI ? 'Gemini AI provides comprehensive analysis including market intelligence and career growth planning' : 'Enhanced local analysis with skill categorization and industry detection'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionParser;
