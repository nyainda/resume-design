
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp,
  Building,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Bookmark,
  BookmarkCheck,
  Database,
  AlertCircle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  url: string;
}

interface JobResultsSectionProps {
  jobs: Job[];
  totalJobs: number;
  dataSources: string[];
  savedJobs: Set<string>;
  onSaveJob: (job: Job) => void;
  getTimeAgo: (dateString: string) => string;
  getDataSourceIcon: () => React.ReactElement;
  getDataSourceText: () => string;
  getSourceBadgeColor: (source: string) => string;
  cleanDescription: (description: string) => string;
}

const JobResultsSection: React.FC<JobResultsSectionProps> = ({
  jobs,
  totalJobs,
  dataSources,
  savedJobs,
  onSaveJob,
  getTimeAgo,
  getDataSourceIcon,
  getDataSourceText,
  getSourceBadgeColor,
  cleanDescription
}) => {
  if (totalJobs === 0) return null;

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            Job Results
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {totalJobs} found
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {getDataSourceIcon()}
              {getDataSourceText()}
            </div>
          </div>
        </div>
        {dataSources.length > 1 && (
          <CardDescription className="dark:text-gray-400">
            Results from: {dataSources.filter(s => s !== 'Mock').join(', ')}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[700px]">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      {/* Company Logo/Initial */}
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                        {job.company[0]?.toUpperCase() || 'C'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Job Title and Source */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          {(job as any).source && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${getSourceBadgeColor((job as any).source)}`}
                            >
                              {(job as any).source}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Company and Location */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>{getTimeAgo(job.posted)}</span>
                          </div>
                          {job.salary && job.salary !== 'Salary not specified' && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="font-medium text-green-700 dark:text-green-400">{job.salary}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                          {cleanDescription(job.description)}
                        </p>
                        
                        {/* Requirements/Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.remote && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 font-medium">
                              <Globe className="w-3 h-3 mr-1" />
                              Remote
                            </Badge>
                          )}
                          {job.requirements.slice(0, 5).map((req, reqIndex) => (
                            <Badge 
                              key={reqIndex} 
                              variant="outline" 
                              className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 transition-colors"
                            >
                              {req}
                            </Badge>
                          ))}
                          {job.requirements.length > 5 && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                              +{job.requirements.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 ml-4">
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 shadow-sm"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                      onClick={() => onSaveJob(job)}
                    >
                      {savedJobs.has(job.id) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      {savedJobs.has(job.id) ? 'Saved' : 'Save Job'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default JobResultsSection;
