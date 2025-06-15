
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Brain, Wand2, Loader2, Sparkles, FileText, Code2, Target, ExternalLink, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

interface ProjectsFormEnhancedProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsFormEnhanced: React.FC<ProjectsFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [jobDescription, setJobDescription] = useState('');
  const [generatingProject, setGeneratingProject] = useState(false);
  const [enhancingId, setEnhancingId] = useState<number | null>(null);
  const [showJobInput, setShowJobInput] = useState(false);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: number, field: keyof Project, value: string) => {
    onChange(data.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id: number) => {
    onChange(data.filter(project => project.id !== id));
  };

  const generateProjectFromJob = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setGeneratingProject(true);
    try {
      const prompt = `Based on this job description: "${jobDescription}", create a comprehensive project that demonstrates the required skills with exactly 8 detailed bullet points.

      Requirements:
      - Generate a relevant project name that showcases key technologies from the job
      - Create exactly 8 detailed bullet points describing the project
      - Each bullet point should be 15-25 words long
      - Focus on technical implementation, challenges solved, and results achieved
      - Include specific technologies, frameworks, and tools mentioned in the job description
      - Show quantifiable results where possible (performance improvements, user metrics, etc.)
      - Demonstrate relevant skills like system design, problem-solving, collaboration
      - Use strong technical action verbs (Developed, Implemented, Architected, Optimized, etc.)
      
      Format as clean text, not JSON. Example format:
      Project Name: Advanced E-Commerce Platform with Real-Time Analytics
      Technologies: React, Node.js, MongoDB, AWS, Redis, Docker
      
      • Architected and developed full-stack e-commerce platform serving 50,000+ monthly active users with real-time inventory management
      • Implemented microservices architecture using Node.js and Docker, improving system scalability and reducing deployment time by 60%
      • Designed responsive React frontend with advanced search functionality, resulting in 40% increase in user engagement
      • Built real-time analytics dashboard using WebSockets and Redis, providing instant insights to business stakeholders
      • Integrated secure payment processing with Stripe API and implemented fraud detection algorithms reducing chargebacks by 35%
      • Optimized database queries and implemented caching strategies, achieving 70% faster page load times
      • Deployed application on AWS using CI/CD pipelines with automated testing, ensuring 99.9% uptime
      • Collaborated with UX team to implement accessibility features, achieving WCAG 2.1 AA compliance standards`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        // Parse the AI response to extract project name, technologies, and description
        const content = result.content.trim();
        const lines = content.split('\n').filter(line => line.trim());
        
        let projectName = 'AI Generated Project';
        let technologies = 'React, Node.js, MongoDB';
        let description = '';
        
        // Extract structured data from AI response
        lines.forEach(line => {
          if (line.includes('Project Name:')) {
            projectName = line.replace('Project Name:', '').trim();
          } else if (line.includes('Technologies:')) {
            technologies = line.replace('Technologies:', '').trim();
          } else if (line.startsWith('•')) {
            description += line + '\n';
          }
        });
        
        // If no structured format, use the entire content as description
        if (!description) {
          description = content;
        }
        
        const newProject: Project = {
          id: Date.now(),
          name: projectName,
          description: description.trim(),
          technologies: technologies,
          link: '',
          startDate: '',
          endDate: ''
        };
        
        onChange([...data, newProject]);
        toast.success('AI-generated project with 8 detailed points added!');
        setShowJobInput(false);
        setJobDescription('');
      }
    } catch (error: any) {
      console.error('AI project generation error:', error);
      toast.error('Failed to generate project. Please check your API key.');
    } finally {
      setGeneratingProject(false);
    }
  };

  const enhanceProjectDescription = async (projectId: number) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    const project = data.find(proj => proj.id === projectId);
    if (!project || !project.description.trim()) {
      toast.error('Please add a description first to enhance it');
      return;
    }

    setEnhancingId(projectId);
    try {
      const jobContext = jobDescription.trim() 
        ? `Target Job Description: ${jobDescription}\n\n` 
        : '';
      
      const prompt = `${jobContext}Enhance this project description to exactly 8 compelling bullet points: "${project.description}". 

      Requirements:
      - Create exactly 8 bullet points
      - Make each bullet point 15-25 words long
      - Use strong technical action verbs (Developed, Implemented, Architected, Optimized, etc.)
      - Include quantifiable achievements and technical metrics
      - Highlight relevant technologies and methodologies
      - Show problem-solving and technical challenges overcome
      - Demonstrate impact and results achieved
      ${jobDescription ? '- Align with the target job requirements and technologies' : ''}
      
      Format as bullet points with • symbol, one per line.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        updateProject(projectId, 'description', result.content.trim());
        toast.success('Project enhanced to 8 detailed bullet points!');
      }
    } catch (error: any) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance description. Please check your API key.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Code2 className="w-6 h-6" />
          Projects
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-3">
          <Button onClick={addProject} variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
          <Button
            onClick={() => setShowJobInput(!showJobInput)}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-green-700 hover:from-green-100 hover:to-blue-100"
          >
            <Target className="w-4 h-4 mr-2" />
            Generate from Job (8 Points)
          </Button>
        </div>

        {showJobInput && (
          <div className="p-6 border-2 border-dashed border-green-200 rounded-xl bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900 dark:text-green-300">AI Project Generator</h3>
                <Badge className="bg-green-100 text-green-800 text-xs">8 Detailed Points</Badge>
              </div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. The AI will analyze it and create a relevant project with 8 detailed technical bullet points..."
                className="min-h-[120px] border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              <Button
                onClick={generateProjectFromJob}
                disabled={generatingProject || !jobDescription.trim()}
                size="sm"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              >
                {generatingProject ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Project with 8 Points...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Relevant Project (8 Points)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {data.map((project, index) => (
          <Card key={project.id} className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Project Entry</h4>
                    {project.name && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => enhanceProjectDescription(project.id)}
                    disabled={enhancingId === project.id}
                    variant="outline"
                    size="sm"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    {enhancingId === project.id ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3 mr-1" />
                    )}
                    Enhance to 8 Points
                  </Button>
                  <Button
                    onClick={() => removeProject(project.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FileText className="w-4 h-4" />
                    Project Name *
                  </label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="e.g., E-Commerce Platform, Real-Time Chat App"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <ExternalLink className="w-4 h-4" />
                    Project Link
                  </label>
                  <Input
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={project.endDate}
                      onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                      placeholder="Present"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Code2 className="w-4 h-4" />
                    Technologies Used *
                  </label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB, AWS, Docker"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500">
                    Separate technologies with commas
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4" />
                  Project Description *
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    8 Points Recommended
                  </Badge>
                </label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="• Architected and developed full-stack e-commerce platform serving 50,000+ monthly active users&#10;• Implemented microservices architecture using Node.js and Docker, improving scalability by 60%&#10;• Designed responsive React frontend with advanced search, increasing user engagement by 40%&#10;• Built real-time analytics dashboard using WebSockets and Redis for instant insights&#10;• Integrated secure payment processing with Stripe API, reducing chargebacks by 35%&#10;• Optimized database queries and caching strategies, achieving 70% faster load times&#10;• Deployed on AWS using CI/CD pipelines with automated testing, ensuring 99.9% uptime&#10;• Collaborated with UX team implementing accessibility features, achieving WCAG 2.1 compliance"
                  className="min-h-[200px] border-gray-300 focus:border-green-500 focus:ring-green-500 font-mono text-sm"
                />
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <strong>💡 Pro Tips:</strong> Use bullet points (•) for better readability • Include 8 detailed technical points • 
                    Focus on implementation details • Add quantifiable results • Use "Generate from Job" or "Enhance" for AI assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="mb-4">Add your first project or generate one from a job description with 8 detailed points.</p>
            <Button onClick={() => setShowJobInput(true)} variant="outline" className="border-green-200 text-green-700">
              <Target className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsFormEnhanced;
