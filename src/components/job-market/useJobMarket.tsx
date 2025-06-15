import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe, Database, AlertCircle } from 'lucide-react';

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

interface JobResponse {
  jobs: Job[];
  total: number;
  query: string;
  location: string;
  remote: boolean;
  sources?: string[];
  source?: string;
}

export const useJobMarket = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [savedJobsData, setSavedJobsData] = useState<{[id: string]: Job}>({});

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
    const savedDataRaw = localStorage.getItem('savedJobsData');
    if (savedDataRaw) {
      setSavedJobsData(JSON.parse(savedDataRaw));
    }
  }, []);

  // Update savedJobsData if jobs are unsaved elsewhere
  useEffect(() => {
    const savedDataRaw = localStorage.getItem('savedJobsData');
    if (savedDataRaw) {
      setSavedJobsData(JSON.parse(savedDataRaw));
    }
  }, [savedJobs]);

  const searchJobs = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-market-api', {
        body: {
          query: searchQuery,
          location: location,
          remote: remoteOnly,
          limit: 25
        }
      });

      if (error) throw error;

      const response: JobResponse = data;
      let jobResults = response.jobs || [];
      
      // Sort jobs by posted date (latest first)
      jobResults.sort((a, b) => {
        const dateA = new Date(a.posted).getTime();
        const dateB = new Date(b.posted).getTime();
        return dateB - dateA; // Latest first
      });
      
      setJobs(jobResults);
      setTotalJobs(response.total || 0);
      setDataSources(response.sources || []);
      
      if (jobResults.length === 0) {
        toast.info('No jobs found matching your criteria. Try different keywords or remove location filters.');
      } else {
        const sourcesList = response.sources?.join(', ') || 'unknown sources';
        const message = response.sources?.includes('Mock') 
          ? `Found ${jobResults.length} sample jobs. Add API keys in Settings for live data.`
          : `Found ${jobResults.length} live jobs from ${sourcesList}!`;
        toast.success(message);
      }
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search jobs. Please try again.');
      setJobs([]);
      setTotalJobs(0);
      setDataSources([]);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = (job: Job) => {
    const newSavedJobs = new Set(savedJobs);
    const newSavedJobsData = { ...savedJobsData };

    if (savedJobs.has(job.id)) {
      newSavedJobs.delete(job.id);
      delete newSavedJobsData[job.id];
      toast.success('Job removed from saved jobs');
    } else {
      newSavedJobs.add(job.id);
      newSavedJobsData[job.id] = job;
      toast.success('Job saved successfully!');
    }

    setSavedJobs(newSavedJobs);
    setSavedJobsData(newSavedJobsData);
    localStorage.setItem('savedJobs', JSON.stringify(Array.from(newSavedJobs)));
    localStorage.setItem('savedJobsData', JSON.stringify(newSavedJobsData));
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchJobs();
    }
  };

  const getDataSourceIcon = () => {
    if (dataSources.includes('JSearch') || dataSources.includes('RemoteOK') || dataSources.includes('Adzuna')) {
      return <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
    if (dataSources.includes('Mock')) {
      return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
    return <Database className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  };

  const getDataSourceText = () => {
    if (dataSources.length > 1 && !dataSources.includes('Mock')) {
      return `Live data from ${dataSources.length} sources`;
    }
    if (dataSources.includes('JSearch')) return 'Live data (Indeed, LinkedIn)';
    if (dataSources.includes('RemoteOK')) return 'Live remote jobs';
    if (dataSources.includes('Adzuna')) return 'Live job data';
    if (dataSources.includes('Mock')) return 'Sample data';
    return 'Job data';
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'JSearch (Indeed/LinkedIn)':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'RemoteOK':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'Adzuna':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
      case 'Mock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const cleanDescription = (description: string) => {
    // Remove HTML tags and clean up the description
    return description
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  return {
    jobs,
    loading,
    searchQuery,
    location,
    remoteOnly,
    totalJobs,
    dataSources,
    savedJobs,
    savedJobsData,
    setSearchQuery,
    setLocation,
    setRemoteOnly,
    searchJobs,
    saveJob,
    getTimeAgo,
    handleKeyPress,
    getDataSourceIcon,
    getDataSourceText,
    getSourceBadgeColor,
    cleanDescription
  };
};
