import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Personal {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

interface Experience {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
}

interface Education {
  degree?: string;
  school?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
  description?: string;
}

interface Skill {
  name?: string;
  [key: string]: any;
}

interface Project {
  name?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string;
  description?: string;
  link?: string;
}

interface Certification {
  name?: string;
  issuer?: string;
  date?: string;
  expiration?: string;
  credentialId?: string;
  verificationLink?: string;
}

interface Language {
  language?: string;
  proficiency?: string;
}

interface Reference {
  name?: string;
  title?: string;
  company?: string;
  relationship?: string;
  email?: string;
  phone?: string;
}

interface ResumeData {
  personal?: Personal;
  experience?: Experience[];
  education?: Education[];
  skills?: (Skill | string)[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  interests?: string[];
  references?: Reference[];
}

interface Config {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  colors: {
    primary: [number, number, number];
    secondary: [number, number, number];
    accent: [number, number, number];
    text: [number, number, number];
    lightGray: [number, number, number];
    black: [number, number, number];
    bulletColor: [number, number, number];
  };
  fonts: {
    primary: string;
  };
}

export class PDFGenerator {
  static async generateTextPDF(
    resumeData: ResumeData,
    templateId: number = 0,
    filename: string = 'resume.pdf',
    jobDescription?: string
  ): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const config: Config = {
        pageWidth: pdf.internal.pageSize.getWidth(),
        pageHeight: pdf.internal.pageSize.getHeight(),
        margin: 15,
        colors: {
          primary: [31, 73, 125],
          secondary: [79, 98, 114],
          accent: [156, 39, 6],
          text: [33, 37, 41],
          lightGray: [108, 117, 125],
          black: [0, 0, 0],
          bulletColor: [51, 51, 51],
        },
        fonts: {
          primary: 'times',
        },
      };
      let yPosition = config.margin;

      if (!resumeData) {
        throw new Error('Invalid resume data provided');
      }

      const cleanText = (text: unknown): string => {
        if (!text || typeof text !== 'string') return '';
        return text
          .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
          .replace(/[-•·‣▪▫▸▶●]/g, '') // Remove bullets and dashes
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      };

      const formatDate = (date: string | undefined, isEndDate: boolean = false): string => {
        if (!date) return isEndDate ? 'Present' : '';
        if (date.toLowerCase() === 'present') return 'Present';
        try {
          const parsedDate = new Date(date + '-01');
          return parsedDate.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
        } catch {
          return date;
        }
      };

      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > config.pageHeight - 20) {
          pdf.addPage();
          yPosition = config.margin;
          return true;
        }
        return false;
      };

      const addSectionHeader = (title: string) => {
        checkPageBreak(12);
        pdf.setFontSize(13);
        pdf.setFont(config.fonts.primary, 'bold');
        pdf.setTextColor(...config.colors.primary);
        pdf.text(title.toUpperCase(), config.margin, yPosition);
        yPosition += 3;
        pdf.setDrawColor(...config.colors.primary);
        pdf.setLineWidth(0.6);
        pdf.line(config.margin, yPosition, config.pageWidth - config.margin, yPosition);
        yPosition += 5;
      };

      const addText = (
        text: string,
        fontSize = 10,
        fontStyle = 'normal',
        indent = 0,
        color = config.colors.text
      ) => {
        if (!text) return;
        pdf.setFontSize(fontSize);
        pdf.setFont(config.fonts.primary, fontStyle);
        pdf.setTextColor(...color);
        const maxWidth = config.pageWidth - 2 * config.margin - indent;
        const lines = pdf.splitTextToSize(cleanText(text), maxWidth);
        for (const line of lines) {
          checkPageBreak(fontSize * 0.5);
          pdf.text(line, config.margin + indent, yPosition);
          yPosition += fontSize * 0.5;
        }
        yPosition += 1;
      };

      const addBulletPoints = (text: string, indent = 10, showBullets = true) => {
        if (!text) return;
        const bullets = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        for (const bullet of bullets) {
          checkPageBreak(5);
          const cleanBullet = bullet.replace(/^[-•·‣▪▫▸▶●\s]*/, '').trim();
          if (showBullets && cleanBullet) {
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'bold');
            pdf.setTextColor(...config.colors.bulletColor);
            pdf.text('•', config.margin + indent, yPosition);
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.text);
            const maxWidth = config.pageWidth - 2 * config.margin - indent - 4;
            const wrappedLines = pdf.splitTextToSize(cleanBullet, maxWidth);
            if (wrappedLines.length > 0) {
              pdf.text(wrappedLines[0], config.margin + indent + 4, yPosition);
              yPosition += 4;
              for (let j = 1; j < wrappedLines.length; j++) {
                checkPageBreak(4);
                pdf.text(wrappedLines[j], config.margin + indent + 4, yPosition);
                yPosition += 4;
              }
            }
          } else if (cleanBullet) {
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.text);
            const maxWidth = config.pageWidth - 2 * config.margin - indent;
            const wrappedLines = pdf.splitTextToSize(cleanBullet, maxWidth);
            for (const line of wrappedLines) {
              checkPageBreak(4);
              pdf.text(line, config.margin + indent, yPosition);
              yPosition += 4;
            }
          }
        }
      };

      // ATS Optimization: Embed job description
      if (jobDescription && jobDescription.trim()) {
        pdf.setFontSize(0.1);
        pdf.setTextColor(255, 255, 255);
        const fullJobDescription = cleanText(jobDescription);
        const maxChunkLength = 500;
        const chunks = [];
        for (let i = 0; i < fullJobDescription.length; i += maxChunkLength) {
          chunks.push(fullJobDescription.substring(i, i + maxChunkLength));
        }
        let embedYPosition = config.margin + 5;
        chunks.forEach((chunk, index) => {
          const xOffset = config.margin + (index % 3) * 50;
          pdf.text(chunk, xOffset, embedYPosition + index * 2);
        });
        pdf.setTextColor(...config.colors.text);
        console.log(`ATS Optimization: Embedded job description (${fullJobDescription.length} characters)`);
      }

      // Header section
      if (resumeData.personal?.fullName) {
        pdf.setFontSize(26);
        pdf.setFont(config.fonts.primary, 'bold');
        pdf.setTextColor(...config.colors.primary);
        const nameText = cleanText(resumeData.personal.fullName);
        const nameWidth = pdf.getTextWidth(nameText);
        const nameX = (config.pageWidth - nameWidth) / 2;
        pdf.text(nameText, nameX, yPosition);
        yPosition += 10;

        pdf.setDrawColor(...config.colors.accent);
        pdf.setLineWidth(0.8);
        const lineWidth = nameWidth * 0.6;
        const lineX = (config.pageWidth - lineWidth) / 2;
        pdf.line(lineX, yPosition - 2, lineX + lineWidth, yPosition - 2);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont(config.fonts.primary, 'normal');
        pdf.setTextColor(...config.colors.secondary);
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
        if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
        if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' • ');
          const contactWidth = pdf.getTextWidth(contactText);
          const contactX = (config.pageWidth - contactWidth) / 2;
          pdf.text(contactText, contactX, yPosition);
          yPosition += 4;
        }
        yPosition += 5;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Executive Summary');
        pdf.setDrawColor(...config.colors.lightGray);
        pdf.setLineWidth(0.2);
        const summaryStartY = yPosition;
        addText(resumeData.personal.summary, 10, 'normal', 6);
        pdf.line(config.margin + 2, summaryStartY - 3, config.margin + 2, yPosition - 3);
        yPosition += 3;
      }

      // Experience
      if (resumeData.experience?.length) {
        addSectionHeader('Professional Experience');
        for (let expIndex = 0; expIndex < resumeData.experience.length; expIndex++) {
          const exp = resumeData.experience[expIndex];
          checkPageBreak(20);
          pdf.setFontSize(12);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.primary);
          pdf.text(cleanText(exp.position || 'Position'), config.margin, yPosition);
          yPosition += 5;
          pdf.setFontSize(10);
          pdf.setFont(config.fonts.primary, 'bolditalic');
          pdf.setTextColor(...config.colors.accent);
          const companyInfo = cleanText(exp.company || 'Company');
          pdf.text(companyInfo, config.margin, yPosition);
          if (exp.startDate || exp.endDate) {
            const startDate = formatDate(exp.startDate);
            const endDate = formatDate(exp.endDate, true);
            const dateInfo = `${startDate} – ${endDate}`;
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.secondary);
            const dateWidth = pdf.getTextWidth(dateInfo);
            pdf.text(dateInfo, config.pageWidth - config.margin - dateWidth, yPosition);
          }
          yPosition += 4;
          if (exp.location) {
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'italic');
            pdf.setTextColor(...config.colors.lightGray);
            pdf.text(cleanText(exp.location), config.margin, yPosition);
            yPosition += 3;
          }
          pdf.setDrawColor(...config.colors.lightGray);
          pdf.setLineWidth(0.2);
          pdf.line(config.margin, yPosition, config.pageWidth - config.margin, yPosition);
          yPosition += 4;
          if (exp.description) {
            addBulletPoints(exp.description, 6, true);
          }
          yPosition += expIndex < resumeData.experience.length - 1 ? 4 : 2;
        }
      }

      // Education
      if (resumeData.education?.length) {
        addSectionHeader('Education');
        for (let eduIndex = 0; eduIndex < resumeData.education.length; eduIndex++) {
          const edu = resumeData.education[eduIndex];
          checkPageBreak(12);
          pdf.setFontSize(11);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.primary);
          pdf.text(cleanText(edu.degree || 'Degree'), config.margin, yPosition);
          if (edu.startDate || edu.endDate) {
            const startDate = formatDate(edu.startDate);
            const endDate = formatDate(edu.endDate, true);
            const dateInfo = startDate ? `${startDate} – ${endDate}` : endDate;
            const dateWidth = pdf.getTextWidth(dateInfo);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.secondary);
            pdf.text(dateInfo, config.pageWidth - config.margin - dateWidth, yPosition);
          }
          yPosition += 4;
          pdf.setFontSize(10);
          pdf.setFont(config.fonts.primary, 'italic');
          pdf.setTextColor(...config.colors.accent);
          pdf.text(cleanText(edu.school || 'School'), config.margin, yPosition);
          yPosition += 3;
          const locationGPA = [];
          if (edu.location) locationGPA.push(cleanText(edu.location));
          if (edu.gpa) locationGPA.push(`GPA: ${cleanText(edu.gpa)}`);
          if (locationGPA.length > 0) {
            pdf.setFontSize(8);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.lightGray);
            pdf.text(locationGPA.join(' • '), config.margin, yPosition);
            yPosition += 3;
          }
          if (edu.description) {
            yPosition += 1;
            addBulletPoints(edu.description, 6, true);
            yPosition -= 1;
          }
          yPosition += eduIndex < resumeData.education.length - 1 ? 3 : 5;
        }
      }

      // Skills
      if (!resumeData.skills?.length) return;

      addSectionHeader('Core Competencies & Technical Skills');

      const skillsArray = (Array.isArray(resumeData.skills) ? resumeData.skills : [])
        .map(skill => typeof skill === 'object' && skill?.name ? skill.name : String(skill))
        .filter(skill => skill?.trim());

      if (!skillsArray.length) return;

      const settings = {
        fontSize: 10,
        lineHeight: 4,
        indent: 6,
        spacingAfter: 3,
        maxWidth: config.pageWidth - 2 * config.margin - 6,
      };

      pdf.setFontSize(settings.fontSize);
      pdf.setFont(config.fonts.primary, 'normal');
      pdf.setTextColor(...config.colors.text);

      const skillsText = skillsArray
        .map(skill => cleanText(skill))
        .sort()
        .join(' • ');

      const lines = pdf.splitTextToSize(skillsText, settings.maxWidth);

      lines.forEach((line: string) => {
        checkPageBreak(settings.lineHeight);
        pdf.text(line, config.margin + settings.indent, yPosition);
        yPosition += settings.lineHeight;
      });

      yPosition += settings.spacingAfter;

      // Projects
      if (resumeData.projects?.length) {
        addSectionHeader('Notable Projects');
        for (let projIndex = 0; projIndex < resumeData.projects.length; projIndex++) {
          const project = resumeData.projects[projIndex];
          if (!project.name || !project.name.trim()) continue;
          checkPageBreak(25);
          pdf.setFontSize(12);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.primary);
          pdf.text(cleanText(project.name), config.margin, yPosition);
          yPosition += 5;
          if (project.startDate || project.endDate || project.technologies) {
            if (project.startDate || project.endDate) {
              pdf.setFontSize(9);
              pdf.setFont(config.fonts.primary, 'bolditalic');
              pdf.setTextColor(...config.colors.accent);
              const startDate = formatDate(project.startDate);
              const endDate = formatDate(project.endDate, true);
              const dateInfo = `${startDate} – ${endDate}`;
              pdf.text(dateInfo, config.margin, yPosition);
              if (project.technologies) {
                const dateWidth = pdf.getTextWidth(dateInfo);
                const rightAlign = config.pageWidth - config.margin - pdf.getTextWidth(`Tech: ${cleanText(project.technologies)}`);
                if (rightAlign > config.margin + dateWidth + 15) {
                  pdf.text(`Tech: ${cleanText(project.technologies)}`, rightAlign, yPosition);
                } else {
                  yPosition += 4;
                  pdf.setFont(config.fonts.primary, 'italic');
                  pdf.setTextColor(...config.colors.secondary);
                  pdf.text(`Tech: ${cleanText(project.technologies)}`, config.margin, yPosition);
                }
              }
              yPosition += 4;
            } else if (project.technologies) {
              pdf.setFontSize(9);
              pdf.setFont(config.fonts.primary, 'italic');
              pdf.setTextColor(...config.colors.secondary);
              pdf.text(`Technologies: ${cleanText(project.technologies)}`, config.margin, yPosition);
              yPosition += 4;
            }
          }
          pdf.setDrawColor(...config.colors.lightGray);
          pdf.setLineWidth(0.2);
          pdf.line(config.margin, yPosition, config.pageWidth - config.margin, yPosition);
          yPosition += 4;
          if (project.description) {
            addBulletPoints(project.description, 6, true);
          }
          if (project.link) {
            yPosition += 1;
            pdf.setFontSize(8);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.accent);
            const linkText = `Link: ${cleanText(project.link)}`;
            const linkWidth = pdf.getTextWidth(linkText);
            pdf.setFillColor(248, 249, 250);
            pdf.rect(config.margin - 1, yPosition - 3, linkWidth + 2, 5, 'F');
            pdf.text(linkText, config.margin, yPosition);
            yPosition += 5;
          }
          yPosition += projIndex < resumeData.projects.length - 1 ? 6 : 3;
        }
      }

      // Certifications
      if (resumeData.certifications?.length) {
        addSectionHeader('Professional Certifications');
        for (let certIndex = 0; certIndex < resumeData.certifications.length; certIndex++) {
          const cert = resumeData.certifications[certIndex];
          checkPageBreak(10);
          pdf.setFontSize(11);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.primary);
          pdf.text(cleanText(cert.name), config.margin, yPosition);
          yPosition += 4;
          const certDetails = [];
          if (cert.issuer) certDetails.push(cleanText(cert.issuer));
          if ( cert.date ) certDetails.push(cleanText(cert.date));
          if (certDetails.length > 0) {
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'italic');
            pdf.setTextColor(...config.colors.accent);
            pdf.text(`Issued by: ${certDetails.join(' • ')}`, config.margin, yPosition);
            yPosition += 3;
          }
          if (cert.expiration) {
            pdf.setFontSize(8);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.secondary);
            pdf.text(`Expires: ${cleanText(cert.expiration)}`, config.margin, yPosition);
            yPosition += 3;
          }
          if (cert.credentialId) {
            pdf.setFontSize(8);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.lightGray);
            pdf.text(`Credential ID: ${cleanText(cert.credentialId)}`, config.margin, yPosition);
            yPosition += 3;
          }
          if (cert.verificationLink) {
            pdf.setFontSize(8);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.accent);
            const verifyText = `Verify: ${cleanText(cert.verificationLink)}`;
            const verifyWidth = pdf.getTextWidth(verifyText);
            pdf.setFillColor(248, 249, 250);
            pdf.rect(config.margin - 1, yPosition - 3, verifyWidth + 2, 5, 'F');
            pdf.text(verifyText, config.margin, yPosition);
            yPosition += 3;
          }
          if (certIndex < resumeData.certifications.length - 1) {
            pdf.setDrawColor(...config.colors.lightGray);
            pdf.setLineWidth(0.1);
            pdf.line(config.margin, yPosition + 2, config.pageWidth - config.margin, yPosition + 2);
            yPosition += 4;
          } else {
            yPosition += 2;
          }
        }
        yPosition += 3;
      }

      // Languages
      if (resumeData.languages?.length) {
        addSectionHeader('Languages');
        const settings = {
          fontSize: 10,
          lineHeight: 4,
          indent: 6,
          spacingAfter: 3,
          maxWidth: config.pageWidth - 2 * config.margin - 6,
        };
        pdf.setFontSize(settings.fontSize);
        pdf.setFont(config.fonts.primary, 'normal');
        pdf.setTextColor(...config.colors.text);
        const languagesList = resumeData.languages
          .map((lang: Language) => `${cleanText(lang.language)} (${cleanText(lang.proficiency)})`)
          .sort()
          .join(' • ');
        const lines = pdf.splitTextToSize(languagesList, settings.maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(settings.lineHeight);
          pdf.text(line, config.margin + settings.indent, yPosition);
          yPosition += settings.lineHeight;
        });
        yPosition += settings.spacingAfter;
      }

      // Interests
      if (resumeData.interests?.length) {
        addSectionHeader('Professional Interests');
        const settings = {
          fontSize: 10,
          lineHeight: 4,
          indent: 6,
          spacingAfter: 3,
          maxWidth: config.pageWidth - 2 * config.margin - 6,
        };
        pdf.setFontSize(settings.fontSize);
        pdf.setFont(config.fonts.primary, 'normal');
        pdf.setTextColor(...config.colors.text);
        const interestsText = resumeData.interests
          .filter((interest: string) => interest && interest.trim())
          .map((interest: string) => cleanText(interest))
          .sort()
          .join(' • ');
        const lines = pdf.splitTextToSize(interestsText, settings.maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(settings.lineHeight);
          pdf.text(line, config.margin + settings.indent, yPosition);
          yPosition += settings.lineHeight;
        });
        yPosition += settings.spacingAfter;
      }

      // References
      if (resumeData.references?.length) {
        addSectionHeader('Professional References');
        for (let refIndex = 0; refIndex < resumeData.references.length; refIndex++) {
          const ref = resumeData.references[refIndex];
          checkPageBreak(20);
          pdf.setFontSize(11);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.primary);
          pdf.text(cleanText(ref.name || 'Reference'), config.margin, yPosition);
          yPosition += 5;
          pdf.setFontSize(10);
          pdf.setFont(config.fonts.primary, 'italic');
          pdf.setTextColor(...config.colors.accent);
          const titleCompany = [];
          if (ref.title) titleCompany.push(cleanText(ref.title));
          if (ref.company) titleCompany.push(cleanText(ref.company));
          if (titleCompany.length > 0) {
            pdf.text(titleCompany.join(' at '), config.margin, yPosition);
            yPosition += 3;
          }
          if (ref.relationship) {
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.secondary);
            pdf.text(`Professional Relationship: ${cleanText(ref.relationship)}`, config.margin, yPosition);
            yPosition += 3;
          }
          pdf.setFontSize(9);
          pdf.setFont(config.fonts.primary, 'normal');
          pdf.setTextColor(...config.colors.text);
          const contactInfo = [];
          if (ref.email) contactInfo.push(cleanText(ref.email));
          if (ref.phone) contactInfo.push(cleanText(ref.phone));
          if (contactInfo.length > 0) {
            pdf.text(contactInfo.join(' • '), config.margin, yPosition);
            yPosition += refIndex < resumeData.references.length - 1 ? 4 : 2;
          } else {
            yPosition += refIndex < resumeData.references.length - 1 ? 3 : 2;
          }
        }
      }

      pdf.save(filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAdvancedPDF(
    resumeData: ResumeData,
    templateId: number = 0,
    filename: string = 'resume.pdf',
    jobDescription?: string
  ): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename, jobDescription);
  }
}

export default PDFGenerator;