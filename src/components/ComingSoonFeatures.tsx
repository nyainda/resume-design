
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Globe, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Shield,
  Zap,
  Users,
  Video,
  BarChart3,
  Target
} from 'lucide-react';

const ComingSoonFeatures: React.FC = () => {
  const upcomingFeatures = [
    {
      icon: Brain,
      title: 'AI Resume Writer',
      description: 'Generate entire resume sections using advanced AI based on job descriptions',
      category: 'AI Powered',
      eta: 'Q1 2024',
      priority: 'high'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Create resumes in 15+ languages with localized formatting',
      category: 'Internationalization',
      eta: 'Q2 2024',
      priority: 'medium'
    },
    {
      icon: Video,
      title: 'Video Resume Builder',
      description: 'Create compelling video introductions and portfolio showcases',
      category: 'Media',
      eta: 'Q2 2024',
      priority: 'medium'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Collaboration',
      description: 'Share and collaborate on resumes with mentors and career coaches',
      category: 'Collaboration',
      eta: 'Q1 2024',
      priority: 'high'
    },
    {
      icon: TrendingUp,
      title: 'Career Path Analyzer',
      description: 'AI-powered career progression suggestions based on market trends',
      category: 'Career Intelligence',
      eta: 'Q3 2024',
      priority: 'high'
    },
    {
      icon: Calendar,
      title: 'Interview Scheduler',
      description: 'Integrated calendar with automatic interview scheduling and reminders',
      category: 'Productivity',
      eta: 'Q2 2024',
      priority: 'medium'
    },
    {
      icon: Shield,
      title: 'Advanced Privacy Controls',
      description: 'Granular privacy settings and secure resume sharing options',
      category: 'Security',
      eta: 'Q1 2024',
      priority: 'medium'
    },
    {
      icon: BarChart3,
      title: 'Application Tracking',
      description: 'Track job applications, responses, and interview outcomes',
      category: 'Analytics',
      eta: 'Q2 2024',
      priority: 'high'
    },
    {
      icon: Users,
      title: 'Networking Hub',
      description: 'Connect with industry professionals and get resume feedback',
      category: 'Community',
      eta: 'Q3 2024',
      priority: 'medium'
    },
    {
      icon: Target,
      title: 'Smart Job Matching',
      description: 'AI matches your resume with relevant job openings automatically',
      category: 'Job Search',
      eta: 'Q1 2024',
      priority: 'high'
    },
    {
      icon: Zap,
      title: 'Resume Optimizer',
      description: 'Real-time ATS score improvements and keyword optimization',
      category: 'AI Powered',
      eta: 'Q1 2024',
      priority: 'high'
    },
    {
      icon: Sparkles,
      title: 'Dynamic Templates',
      description: 'Interactive resume templates with animations and micro-interactions',
      category: 'Design',
      eta: 'Q3 2024',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI Powered': 'bg-purple-100 text-purple-800',
      'Internationalization': 'bg-blue-100 text-blue-800',
      'Media': 'bg-pink-100 text-pink-800',
      'Collaboration': 'bg-indigo-100 text-indigo-800',
      'Career Intelligence': 'bg-emerald-100 text-emerald-800',
      'Productivity': 'bg-orange-100 text-orange-800',
      'Security': 'bg-red-100 text-red-800',
      'Analytics': 'bg-cyan-100 text-cyan-800',
      'Community': 'bg-violet-100 text-violet-800',
      'Job Search': 'bg-teal-100 text-teal-800',
      'Design': 'bg-rose-100 text-rose-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Coming Soon Features
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We're constantly innovating to bring you the most advanced resume building experience. 
          Here's what's in our development pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent opacity-50" />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getCategoryColor(feature.category)} variant="secondary">
                    {feature.category}
                  </Badge>
                  <Badge className={getPriorityColor(feature.priority)} variant="secondary">
                    {feature.priority} priority
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    ETA: {feature.eta}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    In Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Want to Shape Our Roadmap?
            </h3>
            <p className="text-gray-600 mb-4">
              Have ideas for features you'd love to see? We're always listening to our community!
            </p>
            <div className="flex justify-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                📧 feedback@resumebuilder.com
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                💬 Join our Discord
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonFeatures;
