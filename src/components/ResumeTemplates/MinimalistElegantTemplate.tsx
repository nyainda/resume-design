
import React from 'react';

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
  };
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  interests?: string[];
}

interface MinimalistElegantTemplateProps {
  data: ResumeData;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

const MinimalistElegantTemplate: React.FC<MinimalistElegantTemplateProps> = ({ data, customColors }) => {
  const colors = customColors || {
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#6B7280',
    text: '#1F2937',
    background: '#FFFFFF'
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString === 'Present') return 'Present';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm', backgroundColor: colors.background, color: colors.text }}>
      {/* Minimal Header - Centered */}
      <div className="border-b-2 p-8 pb-6 text-center" style={{ borderColor: colors.primary }}>
        <h1 className="text-4xl font-light mb-3 tracking-wide" style={{ color: colors.primary }}>
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ color: colors.secondary }}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>LinkedIn</span>}
          {data.personal.website && <span>Portfolio</span>}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        {data.personal.summary && (
          <div className="text-center">
            <p className="leading-relaxed font-light text-lg" style={{ color: colors.text }}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-light mb-6 tracking-wide text-center" style={{ color: colors.primary }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-6" style={{ borderColor: colors.accent }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-medium" style={{ color: colors.primary }}>{exp.position}</h3>
                      <p className="font-light" style={{ color: colors.secondary }}>{exp.company}</p>
                    </div>
                    <div className="text-right text-sm font-light" style={{ color: colors.accent }}>
                      <p>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed font-light whitespace-pre-line mt-3" style={{ color: colors.text }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-light mb-6 tracking-wide text-center" style={{ color: colors.primary }}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-2 pl-6" style={{ borderColor: colors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium" style={{ color: colors.primary }}>{edu.degree}</h3>
                      <p className="font-light" style={{ color: colors.secondary }}>{edu.school}</p>
                      {edu.gpa && <p className="text-sm" style={{ color: colors.accent }}>GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm font-light" style={{ color: colors.accent }}>
                      <p>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                      {edu.location && <p>{edu.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-light mb-6 tracking-wide text-center" style={{ color: colors.primary }}>
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.skills.map((skill, index) => (
                <span key={index} className="text-sm border-b pb-1" style={{ color: colors.text, borderColor: colors.accent }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-light mb-6 tracking-wide text-center" style={{ color: colors.primary }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="border-l-2 pl-6" style={{ borderColor: colors.accent }}>
                  <h3 className="text-lg font-medium mb-2" style={{ color: colors.primary }}>{project.name}</h3>
                  <p className="text-sm font-light mb-2" style={{ color: colors.text }}>{project.description}</p>
                  {project.technologies && (
                    <p className="text-xs font-light" style={{ color: colors.accent }}>
                      {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Interests */}
        <div className="grid grid-cols-2 gap-8">
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-xl font-light mb-4 tracking-wide text-center" style={{ color: colors.primary }}>
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span style={{ color: colors.text }}>{lang.language}</span>
                    <span className="font-light" style={{ color: colors.accent }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.interests && data.interests.length > 0 && (
            <div>
              <h2 className="text-xl font-light mb-4 tracking-wide text-center" style={{ color: colors.primary }}>
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-sm font-light" style={{ color: colors.secondary }}>
                    {interest}{index < data.interests!.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistElegantTemplate;
