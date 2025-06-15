
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

interface ExecutiveEliteTemplateProps {
  data: ResumeData;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

const ExecutiveEliteTemplate: React.FC<ExecutiveEliteTemplateProps> = ({ data, customColors }) => {
  const colors = customColors || {
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#D97706',
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
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm', backgroundColor: colors.background }}>
      {/* Luxury Executive Header - Centered */}
      <div className="text-white p-8 relative text-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20" style={{ background: `linear-gradient(135deg, ${colors.accent}, transparent)` }}></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-serif mb-4 tracking-tight" style={{ color: colors.accent }}>
            {data.personal.fullName || 'Executive Name'}
          </h1>
          <div className="h-1 w-24 mx-auto mb-4" style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}AA)` }}></div>
          <div className="grid grid-cols-2 gap-8 text-gray-300">
            <div className="space-y-2">
              {data.personal.email && (
                <p className="flex items-center justify-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                  {data.personal.email}
                </p>
              )}
              {data.personal.phone && (
                <p className="flex items-center justify-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                  {data.personal.phone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {data.personal.location && (
                <p className="flex items-center justify-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                  {data.personal.location}
                </p>
              )}
              {data.personal.linkedin && (
                <p className="flex items-center justify-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                  LinkedIn Profile
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Executive Summary */}
        {data.personal.summary && (
          <div className="border-l-4 pl-6 text-center" style={{ borderColor: colors.accent }}>
            <h2 className="text-2xl font-serif mb-4 tracking-wide" style={{ color: colors.primary }}>
              Executive Summary
            </h2>
            <p className="leading-relaxed text-lg font-light" style={{ color: colors.text }}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif mb-6 tracking-wide border-b-2 pb-2 text-center" style={{ color: colors.primary, borderColor: colors.accent }}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full" style={{ background: `linear-gradient(to bottom, ${colors.accent}, ${colors.accent}66)` }}></div>
                  <div className="pl-8">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: colors.primary }}>{exp.position}</h3>
                        <p className="text-lg font-medium" style={{ color: colors.accent }}>{exp.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm px-3 py-1 rounded" style={{ color: colors.secondary, backgroundColor: `${colors.secondary}11` }}>
                          {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                        </p>
                        {exp.location && <p className="text-sm mt-1" style={{ color: colors.accent }}>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="leading-relaxed whitespace-pre-line" style={{ color: colors.text }}>
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Qualifications */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif mb-6 tracking-wide border-b-2 pb-2 text-center" style={{ color: colors.primary, borderColor: colors.accent }}>
              Education & Qualifications
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {data.education.map((edu, index) => (
                <div key={index} className="p-6 rounded-lg border-l-4" style={{ backgroundColor: `${colors.secondary}08`, borderColor: colors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>{edu.degree}</h3>
                      <p className="font-medium" style={{ color: colors.accent }}>{edu.school}</p>
                      {edu.gpa && <p className="text-sm mt-1" style={{ color: colors.secondary }}>GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm" style={{ color: colors.secondary }}>
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </p>
                      {edu.location && <p className="text-sm" style={{ color: colors.accent }}>{edu.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Competencies */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif mb-6 tracking-wide border-b-2 pb-2 text-center" style={{ color: colors.primary, borderColor: colors.accent }}>
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-center p-3 rounded border-b-2" style={{ backgroundColor: `${colors.secondary}08`, borderColor: colors.accent }}>
                  <span className="font-medium" style={{ color: colors.text }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-8">
          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-xl font-serif mb-4 border-b pb-2 text-center" style={{ color: colors.primary, borderColor: `${colors.accent}66` }}>
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: colors.text }}>{lang.language}</span>
                    <span className="text-sm px-2 py-1 rounded" style={{ color: colors.accent, backgroundColor: `${colors.accent}22` }}>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-xl font-serif mb-4 border-b pb-2 text-center" style={{ color: colors.primary, borderColor: `${colors.accent}66` }}>
                Professional Interests
              </h3>
              <div className="space-y-1">
                {data.interests.map((interest, index) => (
                  <p key={index} style={{ color: colors.text }}>
                    • {interest}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif mb-6 tracking-wide border-b-2 pb-2 text-center" style={{ color: colors.primary, borderColor: colors.accent }}>
              Professional Certifications
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="p-4 rounded border-l-4" style={{ backgroundColor: `${colors.secondary}08`, borderColor: colors.accent }}>
                  <h4 className="font-semibold" style={{ color: colors.primary }}>{cert.name}</h4>
                  <p className="text-sm" style={{ color: colors.accent }}>{cert.issuer}</p>
                  <p className="text-sm" style={{ color: colors.secondary }}>{formatDate(cert.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveEliteTemplate;
