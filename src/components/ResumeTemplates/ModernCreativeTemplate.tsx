
import React from 'react';

interface ModernCreativeTemplateProps {
  data: {
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
      courses?: string;
      honors?: string;
    }>;
    skills: string[] | Array<{
      name: string;
      level: string;
      category: string;
    }>;
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
  };
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

const ModernCreativeTemplate: React.FC<ModernCreativeTemplateProps> = ({ data, customColors }) => {
  const colors = customColors || {
    primary: '#2563EB',
    secondary: '#1E40AF',
    accent: '#3B82F6',
    text: '#1F2937',
    background: '#FFFFFF'
  };

  const formatSkills = (skills: string[] | Array<{name: string; level: string; category: string}>) => {
    if (Array.isArray(skills) && skills.length > 0) {
      if (typeof skills[0] === 'string') {
        return (skills as string[]).join(' • ');
      } else {
        return (skills as Array<{name: string; level: string; category: string}>)
          .map(skill => skill.name)
          .join(' • ');
      }
    }
    return '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ backgroundColor: colors.background }}>
      {/* Header Section */}
      <div 
        className="text-white p-8 relative overflow-hidden"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 transform translate-x-32 -translate-y-32"
             style={{ backgroundColor: colors.accent }}></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 text-center">{data.personal.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm opacity-90">
            <span>{data.personal.email}</span>
            <span>•</span>
            <span>{data.personal.phone}</span>
            <span>•</span>
            <span>{data.personal.location}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {data.personal.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-2" 
                style={{ color: colors.primary, borderColor: colors.accent }}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-center" style={{ color: colors.text }}>
              {data.personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-2" 
                style={{ color: colors.primary, borderColor: colors.accent }}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 pl-6 relative" style={{ borderColor: colors.accent }}>
                  <div className="absolute w-3 h-3 rounded-full -left-2 top-0" 
                       style={{ backgroundColor: colors.primary }}></div>
                  <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{exp.position}</h3>
                  <p className="font-medium mb-2" style={{ color: colors.secondary }}>
                    {exp.company} | {exp.location}
                  </p>
                  <p className="text-sm mb-3" style={{ color: colors.text }}>
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <div className="text-gray-700" style={{ color: colors.text }}>
                    {exp.description.split('\n').map((line, index) => (
                      <p key={index} className="mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-2" 
                  style={{ color: colors.primary, borderColor: colors.accent }}>
                Core Skills
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <p className="text-center leading-relaxed" style={{ color: colors.text }}>
                  {formatSkills(data.skills)}
                </p>
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-2" 
                  style={{ color: colors.primary, borderColor: colors.accent }}>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-center">
                    <h3 className="font-semibold" style={{ color: colors.text }}>{edu.degree}</h3>
                    <p className="font-medium" style={{ color: colors.secondary }}>{edu.school}</p>
                    <p className="text-sm" style={{ color: colors.text }}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-sm mt-2" style={{ color: colors.text }}>{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Additional Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-center" style={{ color: colors.primary }}>
                Projects
              </h2>
              <div className="space-y-3">
                {data.projects.slice(0, 2).map((project) => (
                  <div key={project.id} className="text-center">
                    <h3 className="font-medium" style={{ color: colors.text }}>{project.name}</h3>
                    <p className="text-sm" style={{ color: colors.secondary }}>{project.technologies}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-center" style={{ color: colors.primary }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="text-center">
                    <p className="font-medium text-sm" style={{ color: colors.text }}>{cert.name}</p>
                    <p className="text-xs" style={{ color: colors.secondary }}>{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-center" style={{ color: colors.primary }}>
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="text-center">
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span className="font-medium">{lang.language}:</span> {lang.proficiency}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-2" 
                style={{ color: colors.primary, borderColor: colors.accent }}>
              References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.references.slice(0, 2).map((ref) => (
                <div key={ref.id} className="text-center p-4 bg-gray-50 rounded-lg" 
                     style={{ backgroundColor: `${colors.primary}05` }}>
                  <h3 className="font-semibold" style={{ color: colors.text }}>{ref.name}</h3>
                  <p className="text-sm" style={{ color: colors.secondary }}>{ref.title}</p>
                  <p className="text-sm" style={{ color: colors.secondary }}>{ref.company}</p>
                  <p className="text-xs mt-1" style={{ color: colors.text }}>{ref.email}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernCreativeTemplate;
