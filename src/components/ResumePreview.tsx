
import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Globe, Award, Calendar } from 'lucide-react';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
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
    gpa: string;
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
}

interface ResumePreviewProps {
  data: ResumeData;
  template: number;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const renderTemplate = () => {
    // Map template IDs to actual template components
    switch (template) {
      case 0: // Modern Professional
        return <ModernTemplate data={data} />;
      case 1: // Executive Leader
        return <ExecutiveTemplate data={data} />;
      case 2: // Classic Corporate
        return <ClassicTemplate data={data} />;
      case 3: // Creative Designer
        return <CreativeTemplate data={data} />;
      case 4: // Artistic Portfolio
        return <ArtisticTemplate data={data} />;
      case 5: // Modern Creative
        return <ModernCreativeTemplate data={data} />;
      case 6: // Tech Specialist
        return <TechTemplate data={data} />;
      case 7: // Full Stack Developer
        return <FullStackTemplate data={data} />;
      case 8: // DevOps Engineer
        return <DevOpsTemplate data={data} />;
      case 9: // Research Academic
        return <AcademicTemplate data={data} />;
      case 10: // PhD Candidate
        return <PhDTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h2>
        <div className="text-sm text-gray-500">Template: {getTemplateName(template)}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
        <div className="h-full p-6 text-xs overflow-y-auto">
          {renderTemplate()}
        </div>
      </div>
    </Card>
  );
};

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="text-center border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
      <div className="flex items-center justify-center space-x-4 text-gray-600">
        <div className="flex items-center">
          <Mail className="w-3 h-3 mr-1" />
          {data.personal.email}
        </div>
        <div className="flex items-center">
          <Phone className="w-3 h-3 mr-1" />
          {data.personal.phone}
        </div>
        <div className="flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {data.personal.location}
        </div>
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Professional Experience
        </h2>
        <div className="space-y-3">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Projects
        </h2>
        <div className="space-y-3">
          {data.projects.map((project) => (
            <div key={project.id}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 text-sm">{project.technologies}</p>
                  {project.link && (
                    <p className="text-blue-600 text-sm break-all">{project.link}</p>
                  )}
                </div>
                <span className="text-gray-500 text-sm">{project.startDate} - {project.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Education
        </h2>
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school} • {edu.location}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
              <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span key={skill} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Languages */}
    {data.languages.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Languages
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex justify-between">
              <span className="text-gray-700">{lang.language}</span>
              <span className="text-gray-500 text-sm">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Certifications */}
    {data.certifications.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Certifications
        </h2>
        <div className="space-y-2">
          {data.certifications.map((cert) => (
            <div key={cert.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                  {cert.credentialId && <p className="text-gray-600 text-sm">ID: {cert.credentialId}</p>}
                </div>
                <span className="text-gray-500 text-sm">{cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Interests */}
    {data.interests.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
          Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.interests.map((interest) => (
            <span key={interest} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
              {interest}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Creative Template with all sections
const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Header with gradient */}
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{data.personal.fullName}</h1>
      <div className="space-y-1 text-purple-100">
        <div>{data.personal.email} • {data.personal.phone}</div>
        <div>{data.personal.location}</div>
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div className="bg-purple-50 p-3 rounded-lg">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">About Me</h2>
        <p className="text-purple-800 leading-relaxed">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Experience</h2>
        <div className="space-y-3">
          {data.experience.map((exp) => (
            <div key={exp.id} className="border-l-4 border-purple-300 pl-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-purple-600">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Projects</h2>
        <div className="space-y-3">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-purple-50 p-3 rounded">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-purple-600 text-sm">{project.technologies}</p>
                  {project.link && (
                    <p className="text-blue-600 text-sm break-all">{project.link}</p>
                  )}
                </div>
                <span className="text-gray-500 text-sm">{project.startDate} - {project.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Education</h2>
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.id} className="bg-purple-50 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-purple-600">{edu.school} • {edu.location}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span key={skill} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Languages & Certifications in grid */}
    <div className="grid grid-cols-2 gap-4">
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-purple-600 mb-2">Languages</h2>
          <div className="space-y-1">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{lang.language}</span>
                <span className="text-purple-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-purple-600 mb-2">Certifications</h2>
          <div className="space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                <div className="font-semibold text-gray-900">{cert.name}</div>
                <div className="text-purple-600">{cert.issuer} • {cert.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Interests */}
    {data.interests.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {data.interests.map((interest) => (
            <span key={interest} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
              {interest}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Tech Template with all sections
const TechTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4 font-mono">
    {/* Header with tech styling */}
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <span className="text-gray-500 mr-2">$</span>
        <h1 className="text-xl font-bold">{data.personal.fullName.toLowerCase().replace(/\s+/g, '_')}</h1>
      </div>
      <div className="text-green-300 text-sm space-y-1">
        <div>email: {data.personal.email}</div>
        <div>phone: {data.personal.phone}</div>
        <div>location: {data.personal.location}</div>
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div className="border border-green-300 p-3 rounded">
        <h2 className="text-lg font-semibold text-green-600 mb-2">// Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-green-600 mb-2">// Work Experience</h2>
        <div className="space-y-3">
          {data.experience.map((exp) => (
            <div key={exp.id} className="bg-gray-50 p-3 rounded border-l-4 border-green-400">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">function {exp.position.toLowerCase().replace(/\s+/g, '_')}()</h3>
                  <p className="text-green-600">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed ml-4">// {exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-green-600 mb-2">// Projects</h2>
        <div className="space-y-3">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">const {project.name.toLowerCase().replace(/\s+/g, '_')} = {}</h3>
                  <p className="text-blue-600 text-sm">// Tech: {project.technologies}</p>
                  {project.link && (
                    <p className="text-blue-600 text-sm">// URL: {project.link}</p>
                  )}
                </div>
                <span className="text-gray-500 text-sm">{project.startDate} - {project.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed ml-4">// {project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-green-600 mb-2">// Education</h2>
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.id} className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-green-600">{edu.school} • {edu.location}</p>
                  {edu.gpa && <p className="text-gray-600">// GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Technical Skills */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-green-600 mb-2">// Technical Skills</h2>
        <div className="bg-gray-900 text-green-400 p-3 rounded">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={skill}>
                "{skill}"{index < data.skills.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Languages, Certifications, Interests in grid */}
    <div className="grid grid-cols-3 gap-4">
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-green-600 mb-2">// Languages</h2>
          <div className="bg-gray-900 text-green-400 p-2 rounded text-xs">
            {data.languages.map((lang) => (
              <div key={lang.id}>"{lang.language}": "{lang.proficiency}"</div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-green-600 mb-2">// Certificates</h2>
          <div className="bg-gray-900 text-green-400 p-2 rounded text-xs">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <div>"{cert.name}"</div>
                <div className="text-green-300">// {cert.issuer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-green-600 mb-2">// Interests</h2>
          <div className="bg-gray-900 text-green-400 p-2 rounded text-xs">
            {data.interests.map((interest, index) => (
              <span key={interest}>
                "{interest}"{index < data.interests.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Executive Template with all sections
const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Header with executive styling */}
    <div className="text-center border-b-2 border-gray-800 pb-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personal.fullName.toUpperCase()}</h1>
      <div className="flex items-center justify-center space-x-6 text-gray-600 text-sm">
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        <span>•</span>
        <span>{data.personal.location}</span>
      </div>
    </div>

    {/* Executive Summary */}
    {data.personal.summary && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Executive Summary</h2>
        <p className="text-gray-700 leading-relaxed italic">{data.personal.summary}</p>
      </div>
    )}

    {/* Professional Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}, {exp.location}</p>
                </div>
                <span className="text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed ml-4">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Key Projects */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Key Projects</h2>
        <div className="space-y-3">
          {data.projects.map((project) => (
            <div key={project.id} className="ml-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 font-medium">{project.technologies}</p>
                  {project.link && (
                    <p className="text-blue-600 text-sm">{project.link}</p>
                  )}
                </div>
                <span className="text-gray-600 font-medium">{project.startDate} - {project.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Education</h2>
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.school}, {edu.location}</p>
                  {edu.gpa && <p className="text-gray-600">Cumulative GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-600 font-medium">{edu.startDate} - {edu.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Core Competencies */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Core Competencies</h2>
        <div className="grid grid-cols-3 gap-2">
          {data.skills.map((skill) => (
            <div key={skill} className="text-gray-700 text-center py-1 border border-gray-300 rounded text-sm">
              {skill}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Additional Qualifications */}
    <div className="grid grid-cols-3 gap-4">
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Languages</h2>
          <div className="space-y-1">
            {data.languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="font-medium">{lang.language}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Certifications</h2>
          <div className="space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                <div className="font-medium">{cert.name}</div>
                <div className="text-gray-600">{cert.issuer} ({cert.date})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Interests</h2>
          <div className="text-sm">
            {data.interests.join(' • ')}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Add more template variations
const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <ModernTemplate data={data} />
);

const ArtisticTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <CreativeTemplate data={data} />
);

const ModernCreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <CreativeTemplate data={data} />
);

const FullStackTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <TechTemplate data={data} />
);

const DevOpsTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <TechTemplate data={data} />
);

const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <ExecutiveTemplate data={data} />
);

const PhDTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <ExecutiveTemplate data={data} />
);

const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',     // 0
    'Executive Leader',        // 1  
    'Classic Corporate',       // 2
    'Creative Designer',       // 3
    'Artistic Portfolio',      // 4
    'Modern Creative',         // 5
    'Tech Specialist',         // 6
    'Full Stack Developer',    // 7
    'DevOps Engineer',         // 8
    'Research Academic',       // 9
    'PhD Candidate'            // 10
  ];
  return names[index] || 'Modern Professional';
};

export default ResumePreview;
