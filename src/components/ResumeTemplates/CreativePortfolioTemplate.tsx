
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

interface CreativePortfolioTemplateProps {
  data: ResumeData;
}

const CreativePortfolioTemplate: React.FC<CreativePortfolioTemplateProps> = ({ data }) => {
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
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Creative Header with Geometric Design */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-3 tracking-tight">{data.personal.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-purple-100 mb-4">
            {data.personal.email && (
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                📧 {data.personal.email}
              </span>
            )}
            {data.personal.phone && (
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                📱 {data.personal.phone}
              </span>
            )}
            {data.personal.location && (
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                📍 {data.personal.location}
              </span>
            )}
          </div>
          {data.personal.summary && (
            <p className="text-lg leading-relaxed text-purple-50 max-w-3xl">
              {data.personal.summary}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {/* Left Sidebar */}
        <div className="bg-gray-50 p-6 space-y-6">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.slice(0, 10).map((skill, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg border-l-4 border-purple-500">
                    <span className="text-sm font-medium text-gray-800">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium">{lang.language}</span>
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                Interests
              </h3>
              <div className="flex flex-wrap gap-1">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-6 space-y-6">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-4 border-purple-200">
                    <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-2.5 top-0"></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-purple-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p className="bg-purple-100 px-2 py-1 rounded">
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

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3"></div>
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-lg border-l-4 border-pink-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-pink-600 font-medium">{edu.school}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p className="bg-pink-100 px-2 py-1 rounded">
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

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                Projects
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {data.projects.map((project, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-orange-600 font-medium">
                        Tech Stack: {project.technologies}
                      </p>
                    )}
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

export default CreativePortfolioTemplate;
