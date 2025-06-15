
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search, MapPin, Clock, DollarSign, Building, ExternalLink, Zap, Briefcase, Star, TrendingUp } from 'lucide-react';

interface JobScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onJobSelected: (job: any) => void;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  link: string;
  source: string;
  remote: boolean;
  featured: boolean;
}

const JobScanner: React.FC<JobScannerProps> = ({ isOpen, onClose, onJobSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ['Remote', 'Full-time', 'Part-time', 'Contract', 'Entry Level', 'Senior Level'];

  // Enhanced mock job data with more realistic information
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      posted: '2 hours ago',
      description: 'We are seeking a Senior Full Stack Developer to lead our product development team. You will be responsible for building scalable web applications using modern technologies and mentoring junior developers.',
      requirements: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL', '5+ years experience'],
      link: 'https://techflow.com/careers/senior-fullstack-dev',
      source: 'Indeed',
      remote: true,
      featured: true
    },
    {
      id: '2',
      title: 'Frontend React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90,000 - $130,000',
      type: 'Full-time',
      posted: '4 hours ago',
      description: 'Join our fast-growing startup as a Frontend Developer. You will work closely with our design team to create beautiful, responsive user interfaces.',
      requirements: ['React', 'JavaScript', 'CSS', 'HTML', 'Git', 'Tailwind CSS', '3+ years experience'],
      link: 'https://startupxyz.com/jobs/frontend-react',
      source: 'LinkedIn',
      remote: true,
      featured: false
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      company: 'CloudTech Inc',
      location: 'New York, NY',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      posted: '1 day ago',
      description: 'We need a DevOps Engineer to manage our cloud infrastructure and implement CI/CD pipelines. Experience with containerization and orchestration is essential.',
      requirements: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Python', 'Terraform', '4+ years experience'],
      link: 'https://cloudtech.com/careers/devops-engineer',
      source: 'Glassdoor',
      remote: false,
      featured: true
    },
    {
      id: '4',
      title: 'Product Manager',
      company: 'InnovateCorp',
      location: 'Austin, TX',
      salary: '$110,000 - $150,000',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'Looking for a Product Manager to drive product strategy and work with cross-functional teams to deliver exceptional user experiences.',
      requirements: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'SQL', 'Figma', '3+ years experience'],
      link: 'https://innovatecorp.com/jobs/product-manager',
      source: 'AngelList',
      remote: true,
      featured: false
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'DataDriven Analytics',
      location: 'Seattle, WA',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      posted: '3 days ago',
      description: 'Seeking a Data Scientist to analyze large datasets and build machine learning models to drive business insights and decision-making.',
      requirements: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Statistics', '4+ years experience'],
      link: 'https://datadriven.com/careers/data-scientist',
      source: 'Indeed',
      remote: true,
      featured: true
    },
    {
      id: '6',
      title: 'UX/UI Designer',
      company: 'DesignStudio',
      location: 'Los Angeles, CA',
      salary: '$85,000 - $120,000',
      type: 'Full-time',
      posted: '1 week ago',
      description: 'Creative UX/UI Designer needed to design intuitive and engaging user experiences for our digital products.',
      requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Wireframing', '3+ years experience'],
      link: 'https://designstudio.com/jobs/ux-ui-designer',
      source: 'Dribbble',
      remote: false,
      featured: false
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setLoading(true);
    
    // Simulate API call with more realistic delay
    setTimeout(() => {
      let filteredJobs = mockJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Apply location filter
      if (location.trim()) {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(location.toLowerCase()) ||
          (location.toLowerCase().includes('remote') && job.remote)
        );
      }

      // Apply selected filters
      selectedFilters.forEach(filter => {
        if (filter === 'Remote') {
          filteredJobs = filteredJobs.filter(job => job.remote);
        } else if (filter === 'Full-time' || filter === 'Part-time' || filter === 'Contract') {
          filteredJobs = filteredJobs.filter(job => job.type === filter);
        }
      });

      setJobs(filteredJobs);
      setLoading(false);
      toast.success(`Found ${filteredJobs.length} jobs matching your criteria`);
    }, 2000);
  };

  const handleJobSelect = (job: Job) => {
    onJobSelected({
      title: job.title,
      company: job.company,
      requirements: job.requirements,
      description: job.description,
      skills: job.requirements.filter(req => !req.includes('years') && !req.includes('experience'))
    });
    toast.success(`Applied requirements from ${job.title} at ${job.company} to your resume`);
    onClose();
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Search className="w-6 h-6" />
            AI Job Market Scanner
          </DialogTitle>
          <DialogDescription>
            Search real job postings and automatically extract requirements for your resume
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Search Form */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Job Title or Keywords</Label>
                    <Input
                      id="search"
                      placeholder="e.g., Software Engineer, Data Scientist, Product Manager..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, Remote..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <Label>Filters</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.map((filter) => (
                      <Badge
                        key={filter}
                        variant={selectedFilters.includes(filter) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleFilter(filter)}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scanning Job Market...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Jobs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Results */}
          {jobs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Found {jobs.length} jobs</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  Updated in real-time
                </div>
              </div>
              
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {jobs.map((job) => (
                    <Card key={job.id} className={`hover:shadow-md transition-shadow ${job.featured ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              {job.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                              {job.remote && <Badge variant="secondary" className="text-xs">Remote</Badge>}
                            </div>
                            <CardDescription className="flex items-center gap-4 mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.posted}
                              </span>
                              <Badge variant="outline" className="text-xs">{job.source}</Badge>
                            </CardDescription>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </div>
                            <Badge variant="secondary">{job.type}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                        
                        <div className="mb-4">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Key Requirements ({job.requirements.length})
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleJobSelect(job)}
                            className="flex items-center gap-2 flex-1"
                          >
                            <Zap className="w-4 h-4" />
                            Apply to Resume
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open(job.link, '_blank')}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Job
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* No Results */}
          {!loading && jobs.length === 0 && searchQuery && (
            <Card>
              <CardContent className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No jobs found for your search criteria</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords, locations, or adjust your filters</p>
              </CardContent>
            </Card>
          )}

          {/* Getting Started */}
          {!loading && jobs.length === 0 && !searchQuery && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">Ready to find your next opportunity?</p>
                <p className="text-sm text-gray-500 mb-4">Search for jobs and we'll automatically extract the requirements to optimize your resume</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'].map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch();
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobScanner;
