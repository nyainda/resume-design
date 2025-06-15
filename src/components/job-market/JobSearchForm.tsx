
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface JobSearchFormProps {
  searchQuery: string;
  location: string;
  remoteOnly: boolean;
  loading: boolean;
  onSearchQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onRemoteOnlyChange: (value: boolean) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({
  searchQuery,
  location,
  remoteOnly,
  loading,
  onSearchQueryChange,
  onLocationChange,
  onRemoteOnlyChange,
  onSearch,
  onKeyPress
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
          <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Search Jobs
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Search across multiple job boards including LinkedIn, Indeed, RemoteOK, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="job-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Title or Keywords
              </Label>
              <Input
                id="job-search"
                placeholder="e.g. Software Engineer, Product Manager, Designer"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onKeyPress={onKeyPress}
                className="mt-2 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="location-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </Label>
              <Input
                id="location-search"
                placeholder="e.g. New York, San Francisco, or leave empty"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                onKeyPress={onKeyPress}
                className="mt-2 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Switch
                id="remote-only"
                checked={remoteOnly}
                onCheckedChange={onRemoteOnlyChange}
              />
              <Label htmlFor="remote-only" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Remote jobs only
              </Label>
            </div>
            
            <Button 
              onClick={onSearch} 
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-11"
              size="lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSearchForm;
