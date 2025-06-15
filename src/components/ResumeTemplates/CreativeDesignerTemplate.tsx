
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

interface CreativeDesignerTemplateProps {
  data: ResumeData;
}

const CreativeDesignerTemplate: React.FC<CreativeDesignerTemplateProps> = ({ data }) => {
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
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl overflow-hidden" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Artistic Header with Geometric Shapes */}
      <div className="relative bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white p-8 overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 transform rotate-45 translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full transform -translate-x-24 translate-y-24"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 transform rotate-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              🎨
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">
                {data.personal.fullName || 'Creative Professional'}
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-purple-100">
            <div className="space-y-2">
              {data.personal.email && (
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  <span className="text-yellow-400">✉</span>
                  <span className="text-sm">{data.personal.email}</span>
                </div>
              )}
              {data.personal.phone && (
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  <span className="text-yellow-400">📱</span>
                  <span className="text-sm">{data.personal.phone}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {data.personal.location && (
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  <span className="text-yellow-400">📍</span>
                  <span className="text-sm">{data.personal.location}</span>
                </div>
              )}
              {data.personal.website && (
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  <span className="text-yellow-400">🌐</span>
                  <span className="text-sm">Portfolio</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Creative Summary */}
      {data.personal.summary && (
        <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-purple-500 mr-2">✨</span>
              Creative Vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              "{data.personal.summary}"
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-0">
        {/* Creative Sidebar */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-6 space-y-6">
          {/* Skills Palette */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-purple-500 mr-2">🎯</span>
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.slice(0, 10).map((skill, index) => {
                  const colors = ['bg-purple-100 border-purple-400 text-purple-800', 'bg-pink-100 border-pink-400 text-pink-800', 'bg-indigo-100 border-indigo-400 text-indigo-800', 'bg-yellow-100 border-yellow-400 text-yellow-800'];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={index} className={`p-2 rounded-lg border-l-4 ${colorClass}`}>
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Creative Tools */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-pink-500 mr-2">🗣️</span>
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg shadow-sm border-l-4 border-pink-400">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{lang.language}</span>
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        {lang.proficiency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests as Creative Tags */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-indigo-500 mr-2">💡</span>
                Interests
              </h3>
              <div className="flex flex-wrap gap-1">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full border border-indigo-300">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Creative Content */}
        <div className="col-span-3 p-6 space-y-6">
          {/* Experience Timeline */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-purple-500 mr-2">💼</span>
                Creative Journey
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute left-3 top-6 w-0.5 h-full bg-gradient-to-b from-purple-300 to-transparent"></div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-400">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-purple-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </p>
                          {exp.location && <p className="mt-1">{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creative Projects Showcase */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-pink-500 mr-2">🚀</span>
                Project Showcase
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((project, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      {project.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.split(',').slice(0, 3).map((tech, techIndex) => (
                          <span key={techIndex} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-indigo-500 mr-2">🎓</span>
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-indigo-600 font-medium">{edu.school}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p className="bg-indigo-100 px-2 py-1 rounded">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        {edu.location && <p className="mt-1">{edu.location}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeDesignerTemplate;
