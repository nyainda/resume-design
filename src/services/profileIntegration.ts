
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
}

interface LinkedInData {
  personalInfo: {
    fullName: string;
    email: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

interface GitHubData {
  skills: string[];
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
}

export const ProfileIntegrationService = {
  async getProfileData(userId: string): Promise<ProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async extractLinkedInData(linkedinUrl: string): Promise<LinkedInData | null> {
    if (!linkedinUrl) return null;

    try {
      const apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      // Simulate LinkedIn data extraction using AI
      const mockData: LinkedInData = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          location: 'San Francisco, CA',
          summary: 'Experienced software developer with expertise in full-stack development and team leadership.'
        },
        experience: [
          {
            id: Date.now(),
            company: 'Tech Corporation',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2021',
            endDate: 'Present',
            description: '• Lead development of scalable web applications using React and Node.js\n• Managed a team of 5 developers\n• Implemented CI/CD pipelines improving deployment efficiency by 40%'
          },
          {
            id: Date.now() + 1,
            company: 'Startup Inc',
            position: 'Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: '2019',
            endDate: '2021',
            description: '• Built responsive web applications using modern JavaScript frameworks\n• Collaborated with UX/UI designers to implement pixel-perfect designs\n• Optimized database queries reducing load times by 30%'
          }
        ],
        education: [
          {
            id: Date.now(),
            school: 'Stanford University',
            degree: 'Bachelor of Computer Science',
            location: 'Stanford, CA',
            startDate: '2015',
            endDate: '2019'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'TypeScript']
      };

      return mockData;
    } catch (error) {
      console.error('Error extracting LinkedIn data:', error);
      return null;
    }
  },

  async extractGitHubData(githubUrl: string): Promise<GitHubData | null> {
    if (!githubUrl) return null;

    try {
      const username = githubUrl.split('/').pop();
      if (!username) return null;

      // Simulate GitHub data extraction
      const mockData: GitHubData = {
        skills: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Docker', 'Kubernetes', 'React', 'Node.js'],
        projects: [
          {
            id: Date.now(),
            name: 'Advanced React Components',
            description: 'A comprehensive library of reusable React components with TypeScript support and Storybook documentation.',
            technologies: 'React, TypeScript, Storybook, Jest',
            link: `https://github.com/${username}/react-components`,
            startDate: '2023',
            endDate: 'Present'
          },
          {
            id: Date.now() + 1,
            name: 'Microservices API',
            description: 'Scalable REST API built with Node.js, featuring Docker containerization and comprehensive testing.',
            technologies: 'Node.js, Express, Docker, PostgreSQL, Jest',
            link: `https://github.com/${username}/microservices-api`,
            startDate: '2022',
            endDate: '2023'
          },
          {
            id: Date.now() + 2,
            name: 'AI Content Generator',
            description: 'Machine learning powered content generation tool with web interface and API.',
            technologies: 'Python, FastAPI, TensorFlow, React',
            link: `https://github.com/${username}/ai-content-gen`,
            startDate: '2023',
            endDate: '2024'
          }
        ]
      };

      return mockData;
    } catch (error) {
      console.error('Error extracting GitHub data:', error);
      return null;
    }
  },

  mergeProfileDataToResume(profileData: ProfileData, linkedinData?: LinkedInData, githubData?: GitHubData) {
    const resumeData: any = {
      personal: {
        fullName: linkedinData?.personalInfo?.fullName || profileData.full_name || '',
        email: linkedinData?.personalInfo?.email || profileData.email || '',
        phone: profileData.phone || '',
        location: linkedinData?.personalInfo?.location || profileData.location || '',
        summary: linkedinData?.personalInfo?.summary || profileData.bio || ''
      },
      experience: linkedinData?.experience || [],
      education: linkedinData?.education || [],
      skills: [...(linkedinData?.skills || []), ...(githubData?.skills || [])].filter((skill, index, array) => array.indexOf(skill) === index),
      projects: githubData?.projects || [],
      certifications: [],
      languages: [],
      interests: []
    };

    return resumeData;
  }
};
