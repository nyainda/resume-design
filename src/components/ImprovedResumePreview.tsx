
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, Phone, Mail, Globe } from 'lucide-react';

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
    gpa?: string;
    description?: string;
    courses?: string;
    honors?: string;
  }>;
  skills: string[] | Array<{name: string; level: string; category: string}>;
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
  references?: Array<{
    id: number;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

interface ImprovedResumePreviewProps {
  data: ResumeData;
  template?: number;
  scale?: number;
}

const ImprovedResumePreview: React.FC<ImprovedResumePreviewProps> = ({ 
  data, 
  template = 0, 
  scale = 0.3 
}) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate) return '';
    const start = startDate ? new Date(startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    const end = endDate ? new Date(endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
    return `${start} - ${end}`;
  };

  const formatBulletPoints = (description: string) => {
    if (!description) return [];
    return description.split('\n').filter(line => line.trim()).map(line => line.replace(/^[•·‣▪▫-]\s*/, ''));
  };

  const getSkillNames = (skills: string[] | Array<{name: string; level: string; category: string}>) => {
    if (!skills || skills.length === 0) return [];
    
    // Check if it's an array of strings
    if (typeof skills[0] === 'string') {
      return skills as string[];
    }
    
    // If it's an array of objects, extract the name property
    return (skills as Array<{name: string; level: string; category: string}>).map(skill => skill.name);
  };

  // Responsive scale calculation
  const responsiveScale = typeof window !== 'undefined' ? 
    window.innerWidth < 640 ? 0.15 : // mobile
    window.innerWidth < 1024 ? 0.2 : // tablet
    scale : scale; // desktop

  return (
    <div 
      className="bg-white text-black font-sans leading-relaxed shadow-lg w-full"
      style={{ 
        transform: `scale(${responsiveScale})`, 
        transformOrigin: 'top left',
        width: `${100 / responsiveScale}%`,
        height: `${100 / responsiveScale}%`,
        minHeight: '1056px', // A4 height
        maxWidth: '816px', // A4 width
        padding: window?.innerWidth < 640 ? '16px' : '32px'
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-blue-600">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 mb-2 sm:mb-3">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-gray-700 text-xs sm:text-sm">
          {data.personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="break-all">{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              {data.personal.phone}
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              {data.personal.location}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personal.summary && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3 border-b border-gray-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 border-b border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <div className="text-blue-600 font-medium text-sm sm:text-base">{exp.company}</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 sm:text-right">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}
                </div>
              </div>
              {exp.description && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
                  {formatBulletPoints(exp.description).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 border-b border-gray-300 pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3 sm:mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">{edu.degree}</h3>
                  <div className="text-blue-600 font-medium text-sm sm:text-base">{edu.school}</div>
                  {edu.gpa && (
                    <div className="text-xs sm:text-sm text-gray-600">GPA: {edu.gpa}</div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 sm:text-right">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Projects - Only show if projects exist */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 border-b border-gray-300 pb-1">
            KEY PROJECTS
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">{project.name}</h3>
                  {project.technologies && (
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">
                      Technologies: {project.technologies}
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 sm:text-right">
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateRange(project.startDate, project.endDate)}
                    </div>
                  )}
                  {project.link && (
                    <div className="flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-blue-600 break-all">Link: {project.link}</span>
                    </div>
                  )}
                </div>
              </div>
              {project.description && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
                  {formatBulletPoints(project.description).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3 border-b border-gray-300 pb-1">
            TECHNICAL SKILLS
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {getSkillNames(data.skills).map((skillName, index) => (
              <Badge key={index} variant="outline" className="text-gray-700 border-gray-400 text-xs sm:text-sm">
                {skillName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 border-b border-gray-300 pb-1">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2 sm:mb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{cert.name}</h3>
                  <div className="text-blue-600 text-xs sm:text-sm">{cert.issuer}</div>
                  {cert.credentialId && (
                    <div className="text-xs text-gray-600">ID: {cert.credentialId}</div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{cert.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3 border-b border-gray-300 pb-1">
            LANGUAGES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-800">{lang.language}</span>
                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests && data.interests.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3 border-b border-gray-300 pb-1">
            INTERESTS
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {data.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-gray-700 border-gray-400 text-xs sm:text-sm">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedResumePreview;
