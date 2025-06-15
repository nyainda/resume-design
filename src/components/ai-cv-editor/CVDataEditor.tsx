
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Briefcase, GraduationCap, Award, Languages, Heart, FolderOpen, Users, Globe, Code2, Building2 } from 'lucide-react';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
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
    gpa: string;
    description?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  languages: Array<{
    id: number;
    language: string;
    proficiency: string;
  }>;
  interests: string[];
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
  references: Array<{
    id: number;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
  internships: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    supervisor: string;
  }>;
  volunteering: Array<{
    id: number;
    organization: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  publications: Array<{
    id: number;
    title: string;
    authors: string;
    journal: string;
    date: string;
    doi: string;
    description: string;
  }>;
}

interface CVDataEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

const CVDataEditor: React.FC<CVDataEditorProps> = ({ data, onDataChange }) => {
  const updatePersonalInfo = (field: string, value: string) => {
    onDataChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  const updateArraySection = (section: keyof ResumeData, index: number, field: string, value: string) => {
    const sectionData = data[section] as any[];
    const updatedSection = [...sectionData];
    updatedSection[index] = {
      ...updatedSection[index],
      [field]: value
    };
    onDataChange({
      ...data,
      [section]: updatedSection
    });
  };

  const addToSection = (section: keyof ResumeData, template: any) => {
    const sectionData = data[section] as any[];
    const newItem = {
      ...template,
      id: Date.now()
    };
    onDataChange({
      ...data,
      [section]: [...sectionData, newItem]
    });
  };

  const removeFromSection = (section: keyof ResumeData, index: number) => {
    const sectionData = data[section] as any[];
    const updatedSection = sectionData.filter((_, i) => i !== index);
    onDataChange({
      ...data,
      [section]: updatedSection
    });
  };

  const updateSkills = (skillsText: string) => {
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(s => s);
    onDataChange({
      ...data,
      skills: skillsArray
    });
  };

  const updateInterests = (interestsText: string) => {
    const interestsArray = interestsText.split(',').map(s => s.trim()).filter(s => s);
    onDataChange({
      ...data,
      interests: interestsArray
    });
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
      {/* Enhanced Personal Information */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-300">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-blue-800 dark:text-blue-300">Full Name</Label>
            <Input
              id="fullName"
              value={data.personal.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-800 dark:text-blue-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personal.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-blue-800 dark:text-blue-300">Phone</Label>
            <Input
              id="phone"
              value={data.personal.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-blue-800 dark:text-blue-300">Location</Label>
            <Input
              id="location"
              value={data.personal.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-blue-800 dark:text-blue-300">Website</Label>
            <Input
              id="website"
              value={data.personal.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="text-blue-800 dark:text-blue-300">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.personal.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <Label htmlFor="github" className="text-blue-800 dark:text-blue-300">GitHub</Label>
            <Input
              id="github"
              value={data.personal.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <Label htmlFor="portfolio" className="text-blue-800 dark:text-blue-300">Portfolio</Label>
            <Input
              id="portfolio"
              value={data.personal.portfolio || ''}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              placeholder="https://yourportfolio.com"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="summary" className="text-blue-800 dark:text-blue-300">Professional Summary</Label>
            <Textarea
              id="summary"
              value={data.personal.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              rows={4}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card className="border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-indigo-900 dark:text-indigo-300">
              <FolderOpen className="w-5 h-5" />
              Projects
            </CardTitle>
            <Button 
              onClick={() => addToSection('projects', {
                name: '',
                description: '',
                technologies: '',
                link: '',
                startDate: '',
                endDate: ''
              })}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={project.id} className="border border-indigo-300 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-indigo-800 dark:text-indigo-300">Project {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromSection('projects', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-indigo-700 dark:text-indigo-400">Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateArraySection('projects', index, 'name', e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Label className="text-indigo-700 dark:text-indigo-400">Technologies</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => updateArraySection('projects', index, 'technologies', e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <Label className="text-indigo-700 dark:text-indigo-400">Start Date</Label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateArraySection('projects', index, 'startDate', e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Label className="text-indigo-700 dark:text-indigo-400">End Date</Label>
                  <Input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateArraySection('projects', index, 'endDate', e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-indigo-700 dark:text-indigo-400">Project Link</Label>
                  <Input
                    value={project.link}
                    onChange={(e) => updateArraySection('projects', index, 'link', e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              <div>
                <Label className="text-indigo-700 dark:text-indigo-400">Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateArraySection('projects', index, 'description', e.target.value)}
                  rows={3}
                  className="border-indigo-300 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Languages Section */}
      <Card className="border-cyan-200 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-cyan-900 dark:text-cyan-300">
              <Languages className="w-5 h-5" />
              Languages
            </CardTitle>
            <Button 
              onClick={() => addToSection('languages', {
                language: '',
                proficiency: 'Intermediate'
              })}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Add Language
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.languages.map((lang, index) => (
            <div key={lang.id} className="border border-cyan-300 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-cyan-800 dark:text-cyan-300">Language {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromSection('languages', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-cyan-700 dark:text-cyan-400">Language</Label>
                  <Input
                    value={lang.language}
                    onChange={(e) => updateArraySection('languages', index, 'language', e.target.value)}
                    className="border-cyan-300 focus:border-cyan-500"
                    placeholder="English, Spanish, French..."
                  />
                </div>
                <div>
                  <Label className="text-cyan-700 dark:text-cyan-400">Proficiency</Label>
                  <Select 
                    value={lang.proficiency} 
                    onValueChange={(value) => updateArraySection('languages', index, 'proficiency', value)}
                  >
                    <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Native">Native</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* References Section */}
      <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-orange-900 dark:text-orange-300">
              <Users className="w-5 h-5" />
              References
            </CardTitle>
            <Button 
              onClick={() => addToSection('references', {
                name: '',
                title: '',
                company: '',
                email: '',
                phone: '',
                relationship: ''
              })}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add Reference
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.references.map((ref, index) => (
            <div key={ref.id} className="border border-orange-300 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-orange-800 dark:text-orange-300">Reference {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromSection('references', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-orange-700 dark:text-orange-400">Full Name</Label>
                  <Input
                    value={ref.name}
                    onChange={(e) => updateArraySection('references', index, 'name', e.target.value)}
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 dark:text-orange-400">Job Title</Label>
                  <Input
                    value={ref.title}
                    onChange={(e) => updateArraySection('references', index, 'title', e.target.value)}
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 dark:text-orange-400">Company</Label>
                  <Input
                    value={ref.company}
                    onChange={(e) => updateArraySection('references', index, 'company', e.target.value)}
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 dark:text-orange-400">Relationship</Label>
                  <Input
                    value={ref.relationship}
                    onChange={(e) => updateArraySection('references', index, 'relationship', e.target.value)}
                    className="border-orange-300 focus:border-orange-500"
                    placeholder="Former Manager, Colleague..."
                  />
                </div>
                <div>
                  <Label className="text-orange-700 dark:text-orange-400">Email</Label>
                  <Input
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateArraySection('references', index, 'email', e.target.value)}
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 dark:text-orange-400">Phone</Label>
                  <Input
                    value={ref.phone}
                    onChange={(e) => updateArraySection('references', index, 'phone', e.target.value)}
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Internships Section */}
      <Card className="border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-teal-900 dark:text-teal-300">
              <Building2 className="w-5 h-5" />
              Internships
            </CardTitle>
            <Button 
              onClick={() => addToSection('internships', {
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                description: '',
                supervisor: ''
              })}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Add Internship
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.internships.map((internship, index) => (
            <div key={internship.id} className="border border-teal-300 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-teal-800 dark:text-teal-300">Internship {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromSection('internships', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-teal-700 dark:text-teal-400">Company</Label>
                  <Input
                    value={internship.company}
                    onChange={(e) => updateArraySection('internships', index, 'company', e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />
                </div>
                <div>
                  <Label className="text-teal-700 dark:text-teal-400">Position</Label>
                  <Input
                    value={internship.position}
                    onChange={(e) => updateArraySection('internships', index, 'position', e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />
                </div>
                <div>
                  <Label className="text-teal-700 dark:text-teal-400">Location</Label>
                  <Input
                    value={internship.location}
                    onChange={(e) => updateArraySection('internships', index, 'location', e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />
                </div>
                <div>
                  <Label className="text-teal-700 dark:text-teal-400">Supervisor</Label>
                  <Input
                    value={internship.supervisor}
                    onChange={(e) => updateArraySection('internships', index, 'supervisor', e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />
                </div>
                <div>
                  <Label className="text-teal-700 dark:text-teal-400">Start Date</Label>
                  <Input
                    type="month"
                    value={internship.startDate}
                    onChange={(e) => updateArraySection('internships', index, 'startDate', e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />
                </div>
                <div>
                  <Label className="text-teal-700 dark:text-teal-400">End Date</Label>
                  <Input
                    type="month"
                    value={internship.endDate}
                    onChange={(e) => updateArraySection('internships', index, 'endDate', e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />
                </div>
              </div>
              <div>
                <Label className="text-teal-700 dark:text-teal-400">Description</Label>
                <Textarea
                  value={internship.description}
                  onChange={(e) => updateArraySection('internships', index, 'description', e.target.value)}
                  rows={3}
                  className="border-teal-300 focus:border-teal-500"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Skills */}
      <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-900 dark:text-purple-300">
            <Award className="w-5 h-5" />
            Skills & Competencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="skills" className="text-purple-800 dark:text-purple-300">Skills (comma-separated)</Label>
          <Textarea
            id="skills"
            value={data.skills.join(', ')}
            onChange={(e) => updateSkills(e.target.value)}
            rows={3}
            placeholder="JavaScript, React, Node.js, Python, Data Analysis, Project Management..."
            className="border-purple-300 focus:border-purple-500"
          />
        </CardContent>
      </Card>

      {/* Interests & Hobbies */}
      <Card className="border-pink-200 bg-pink-50/50 dark:border-pink-800 dark:bg-pink-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-pink-900 dark:text-pink-300">
            <Heart className="w-5 h-5" />
            Interests & Hobbies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="interests" className="text-pink-800 dark:text-pink-300">Interests (comma-separated)</Label>
          <Textarea
            id="interests"
            value={data.interests.join(', ')}
            onChange={(e) => updateInterests(e.target.value)}
            rows={3}
            placeholder="Photography, Travel, Reading, Cooking, Sports, Music..."
            className="border-pink-300 focus:border-pink-500"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataEditor;
