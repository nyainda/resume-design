import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileIntegrationService } from '@/services/profileIntegration';
import { 
  Linkedin, 
  Github, 
  Download, 
  Link, 
  Mail, 
  BarChart3, 
  Zap, 
  CheckCircle,
  ExternalLink,
  Cloud,
  Database,
  Globe,
  User,
  Loader2
} from 'lucide-react';

interface IntegrationHubProps {
  onDataImport: (data: any, source: string) => void;
}

const IntegrationHub: React.FC<IntegrationHubProps> = ({ onDataImport }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [importing, setImporting] = useState(false);
  const [connectedServices, setConnectedServices] = useState<string[]>([]);

  const importFromProfile = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to import profile data",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      const profileData = await ProfileIntegrationService.getProfileData(user.id);
      if (!profileData) {
        toast({
          title: "No Profile Data",
          description: "Please update your profile with LinkedIn and GitHub URLs first",
          variant: "destructive"
        });
        return;
      }

      let linkedinData = null;
      let githubData = null;

      if (profileData.linkedin_url) {
        linkedinData = await ProfileIntegrationService.extractLinkedInData(profileData.linkedin_url);
      }

      if (profileData.github_url) {
        githubData = await ProfileIntegrationService.extractGitHubData(profileData.github_url);
      }

      const mergedData = ProfileIntegrationService.mergeProfileDataToResume(
        profileData,
        linkedinData || undefined,
        githubData || undefined
      );

      onDataImport(mergedData, 'profile');
      setConnectedServices(prev => [...prev, 'profile']);
      
      toast({
        title: "Profile Import Successful",
        description: "Your profile data has been imported and populated in your resume"
      });
    } catch (error) {
      console.error('Profile import error:', error);
      toast({
        title: "Import Failed",
        description: "Unable to import profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const importLinkedInProfile = async () => {
    if (!linkedinUrl) return;
    
    setImporting(true);
    try {
      const linkedinData = await ProfileIntegrationService.extractLinkedInData(linkedinUrl);
      if (linkedinData) {
        onDataImport(linkedinData, 'linkedin');
        setConnectedServices(prev => [...prev, 'linkedin']);
        toast({
          title: "LinkedIn Import Successful",
          description: "Your profile data has been imported and populated in your resume"
        });
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to import LinkedIn profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const importGitHubProfile = async () => {
    if (!githubUsername) return;
    
    setImporting(true);
    try {
      const githubData = await ProfileIntegrationService.extractGitHubData(`https://github.com/${githubUsername}`);
      if (githubData) {
        onDataImport(githubData, 'github');
        setConnectedServices(prev => [...prev, 'github']);
        toast({
          title: "GitHub Import Successful",
          description: "Your repositories and skills have been imported"
        });
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to import GitHub profile. Please check the username.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const connectGoogleAnalytics = () => {
    toast({
      title: "Coming Soon",
      description: "Google Analytics integration will be available in the next update"
    });
  };

  const setupEmailMarketing = () => {
    toast({
      title: "Coming Soon",
      description: "Email marketing integration will be available soon"
    });
  };

  const integrations = [
    {
      name: 'LinkedIn',
      description: 'Import profile, experience, and education',
      icon: <Linkedin className="h-6 w-6 text-blue-600" />,
      status: connectedServices.includes('linkedin') ? 'connected' : 'available',
      category: 'profile'
    },
    {
      name: 'GitHub',
      description: 'Import repositories and technical skills',
      icon: <Github className="h-6 w-6 text-gray-800" />,
      status: connectedServices.includes('github') ? 'connected' : 'available',
      category: 'profile'
    },
    {
      name: 'Google Analytics',
      description: 'Track resume performance and views',
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
      status: 'coming-soon',
      category: 'analytics'
    },
    {
      name: 'Email Marketing',
      description: 'Automated follow-up campaigns',
      icon: <Mail className="h-6 w-6 text-green-600" />,
      status: 'coming-soon',
      category: 'marketing'
    },
    {
      name: 'CRM Integration',
      description: 'Sync with Salesforce, HubSpot',
      icon: <Database className="h-6 w-6 text-purple-600" />,
      status: 'coming-soon',
      category: 'crm'
    },
    {
      name: 'Cloud Storage',
      description: 'Auto-backup to Google Drive, Dropbox',
      icon: <Cloud className="h-6 w-6 text-blue-500" />,
      status: 'coming-soon',
      category: 'storage'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>;
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Integration Hub
        </h3>
        <p className="text-sm text-gray-600">Connect external services to enhance your resume building experience</p>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Profile Import</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Tracking</TabsTrigger>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Import from Profile
              </CardTitle>
              <CardDescription>
                Automatically import data from your connected LinkedIn and GitHub profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={importFromProfile} 
                disabled={importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import from My Profile
                  </>
                )}
              </Button>
              {connectedServices.includes('profile') && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Profile data successfully imported! Your resume has been updated.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-blue-600" />
                LinkedIn Profile Import
              </CardTitle>
              <CardDescription>
                Import your professional information directly from LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin-url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={importLinkedInProfile} 
                disabled={!linkedinUrl || importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import from LinkedIn
                  </>
                )}
              </Button>
              {connectedServices.includes('linkedin') && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    LinkedIn profile successfully imported! Your resume has been updated with the latest information.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5 text-gray-800" />
                GitHub Profile Import
              </CardTitle>
              <CardDescription>
                Import your repositories and technical skills from GitHub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github-username">GitHub Username</Label>
                <Input
                  id="github-username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="yourusername"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={importGitHubProfile} 
                disabled={!githubUsername || importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import from GitHub
                  </>
                )}
              </Button>
              {connectedServices.includes('github') && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    GitHub profile successfully imported! Your technical skills and projects have been updated.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Performance Tracking</CardTitle>
              <CardDescription>Monitor your resume's performance and optimize for better results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium">Google Analytics</h4>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Track resume views, downloads, and user engagement metrics
                  </p>
                  <Button variant="outline" onClick={connectGoogleAnalytics} disabled>
                    <Link className="h-4 w-4 mr-2" />
                    Connect Google Analytics
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Email Marketing</h4>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Set up automated follow-up emails for job applications
                  </p>
                  <Button variant="outline" onClick={setupEmailMarketing} disabled>
                    <Mail className="h-4 w-4 mr-2" />
                    Setup Email Campaigns
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-4">
            {integrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {integration.icon}
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      {integration.status === 'connected' && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;
