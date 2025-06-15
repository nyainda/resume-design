
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookmarkCheck, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Globe
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

interface SavedJobsSectionProps {
  savedJobsData: {[id: string]: Job};
  onSaveJob: (job: Job) => void;
  getTimeAgo: (dateString: string) => string;
  cleanDescription: (description: string) => string;
}

const SavedJobsSection: React.FC<SavedJobsSectionProps> = ({
  savedJobsData,
  onSaveJob,
  getTimeAgo,
  cleanDescription
}) => {
  if (Object.keys(savedJobsData).length === 0) return null;

  return (
    <Card className="shadow-lg bg-white dark:bg-gray-900 dark:border-gray-800 border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
          <BookmarkCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Saved Jobs
          <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {Object.keys(savedJobsData).length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Jobs you have saved will stay here even after you leave or refresh this page.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {Object.values(savedJobsData).map((job) => (
              <div key={job.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg">
                    {job.company[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
                      <span className="flex items-center gap-1"><Building className="w-4 h-4" />{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{getTimeAgo(job.posted)}</span>
                      {job.salary && job.salary !== 'Salary not specified' && (
                        <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
                          <DollarSign className="w-4 h-4" />{job.salary}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed line-clamp-2">
                      {cleanDescription(job.description)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.remote && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 font-medium">
                          <Globe className="w-3 h-3 mr-1" />
                          Remote
                        </Badge>
                      )}
                      {job.requirements.slice(0, 3).map((req, reqIndex) => (
                        <Badge key={reqIndex} variant="outline" className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 transition-colors">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 3 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                          +{job.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 shadow-sm"
                    onClick={() => window.open(job.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                    onClick={() => onSaveJob(job)}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    Unsave
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedJobsSection;
