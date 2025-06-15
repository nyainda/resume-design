
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, AlertCircle } from 'lucide-react';

interface JobMarketHeaderProps {
  dataSources: string[];
  totalJobs: number;
}

const JobMarketHeader: React.FC<JobMarketHeaderProps> = ({ dataSources, totalJobs }) => {
  return (
    <>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="w-8 h-8" />
            Job Market
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Search jobs from LinkedIn, Indeed, RemoteOK, and more sources
          </CardDescription>
        </CardHeader>
      </Card>

      {/* API Configuration Notice */}
      {dataSources.includes('Mock') && totalJobs > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Using Sample Data</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Configure API keys in Settings to access live job listings from multiple job boards including LinkedIn, Indeed, and specialized remote job sites.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default JobMarketHeader;
