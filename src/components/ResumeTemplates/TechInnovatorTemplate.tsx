
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

interface TechInnovatorTemplateProps {
  data: ResumeData;
}

const TechInnovatorTemplate: React.FC<TechInnovatorTemplateProps> = ({ data }) => {
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
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Tech Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="grid grid-cols-8 gap-1 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm"></div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            {data.personal.fullName || 'Tech Innovator'}
          </h1>
          <div className="h-1 w-20 bg-cyan-400 mb-4"></div>
          <div className="grid grid-cols-2 gap-6 text-gray-200">
            <div className="space-y-2">
              {data.personal.email && (
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                  {data.personal.email}
                </p>
              )}
              {data.personal.phone && (
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                  {data.personal.phone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {data.personal.location && (
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                  {data.personal.location}
                </p>
              )}
              {data.personal.github && (
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                  GitHub Profile
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        {data.personal.summary && (
          <div className="border-l-4 border-indigo-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-indigo-600">
              Technical Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-indigo-600">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded border-l-4 border-indigo-500">
                  <span className="text-gray-800 font-medium text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-indigo-600">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 top-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div className="absolute left-0 top-4 w-0.5 h-full bg-indigo-200"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 bg-indigo-50 px-3 py-1 rounded">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p className="text-sm text-gray-500 mt-1">{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-indigo-600">
              Featured Projects
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-indigo-600">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-indigo-600 font-medium">{edu.school}</p>
                      {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-8">
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-indigo-600">
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                    <span className="text-gray-700 font-medium">{lang.language}</span>
                    <span className="text-sm text-indigo-600 font-medium">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-indigo-600">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    {interest}
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

export default TechInnovatorTemplate;
