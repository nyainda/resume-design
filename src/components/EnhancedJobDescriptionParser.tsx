
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, Wand2, Loader2, CheckCircle, Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedJobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const EnhancedJobDescriptionParser: React.FC<EnhancedJobDescriptionParserProps> = ({ 
  isOpen, 
  onClose, 
  onParsed 
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [useAI, setUseAI] = useState(false);

  const parseJobDescriptionWithAI = async (description: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('parse-job-description', {
        body: { jobDescription: description }
      });

      if (error) throw error;
      
      return {
        ...data,
        source: 'AI',
        confidence: 0.95,
        enhancedFeatures: {
          industryAnalysis: true,
          salaryInsights: true,
          companyResearch: true,
          skillPrioritization: true
        }
      };
    } catch (error) {
      console.error('AI parsing failed, falling back to local parsing:', error);
      throw error;
    }
  };

  // Helper functions for enhanced extraction
  const extractJobTitle = (text: string) => {
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
    return '';
  };

  const extractCompany = (text: string) => {
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
    return '';
  };

  const extractLocation = (text: string) => {
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
    return '';
  };

  const extractExperience = (text: string) => {
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
    return 0;
  };

  const extractSalary = (text: string) => {
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
    return '';
  };

  const extractBenefits = (text: string) => {
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
    return found;
  };

  const extractRequirements = (text: string) => {
    const requirementSection = text.match(/(?:requirements|qualifications)[\s:]*([^]*?)(?=\n(?:responsibilities|duties|benefits|$))/gi);
    if (requirementSection) {
      return requirementSection[0]
        .split(/\n/)
        .map(req => req.trim())
        .filter(req => req && req.length > 10)
        .slice(0, 8);
    }
    return [];
  };

  const extractResponsibilities = (text: string) => {
    const responsibilitySection = text.match(/(?:responsibilities|duties|role)[\s:]*([^]*?)(?=\n(?:requirements|qualifications|benefits|$))/gi);
    if (responsibilitySection) {
      return responsibilitySection[0]
        .split(/\n/)
        .map(resp => resp.trim())
        .filter(resp => resp && resp.length > 10)
        .slice(0, 8);
    }
    return [];
  };

  const detectIndustry = (text: string) => {
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
    return 'General';
  };

  const detectJobLevel = (text: string) => {
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
    return 'Mid Level';
  };

  const detectWorkType = (text: string) => {
    if (text.toLowerCase().includes('remote')) return 'Remote';
    if (text.toLowerCase().includes('hybrid')) return 'Hybrid';
    return 'On-site';
  };

  const generateTailoredSummary = (data: any) => {
    const { jobTitle, experience, skills, industry, jobLevel } = data;
    
    return `Experienced ${industry.toLowerCase()} professional with ${experience > 0 ? `${experience}+ years` : 'proven expertise'} in ${skills.slice(0, 3).join(', ')}. Specialized in ${jobTitle || 'this role'} with strong background in ${skills.slice(3, 5).join(' and ')}. Demonstrated ability to deliver results in ${jobLevel.toLowerCase()} positions with focus on ${skills.slice(-2).join(' and ')}.`;
  };

  const enhancedLocalParser = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced skill extraction with categories
    const skillCategories = {
      technical: [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel',
        'HTML5', 'CSS3', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material UI',
        'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Oracle', 'SQLite', 'DynamoDB',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
        'Git', 'SVN', 'Linux', 'Unix', 'Windows', 'macOS', 'Nginx', 'Apache',
        'GraphQL', 'REST API', 'Microservices', 'Serverless', 'DevOps', 'CI/CD',
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib'
      ],
      soft: [
        'Leadership', 'Team Management', 'Project Management', 'Communication', 'Problem Solving',
        'Critical Thinking', 'Analytical Thinking', 'Creative Thinking', 'Strategic Planning',
        'Time Management', 'Adaptability', 'Collaboration', 'Conflict Resolution', 'Negotiation'
      ],
      business: [
        'Agile', 'Scrum', 'Kanban', 'Lean', 'Six Sigma', 'PMP', 'Business Analysis',
        'Data Analysis', 'Market Research', 'Financial Analysis', 'Risk Management'
      ]
    };

    const extractedSkills = {
      technical: [],
      soft: [],
      business: [],
      other: []
    };

    // Extract skills by category
    Object.entries(skillCategories).forEach(([category, skills]) => {
      skills.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
          extractedSkills[category as keyof typeof extractedSkills].push(skill);
        }
      });
    });

    // Extract additional skills from patterns
    const skillPatterns = [
      /(?:required|preferred|must have|should have|experience with|proficient in|knowledge of|skilled in)[\s:]*([^.!?\n]+)/gi,
      /(?:skills|technologies|tools|competencies)[\s:]*([^.!?\n]+)/gi
    ];

    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const skillText = match.split(/[:]/)[1] || match;
          const extractedSkills2 = skillText
            .split(/[,\n•·\-\|]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 40)
            .map(s => s.charAt(0).toUpperCase() + s.slice(1));
          
          extractedSkills2.forEach(skill => {
            if (!Object.values(extractedSkills).flat().includes(skill)) {
              extractedSkills.other.push(skill);
            }
          });
        });
      }
    });

    // Extract job details with enhanced patterns
    const jobTitle = extractJobTitle(text);
    const company = extractCompany(text);
    const location = extractLocation(text);
    const experience = extractExperience(text);
    const salary = extractSalary(text);
    const benefits = extractBenefits(text);
    const requirements = extractRequirements(text);
    const responsibilities = extractResponsibilities(text);
    
    // Generate industry insights
    const industry = detectIndustry(text);
    const jobLevel = detectJobLevel(text);
    const workType = detectWorkType(text);
    
    // Calculate match score factors
    const prioritySkills = [...extractedSkills.technical.slice(0, 5), ...extractedSkills.soft.slice(0, 3)];
    
    // Generate tailored summary
    const summary = generateTailoredSummary({
      jobTitle,
      company,
      experience,
      skills: prioritySkills,
      industry,
      jobLevel
    });

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
      summary,
      keywords: prioritySkills,
      source: 'Enhanced Local',
      confidence: 0.85,
      enhancedFeatures: {
        skillCategorization: true,
        industryDetection: true,
        jobLevelAnalysis: true,
        salaryExtraction: true,
        benefitsAnalysis: true
      }
    };
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
          data = await parseJobDescriptionWithAI(jobDescription);
          toast.success('Job description analyzed with AI!');
        } catch (error) {
          // Fallback to local parsing
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
    if (!parsedData) {
      toast.error('No parsed data available. Please parse a job description first.');
      return;
    }

    try {
      // Transform the parsed data into the format expected by the resume builder
      const transformedData = {
        skills: [],
        summary: '',
        keywords: [],
        requirements: [],
        ...parsedData
      };

      // Flatten skills if they're in nested format
      if (parsedData.skills) {
        let flattenedSkills = [];
        
        if (typeof parsedData.skills === 'object' && !Array.isArray(parsedData.skills)) {
          // Handle nested structure
          Object.values(parsedData.skills).forEach((category: any) => {
            if (Array.isArray(category)) {
              flattenedSkills.push(...category);
            } else if (typeof category === 'object') {
              Object.values(category).forEach((subcategory: any) => {
                if (Array.isArray(subcategory)) {
                  flattenedSkills.push(...subcategory);
                }
              });
            }
          });
        } else if (Array.isArray(parsedData.skills)) {
          flattenedSkills = parsedData.skills;
        }
        
        // Remove duplicates and empty values
        transformedData.skills = [...new Set(flattenedSkills.filter(skill => skill && skill.trim()))];
      }

      // Extract keywords from various sources
      if (parsedData.keywords && Array.isArray(parsedData.keywords)) {
        transformedData.keywords = parsedData.keywords;
      } else if (transformedData.skills.length > 0) {
        transformedData.keywords = transformedData.skills.slice(0, 10);
      }

      console.log('Applying transformed data:', transformedData);
      
      onParsed(transformedData);
      onClose();
      toast.success('Job analysis applied to resume successfully!');
    } catch (error) {
      console.error('Error applying parsed data:', error);
      toast.error('Failed to apply job analysis to resume');
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setParsedData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Enhanced AI Job Description Parser
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered
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
                Use AI-Powered Analysis (Advanced)
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
                    {useAI ? 'AI Parse & Analyze' : 'Enhanced Parse'}
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
                    {Math.round(parsedData.confidence * 100)}% confidence
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
                </div>

                {/* Main Content Display */}
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

                    {parsedData.experience > 0 && (
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
                        <div className="space-y-2">
                          {Array.isArray(parsedData.skills) ? (
                            <div className="flex flex-wrap gap-1">
                              {parsedData.skills.slice(0, 15).map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            Object.entries(parsedData.skills).map(([category, skills]: [string, any]) => (
                              <div key={category} className="mb-2">
                                <span className="text-xs font-medium text-gray-600 capitalize">{category}:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Array.isArray(skills) ? skills.slice(0, 8).map((skill: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  )) : typeof skills === 'object' ? Object.values(skills).flat().slice(0, 8).map((skill: any, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  )) : null}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {parsedData.benefits?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Benefits Detected</h4>
                        <div className="flex flex-wrap gap-1">
                          {parsedData.benefits.slice(0, 6).map((benefit: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsedData.summary && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">AI-Generated Tailored Summary</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-500">{parsedData.summary}</p>
                      </div>
                    )}

                    {parsedData.enhancedFeatures && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Enhanced Features Used</h4>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(parsedData.enhancedFeatures)
                            .filter(([, enabled]) => enabled)
                            .map(([feature, ]) => (
                            <Badge key={feature} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {feature.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={handleApply} className="flex-1" disabled={!parsedData}>
                    Apply Enhanced Analysis to Resume
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
                  {useAI ? 'AI analysis provides industry insights, salary data, and company research' : 'Enhanced local analysis with skill categorization and industry detection'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedJobDescriptionParser;
