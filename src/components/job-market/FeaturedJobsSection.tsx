
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Globe } from 'lucide-react';

const FeaturedJobsSection: React.FC = () => {
  const featuredJobs = [
    {
      title: 'Senior React Developer',
      company: 'Remote Tech Co',
      location: 'Remote Worldwide',
      salary: '$120K - $160K',
      remote: true
    },
    {
      title: 'Product Manager',
      company: 'Global Startup',
      location: 'Remote (US/EU)',
      salary: '$110K - $150K',
      remote: true
    },
    {
      title: 'UI/UX Designer',
      company: 'Design Agency',
      location: 'Remote',
      salary: '$90K - $130K',
      remote: true
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
          <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          Featured Remote Opportunities
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Hand-picked remote and hybrid positions from top companies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job, index) => (
            <Card key={index} className="border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer hover:shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 dark:border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                    {job.company[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{job.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">{job.company}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <Globe className="w-3 h-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">{job.salary}</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs border-green-200 dark:border-green-700">
                        <Globe className="w-3 h-3 mr-1" />
                        Remote
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedJobsSection;
