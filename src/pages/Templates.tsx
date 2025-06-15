
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Eye, Download, Star, Zap } from 'lucide-react';

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-xl">
          <CardTitle className="mb-4 text-2xl">Authentication Required</CardTitle>
          <p className="text-gray-600 mb-6">Please sign in to browse our premium templates.</p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      description: 'Clean and modern design perfect for tech and business roles',
      category: 'Professional',
      rating: 4.9,
      downloads: '12.5k',
      featured: true
    },
    {
      id: 2,
      name: 'Executive Leadership',
      description: 'Sophisticated layout ideal for senior management positions',
      category: 'Executive',
      rating: 4.8,
      downloads: '8.2k',
      featured: true
    },
    {
      id: 3,
      name: 'Creative Designer',
      description: 'Bold and creative template for design professionals',
      category: 'Creative',
      rating: 4.7,
      downloads: '6.8k',
      featured: false
    },
    {
      id: 4,
      name: 'Tech Specialist',
      description: 'Optimized for software engineers and IT professionals',
      category: 'Technology',
      rating: 4.9,
      downloads: '15.3k',
      featured: true
    },
    {
      id: 5,
      name: 'Minimalist',
      description: 'Simple and elegant design that works for any industry',
      category: 'Minimalist',
      rating: 4.6,
      downloads: '9.1k',
      featured: false
    },
    {
      id: 6,
      name: 'Two Column',
      description: 'Efficient layout that maximizes space utilization',
      category: 'Professional',
      rating: 4.8,
      downloads: '11.7k',
      featured: false
    }
  ];

  const categories = ['All', 'Professional', 'Executive', 'Creative', 'Technology', 'Minimalist'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Premium Templates
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose from our professionally designed resume templates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.filter(t => t.featured).map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 m-4 rounded shadow-lg flex flex-col p-3">
                      <div className="h-2 bg-blue-600 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {template.rating}
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {template.downloads} downloads
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => navigate('/builder')}>
                      <Zap className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            All Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 m-3 rounded shadow flex flex-col p-2">
                      <div className="h-1.5 bg-blue-600 rounded mb-1.5"></div>
                      <div className="space-y-0.5">
                        <div className="h-0.5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-0.5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {template.rating}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {template.downloads}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 text-xs h-8" onClick={() => navigate('/builder')}>
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
