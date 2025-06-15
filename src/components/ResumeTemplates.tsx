import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, ExternalLink, Award, Globe, Linkedin, Github } from 'lucide-react';

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
  jobDescription?: string; // Hidden ATS keywords
}

interface ResumeTemplateProps {
  data: ResumeData;
  templateId: number;
}

// Template 0: Modern Professional (Resume.io inspired)
export const ModernProfessionalTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Header Section */}
    <div className="bg-slate-800 text-white p-8">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || 'Your Name'}</h1>
          <p className="text-slate-300 text-lg mb-4">Professional Summary</p>
          {data.personal.summary && (
            <p className="text-slate-200 leading-relaxed max-w-2xl">{data.personal.summary}</p>
          )}
        </div>
        
        <div className="ml-8 text-right space-y-2">
          {data.personal.email && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{data.personal.location}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <Linkedin className="w-4 h-4" />
              <span className="text-sm">LinkedIn</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="p-8 space-y-8">
      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-slate-300 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{exp.position}</h3>
                    <p className="text-slate-600 font-medium">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-slate-100 text-slate-800 border-slate-300 px-4 py-2">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.school} • {edu.location}</p>
                </div>
                <span className="text-slate-500 text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 1: Executive Leadership
export const ExecutiveTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-serif max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Elegant Header */}
    <div className="border-b-4 border-amber-600 pb-8 mb-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">{data.personal.fullName || 'Your Name'}</h1>
        <div className="w-32 h-1 bg-amber-600 mx-auto mb-4"></div>
        <div className="flex justify-center gap-8 text-gray-600">
          {data.personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{data.personal.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-8">
      {/* Executive Summary */}
      {data.personal.summary && (
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-lg">{data.personal.summary}</p>
        </section>
      )}

      {/* Leadership Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Leadership Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-amber-700 font-semibold text-lg">{exp.company}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                  <span className="text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 2: Creative Designer
export const CreativeTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Creative Header */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="relative text-white p-12">
        <h1 className="text-5xl font-bold mb-4">{data.personal.fullName || 'Your Name'}</h1>
        <p className="text-purple-100 text-xl mb-6">Creative Professional</p>
        
        <div className="flex gap-6">
          {data.personal.email && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              {data.personal.email}
            </div>
          )}
          {data.personal.phone && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              {data.personal.phone}
            </div>
          )}
          {data.personal.location && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              {data.personal.location}
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="p-8 space-y-8">
      {/* Creative Vision */}
      {data.personal.summary && (
        <section>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Vision
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-gray-700 leading-relaxed text-lg">{data.personal.summary}</p>
          </div>
        </section>
      )}

      {/* Portfolio & Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Journey
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-400">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">{exp.position}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-purple-700">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Creative Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Arsenal
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium shadow-lg">
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 3: Tech Specialist
export const TechTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-gray-900 text-green-400 font-mono max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Terminal Header */}
    <div className="bg-black border border-green-400 rounded-t-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-green-300 text-sm">terminal — bash — 80x24</span>
      </div>
      
      <div className="space-y-2">
        <div className="text-green-300">$ whoami</div>
        <h1 className="text-3xl font-bold text-green-400">{data.personal.fullName || 'Your Name'}</h1>
        <div className="text-green-300">$ cat role.txt</div>
        <div className="text-green-400">Software Engineer & Tech Specialist</div>
        
        <div className="mt-4 space-y-1">
          {data.personal.email && (
            <div className="text-green-400">email: <span className="text-green-300">{data.personal.email}</span></div>
          )}
          {data.personal.phone && (
            <div className="text-green-400">phone: <span className="text-green-300">{data.personal.phone}</span></div>
          )}
          {data.personal.location && (
            <div className="text-green-400">location: <span className="text-green-300">{data.personal.location}</span></div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-6">
      {/* Summary */}
      {data.personal.summary && (
        <div className="bg-gray-800 border border-green-400 rounded p-6">
          <div className="text-green-300 mb-3">$ cat summary.md</div>
          <p className="text-green-100 leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="bg-gray-800 border border-green-400 rounded p-6">
          <div className="text-green-300 mb-4">$ ls -la experience/</div>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-green-400 pl-4">
                <div className="text-green-300 text-sm">drwxr-xr-x {exp.startDate}-{exp.endDate}</div>
                <div className="text-green-400 font-bold">{exp.position}</div>
                <div className="text-green-300">{exp.company} @ {exp.location}</div>
                <div className="text-green-100 mt-2">{exp.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {data.skills?.length > 0 && (
        <div className="bg-gray-800 border border-green-400 rounded p-6">
          <div className="text-green-300 mb-3">$ cat tech_stack.json</div>
          <div className="text-green-400">
            <div>&#123;</div>
            <div className="ml-4">"technologies": [</div>
            {data.skills.map((skill, index) => (
              <div key={index} className="ml-8 text-green-100">
                "{skill}"{index < data.skills.length - 1 ? ',' : ''}
              </div>
            ))}
            <div className="ml-4">]</div>
            <div>&#125;</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 4: Minimalist Clean
export const MinimalistTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-light max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Clean Header */}
    <div className="border-b border-gray-200 pb-12 mb-12">
      <h1 className="text-6xl font-thin text-gray-900 mb-6 tracking-wide">
        {data.personal.fullName || 'Your Name'}
      </h1>
      
      <div className="flex justify-between items-start">
        <div className="text-gray-600 space-y-2">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
        </div>
        
        {data.personal.summary && (
          <div className="max-w-lg">
            <p className="text-gray-700 leading-loose text-lg">{data.personal.summary}</p>
          </div>
        )}
      </div>
    </div>

    <div className="space-y-12">
      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-3xl font-thin text-gray-900 mb-8 tracking-wide">Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-100 pb-6">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-normal text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-sm">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-gray-600 mb-4 text-lg">{exp.company}, {exp.location}</div>
                <p className="text-gray-700 leading-loose">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-2 gap-12">
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-3xl font-thin text-gray-900 mb-6 tracking-wide">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-gray-700 py-2 border-b border-gray-100">
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-3xl font-thin text-gray-900 mb-6 tracking-wide">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-normal text-gray-900 text-lg">{edu.degree}</h3>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-gray-500 text-sm">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// Template 5: Corporate Classic
export const CorporateClassicTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-serif max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Corporate Header */}
    <div className="text-center mb-8 border-b-4 border-gray-800 pb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">{data.personal.fullName || 'Your Name'}</h1>
      <div className="text-gray-600 space-y-1">
        {data.personal.email && <div>{data.personal.email}</div>}
        {data.personal.phone && <div>{data.personal.phone}</div>}
        {data.personal.location && <div>{data.personal.location}</div>}
      </div>
    </div>

    <div className="space-y-8">
      {/* Professional Summary */}
      {data.personal.summary && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">PROFESSIONAL EXPERIENCE</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-semibold">{exp.company}, {exp.location}</p>
                  </div>
                  <span className="text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-2 gap-8">
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">CORE COMPETENCIES</h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-gray-700">• {skill}</div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">EDUCATION</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <div className="text-gray-700">{edu.school}</div>
                  <div className="text-gray-600">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// Template 6: Professional Blue (Inspired by first example)
export const ProfessionalBlueTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Blue Header Section */}
    <div className="bg-blue-800 text-white p-8 mb-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || 'John Masinde'}</h1>
        <p className="text-blue-200 text-lg mb-4">
          {data.personal.phone} | {data.personal.email} | {data.personal.location}
        </p>
      </div>
    </div>

    <div className="px-8 space-y-6">
      {/* Education Section */}
      {data.education?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-1">EDUCATION</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{edu.school} ({edu.degree})</h3>
                  <p className="text-gray-600 italic">{edu.degree}</p>
                  <p className="text-gray-600">GPA: {edu.gpa || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{edu.location}</p>
                  <p className="text-gray-600">{edu.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-1">WORK & LEADERSHIP EXPERIENCE</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{exp.company} ({exp.position})</h3>
                    <p className="text-gray-600 italic">{exp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.location}</p>
                    <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <ul className="text-gray-700 ml-4 space-y-1">
                  {exp.description.split('.').filter(item => item.trim()).map((item, idx) => (
                    <li key={idx} className="list-disc">{item.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-1">SKILLS, ACTIVITIES & INTERESTS</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Technical Skills:</h3>
              <ul className="text-gray-700 space-y-1">
                {data.skills.slice(0, Math.ceil(data.skills.length/2)).map((skill, index) => (
                  <li key={index} className="list-disc ml-4">{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Additional Skills:</h3>
              <ul className="text-gray-700 space-y-1">
                {data.skills.slice(Math.ceil(data.skills.length/2)).map((skill, index) => (
                  <li key={index} className="list-disc ml-4">{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 7: Legal Professional (Inspired by third example)
export const LegalProfessionalTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-serif max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Header */}
    <div className="text-center mb-8 border-b-2 border-orange-500 pb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personal.fullName || 'LAWRENCE SAHIHI'}</h1>
      <p className="text-orange-600 text-lg font-medium mb-3">
        Corporate Lawyer | Contract Negotiation | Compliance
      </p>
      <p className="text-gray-600">
        {data.personal.phone} • {data.personal.email} • {data.personal.location}
      </p>
    </div>

    <div className="space-y-8">
      {/* Summary */}
      {data.personal.summary && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{exp.company}</h3>
                    <p className="text-orange-600 font-semibold">{exp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.location}</p>
                    <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <ul className="text-gray-700 ml-4 space-y-1">
                  {exp.description.split('.').filter(item => item.trim()).map((item, idx) => (
                    <li key={idx} className="list-disc">{item.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Achievements */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Key Achievements</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-orange-50 p-4 rounded">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-bold text-orange-800">Contract Negotiation Savings</h3>
            <p className="text-sm text-gray-600">Achieved over KES 150 million in annual savings</p>
          </div>
          <div className="text-center bg-orange-50 p-4 rounded">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-bold text-orange-800">Compliance Training Implementation</h3>
            <p className="text-sm text-gray-600">Reduced regulatory violations by 25%</p>
          </div>
          <div className="text-center bg-orange-50 p-4 rounded">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-bold text-orange-800">Litigation Success Rate</h3>
            <p className="text-sm text-gray-600">Maintained a 90% success rate in litigation</p>
          </div>
        </div>
      </section>

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 8: Engineering Focus (Inspired by electrical engineer examples)
export const EngineeringFocusTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personal.fullName || 'Jensen Barasa'}</h1>
      <p className="text-blue-600 text-xl font-medium mb-3">Electrical Engineer | Power Systems Expert</p>
      <p className="text-gray-600">{data.personal.email} {data.personal.location}</p>
    </div>

    <div className="space-y-8">
      {/* Summary */}
      {data.personal.summary && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">SUMMARY</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">EXPERIENCE</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.location}</p>
                    <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <div className="text-gray-700 ml-4">
                  <p className="mb-2">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Strengths */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">STRENGTHS</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="text-blue-600 font-bold mb-2">Project Management</h3>
            <p className="text-gray-700 text-sm">Successfully led and managed over 10 electrical infrastructure projects</p>
          </div>
          <div>
            <h3 className="text-blue-600 font-bold mb-2">Technical Expertise</h3>
            <p className="text-gray-700 text-sm">In-depth knowledge of power systems, heat tracing and electrical distribution</p>
          </div>
          <div>
            <h3 className="text-blue-600 font-bold mb-2">Collaborative Leadership</h3>
            <p className="text-gray-700 text-sm">Efficiently coordinated with cross-functional teams and engineering contractors</p>
          </div>
        </div>
      </section>

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">SKILLS</h2>
          <div className="text-gray-700">
            <p>{data.skills.join(', ')}</p>
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 9: Data Specialist (Inspired by data collection specialist example)
export const DataSpecialistTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Header */}
    <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personal.fullName || 'BRIANNA SUBIRA PENDO'}</h1>
      <p className="text-blue-600 text-lg font-medium mb-3">
        Quantitative Field Interviewer | Data Collection Specialist
      </p>
      <p className="text-gray-600">
        {data.personal.email} • {data.personal.location}
      </p>
    </div>

    <div className="space-y-8">
      {/* Summary */}
      {data.personal.summary && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-blue-600 font-bold text-lg">{exp.company}</h3>
                    <p className="font-semibold text-gray-800">{exp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.location}</p>
                    <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <ul className="text-gray-700 ml-4 space-y-1">
                  {exp.description.split('.').filter(item => item.trim()).map((item, idx) => (
                    <li key={idx} className="list-disc">{item.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Skills</h2>
          <div className="text-gray-700">
            <p>{data.skills.join(' • ')}</p>
          </div>
        </section>
      )}

      {/* Passions */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Passions</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-blue-800 mb-1">Data Integrity</h3>
            <p className="text-sm text-gray-600">Maintaining high data integrity standards</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-blue-800 mb-1">Field Research</h3>
            <p className="text-sm text-gray-600">Passionate about conducting field research</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-blue-800 mb-1">Community Engagement</h3>
            <p className="text-sm text-gray-600">Dedicated to engaging with communities</p>
          </div>
        </div>
      </section>
    </div>
  </div>
);

// Template 10: Supply Chain Manager (Inspired by supply chain example)
export const SupplyChainTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personal.fullName || 'MILES OMARI'}</h1>
      <p className="text-green-600 text-lg font-medium mb-3">
        Supply Chain Manager | Continuous Improvement | Strategy Execution
      </p>
      <p className="text-gray-600">
        {data.personal.phone} • {data.personal.email} • {data.personal.location}
      </p>
      <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
    </div>

    <div className="space-y-8">
      {/* Summary */}
      {data.personal.summary && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-green-600 font-bold text-lg">{exp.company}</h3>
                    <p className="font-semibold text-gray-800">{exp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.location}</p>
                    <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <ul className="text-gray-700 ml-4 space-y-1">
                  {exp.description.split('.').filter(item => item.trim()).map((item, idx) => (
                    <li key={idx} className="list-disc">{item.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Achievements */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Key Achievements</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-green-50 p-4 rounded">
            <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-green-800">Redesigned Inventory Process</h3>
            <p className="text-sm text-gray-600">Successfully improving cash flow by 40%</p>
          </div>
          <div className="text-center bg-green-50 p-4 rounded">
            <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-green-800">Leader in Rapid Conflict Resolution</h3>
            <p className="text-sm text-gray-600">Reducing downtime related to supplier disputes by 50%</p>
          </div>
          <div className="text-center bg-green-50 p-4 rounded">
            <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-green-800">OEE Metrics Overhaul</h3>
            <p className="text-sm text-gray-600">Increased Overall Equipment Effectiveness by 18%</p>
          </div>
        </div>
      </section>

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Skills</h2>
          <div className="text-gray-700">
            <p>{data.skills.join(' • ')}</p>
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 11: Clean Modern (Inspired by clean designs)
export const CleanModernTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-light max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Clean Header */}
    <div className="mb-12">
      <h1 className="text-5xl font-thin text-gray-900 mb-4 tracking-wide">
        {data.personal.fullName || 'Your Name'}
      </h1>
      <div className="h-px bg-gray-300 mb-6"></div>
      <div className="flex justify-between items-start">
        <div className="text-gray-600 space-y-1">
          {data.personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{data.personal.email}</div>}
          {data.personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{data.personal.phone}</div>}
          {data.personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{data.personal.location}</div>}
        </div>
        {data.personal.summary && (
          <div className="max-w-lg">
            <p className="text-gray-700 leading-loose">{data.personal.summary}</p>
          </div>
        )}
      </div>
    </div>

    <div className="space-y-12">
      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-thin text-gray-900 mb-8 tracking-wide">Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-normal text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-sm">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-gray-600 mb-3">{exp.company}, {exp.location}</div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-2 gap-12">
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 tracking-wide">Skills</h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-gray-700 py-1 border-b border-gray-100 text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 tracking-wide">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-normal text-gray-900">{edu.degree}</h3>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-gray-500 text-sm">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// Template 12: Marketing Creative
export const MarketingCreativeTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Creative Marketing Header */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 mb-6">
      <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || 'Your Name'}</h1>
      <p className="text-orange-100 text-xl mb-4">Marketing Creative Professional</p>
      <div className="flex gap-6 text-orange-100">
        {data.personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{data.personal.email}</div>}
        {data.personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{data.personal.phone}</div>}
        {data.personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{data.personal.location}</div>}
      </div>
    </div>

    <div className="p-8 space-y-8">
      {/* Brand Story */}
      {data.personal.summary && (
        <section>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Brand Story</h2>
          <p className="text-gray-700 leading-relaxed bg-orange-50 p-6 rounded-lg">{data.personal.summary}</p>
        </section>
      )}

      {/* Campaign Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-orange-600 mb-6">Campaign Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-orange-800">{exp.position}</h3>
                    <p className="text-orange-600 font-semibold">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Creative Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-orange-600 mb-6">Creative Arsenal</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 13: Academic Scholar
export const AcademicScholarTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-serif max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Academic Header */}
    <div className="text-center mb-8 border-b-2 border-blue-800 pb-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">{data.personal.fullName || 'Your Name'}</h1>
      <p className="text-blue-700 text-lg mb-4">Academic Scholar & Researcher</p>
      <div className="text-gray-600 space-y-1">
        {data.personal.email && <div>{data.personal.email}</div>}
        {data.personal.phone && <div>{data.personal.phone}</div>}
        {data.personal.location && <div>{data.personal.location}</div>}
      </div>
    </div>

    <div className="space-y-8">
      {/* Research Profile */}
      {data.personal.summary && (
        <section>
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">Research Profile</h2>
          <p className="text-gray-700 leading-relaxed italic">{data.personal.summary}</p>
        </section>
      )}

      {/* Academic Positions */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">Academic Positions</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">{exp.position}</h3>
                    <p className="text-blue-700 italic">{exp.company}, {exp.location}</p>
                  </div>
                  <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-700 leading-relaxed ml-4">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Research Interests */}
      <div className="grid grid-cols-2 gap-8">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-blue-900">{edu.degree}</h3>
                  <div className="text-blue-700 italic">{edu.school}</div>
                  <div className="text-gray-600">{edu.endDate}</div>
                  {edu.gpa && <div className="text-gray-600 text-sm">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">Research Interests</h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-gray-700">• {skill}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// Template 14: Sales Champion
export const SalesChampionTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Sales Header */}
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 mb-6">
      <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || 'Your Name'}</h1>
      <p className="text-green-100 text-xl mb-4">Sales Champion & Revenue Driver</p>
      <div className="flex gap-6 text-green-100">
        {data.personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{data.personal.email}</div>}
        {data.personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{data.personal.phone}</div>}
        {data.personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{data.personal.location}</div>}
      </div>
    </div>

    <div className="p-8 space-y-8">
      {/* Sales Philosophy */}
      {data.personal.summary && (
        <section>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Sales Philosophy</h2>
          <p className="text-gray-700 leading-relaxed bg-green-50 p-6 rounded-lg border-l-4 border-green-500">{data.personal.summary}</p>
        </section>
      )}

      {/* Sales Performance */}
      <section>
        <h2 className="text-2xl font-bold text-green-600 mb-6">Key Achievements</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-green-50 p-6 rounded-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-bold text-green-800 text-xl">150%</h3>
            <p className="text-sm text-gray-600">Average Quota Achievement</p>
          </div>
          <div className="text-center bg-blue-50 p-6 rounded-lg">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-blue-800 text-xl">$2M+</h3>
            <p className="text-sm text-gray-600">Annual Revenue Generated</p>
          </div>
          <div className="text-center bg-green-50 p-6 rounded-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-bold text-green-800 text-xl">95%</h3>
            <p className="text-sm text-gray-600">Client Retention Rate</p>
          </div>
        </div>
      </section>

      {/* Sales Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-green-600 mb-6">Sales Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-green-800">{exp.position}</h3>
                    <p className="text-green-600 font-semibold">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 15: Consulting Elite
export const ConsultingEliteTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Elite Header */}
    <div className="text-center mb-8">
      <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-wide">{data.personal.fullName || 'Your Name'}</h1>
      <div className="w-24 h-1 bg-gray-800 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg mb-6">Strategic Consultant & Business Advisor</p>
      <div className="flex justify-center gap-8 text-gray-600">
        {data.personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{data.personal.email}</div>}
        {data.personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{data.personal.phone}</div>}
        {data.personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{data.personal.location}</div>}
      </div>
    </div>

    <div className="space-y-10">
      {/* Executive Summary */}
      {data.personal.summary && (
        <section className="text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-6 tracking-wide">Executive Summary</h2>
          <p className="text-gray-700 leading-loose max-w-4xl mx-auto text-lg">{data.personal.summary}</p>
        </section>
      )}

      {/* Consulting Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-light text-gray-800 mb-8 text-center tracking-wide">Consulting Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-baseline mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 text-lg">{exp.company}</p>
                    <p className="text-gray-500">{exp.location}</p>
                  </div>
                  <span className="text-gray-500">{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {data.skills?.length > 0 && (
        <section className="text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-8 tracking-wide">Core Competencies</h2>
          <div className="grid grid-cols-3 gap-6">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded border-l-4 border-gray-800">
                <span className="text-gray-800 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Export all templates
export const templates = [
  ModernProfessionalTemplate,    // 0
  ExecutiveTemplate,             // 1
  CreativeTemplate,              // 2
  TechTemplate,                  // 3
  MinimalistTemplate,            // 4
  CorporateClassicTemplate,      // 5
  ProfessionalBlueTemplate,      // 6
  LegalProfessionalTemplate,     // 7
  EngineeringFocusTemplate,      // 8
  DataSpecialistTemplate,        // 9
  SupplyChainTemplate,           // 10
  CleanModernTemplate,           // 11
  MarketingCreativeTemplate,     // 12
  AcademicScholarTemplate,       // 13
  SalesChampionTemplate,         // 14
  ConsultingEliteTemplate,       // 15
];

export const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',       // 0
    'Executive Leadership',      // 1
    'Creative Designer',         // 2
    'Tech Specialist',          // 3
    'Minimalist Clean',         // 4
    'Corporate Classic',        // 5
    'Professional Blue',        // 6
    'Legal Professional',       // 7
    'Engineering Focus',        // 8
    'Data Specialist',          // 9
    'Supply Chain Manager',     // 10
    'Clean Modern',             // 11
    'Marketing Creative',       // 12
    'Academic Scholar',         // 13
    'Sales Champion',           // 14
    'Consulting Elite'          // 15
  ];
  return names[index] || 'Modern Professional';
};
