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
  relevantcourses?: string;
  courses?: string;
  honors?: string;
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
  showSeparators?: boolean;
  debug?: boolean;
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
        debug: true,
      };
      let yPosition = config.margin;

      if (!resumeData) {
        throw new Error('Invalid resume data provided');
      }

      const cleanText = (text: unknown): string => {
        if (!text || typeof text !== 'string') return '';

        let cleaned = text.normalize('NFKD')
          .replace(/[^\x20-\x7E]/g, '')
          .replace(/[-•·‣▪▫▸▶●]/g, '')
          .replace(/[\x00-\x1F\x7F]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (config.debug) {
          if (!cleaned && text) {
            console.warn(`cleanText: Input "${text}" resulted in empty output`);
          } else if (cleaned.match(/[^a-zA-Z0-9\s@._-]/)) {
            console.warn(`cleanText: Suspicious characters in "${cleaned}" from input "${text}"`);
          }
        }

        return cleaned;
      };

      const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      const isValidName = (name: string): boolean => {
        return name.length > 1 && name.length < 100 && /[a-zA-Z]/.test(name);
      };

      const validateReference = (ref: Reference): Reference => {
        const validatedRef: Reference = { ...ref };

        if (!ref.name || !isValidName(cleanText(ref.name))) {
          console.warn(`Invalid or empty reference name: "${ref.name}"`);
          validatedRef.name = 'Reference Name Not Provided';
        }

        if (ref.email && !isValidEmail(cleanText(ref.email))) {
          console.warn(`Invalid reference email: "${ref.email}"`);
          validatedRef.email = undefined;
        }

        if (ref.title) validatedRef.title = cleanText(ref.title);
        if (ref.company) validatedRef.company = cleanText(ref.company);
        if (ref.relationship) validatedRef.relationship = cleanText(ref.relationship);
        if (ref.phone) validatedRef.phone = cleanText(ref.phone);

        return validatedRef;
      };

      const formatDate = (date: string | undefined, isEndDate: boolean = false): string => {
        if (!date) return isEndDate ? 'Present' : '';
        if (date.toLowerCase() === 'present') return 'Present';
        try {
          const parsedDate = new Date(date + '-01');
          return parsedDate.toLocaleString('en-US', {
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
          checkPageBreak(25);
          pdf.setFontSize(13);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.primary);
          const degreeText = cleanText(edu.degree || 'Degree');
          pdf.text(degreeText, config.margin, yPosition);
          if (edu.startDate || edu.endDate) {
            const startDate = formatDate(edu.startDate);
            const endDate = formatDate(edu.endDate, true);
            const dateInfo = startDate ? `${startDate} – ${endDate}` : endDate;
            pdf.setFontSize(10);
            pdf.setFont(config.fonts.primary, 'bold');
            pdf.setTextColor(...config.colors.secondary);
            const dateWidth = pdf.getTextWidth(dateInfo);
            pdf.text(dateInfo, config.pageWidth - config.margin - dateWidth, yPosition);
          }
          yPosition += 6;
          pdf.setFontSize(11);
          pdf.setFont(config.fonts.primary, 'bold');
          pdf.setTextColor(...config.colors.accent);
          pdf.text(cleanText(edu.school || 'School'), config.margin, yPosition);
          yPosition += 5;
          const achievementDetails = [];
          if (edu.location) achievementDetails.push(cleanText(edu.location));
          if (edu.gpa) achievementDetails.push(`GPA: ${cleanText(edu.gpa)}`);
          if (edu.honors) achievementDetails.push(cleanText(edu.honors));
          if (achievementDetails.length > 0) {
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.secondary);
            let detailsText = achievementDetails.join(' • ');
            pdf.text(detailsText, config.margin, yPosition);
            yPosition += 5;
          }
          if (edu.description) {
            yPosition += 1;
            pdf.setFontSize(9);
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.text);
            const descriptionLines = pdf.splitTextToSize(
              cleanText(edu.description),
              config.pageWidth - 2 * config.margin - 8
            );
            descriptionLines.forEach(line => {
              checkPageBreak(4);
              pdf.text(line, config.margin + 4, yPosition);
              yPosition += 3.5;
            });
            yPosition += 2;
          }
          if (edu.courses) {
            yPosition += 3;
            pdf.setFontSize(10);
            pdf.setFont(config.fonts.primary, 'bold');
            pdf.setTextColor(...config.colors.primary);
            pdf.text('Relevant Coursework', config.margin, yPosition);
            const headerWidth = pdf.getTextWidth('Relevant Coursework');
            pdf.setLineWidth(0.3);
            pdf.setDrawColor(...config.colors.primary);
            pdf.line(config.margin, yPosition + 1, config.margin + headerWidth, yPosition + 1);
            yPosition += 6;
            const courses = edu.courses
              .split(',')
              .map(course => course.trim())
              .filter(course => course.length > 0)
              .sort();
            const maxWidth = config.pageWidth - 2 * config.margin;
            const courseIndent = config.margin + 8;
            const availableWidth = maxWidth - 16;
            const columnWidth = availableWidth / 2 - 10;
            const columnGap = 20;
            pdf.setFont(config.fonts.primary, 'normal');
            pdf.setTextColor(...config.colors.text);
            pdf.setFontSize(8.5);
            let column1Y = yPosition;
            let column2Y = yPosition;
            const lineHeight = 4;
            const midpoint = Math.ceil(courses.length / 2);
            courses.slice(0, midpoint).forEach((course, index) => {
              checkPageBreak(5);
              const courseText = `• ${course}`;
              const wrappedLines = pdf.splitTextToSize(courseText, columnWidth);
              wrappedLines.forEach((line, lineIndex) => {
                pdf.text(line, courseIndent, column1Y);
                if (lineIndex < wrappedLines.length - 1) {
                  column1Y += lineHeight - 1;
                }
              });
              column1Y += lineHeight;
            });
            courses.slice(midpoint).forEach((course, index) => {
              checkPageBreak(5);
              const courseText = `• ${course}`;
              const column2X = courseIndent + columnWidth + columnGap;
              const wrappedLines = pdf.splitTextToSize(courseText, columnWidth);
              wrappedLines.forEach((line, lineIndex) => {
                pdf.text(line, column2X, column2Y);
                if (lineIndex < wrappedLines.length - 1) {
                  column2Y += lineHeight - 1;
                }
              });
              column2Y += lineHeight;
            });
            yPosition = Math.max(column1Y, column2Y) + 2;
          }
          if (eduIndex < resumeData.education.length - 1) {
            yPosition += 4;
            pdf.setLineWidth(0.2);
            pdf.setDrawColor(...config.colors.lightGray);
            pdf.line(
              config.margin + 20,
              yPosition,
              config.pageWidth - config.margin - 20,
              yPosition
            );
            yPosition += 6;
          } else {
            yPosition += 8;
          }
        }
      }

      // Skills
      if (resumeData?.skills?.length) {
        const isValidSkill = (skill: string) => {
          const cleanSkill = skill.trim();
          if (cleanSkill.length < 3) return false;
          const excludeWords = [
            'early', 'looking', 'public', 'start', 'stage', 'sector',
            'mobility', 'transportation', 'revolutionize', 'production'
          ];
          if (excludeWords.includes(cleanSkill.toLowerCase())) return false;
          const technicalPatterns = [
            /^[A-Z]{2,}$/,
            /CAD$/i,
            /^[A-Z][a-z]+[A-Z]/,
            /Linux|Windows|Mac/i,
            /SQL|Python|Java|JavaScript|HTML|CSS/i,
          ];
          const isTechnical = technicalPatterns.some(pattern => pattern.test(cleanSkill));
          const isCapitalized = /^[A-Z]/.test(cleanSkill);
          return isTechnical || isCapitalized || cleanSkill.length > 4;
        };

        const skillsArray = Array.isArray(resumeData.skills)
          ? resumeData.skills
              .map(skill => {
                if (typeof skill === 'object' && skill !== null) {
                  return skill.name || skill.skill || skill.title || '';
                }
                return String(skill || '');
              })
              .map(skill => cleanText(skill))
              .filter(skill => skill && isValidSkill(skill))
              .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1))
              .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
          : [];

        if (skillsArray.length) {
          addSectionHeader('Core Competencies & Technical Skills');
          const settings = {
            fontSize: 10,
            lineHeight: 4.5,
            indent: 6,
            spacingAfter: 4,
            maxWidth: config.pageWidth - 2 * config.margin - 6,
            bulletPoint: '• ',
            columnGap: 20,
            minSkillsForColumns: 4
          };
          pdf.setFontSize(settings.fontSize);
          pdf.setFont(config.fonts.primary, 'normal');
          pdf.setTextColor(...config.colors.text);

          const renderSkillsInColumns = (skills: string[]) => {
            const midpoint = Math.ceil(skills.length / 2);
            const leftColumn = skills.slice(0, midpoint);
            const rightColumn = skills.slice(midpoint);
            const leftX = config.margin + settings.indent;
            const rightX = config.margin + settings.indent + (settings.maxWidth / 2) + settings.columnGap;
            const startY = yPosition;
            leftColumn.forEach((skill, index) => {
              checkPageBreak(settings.lineHeight);
              pdf.text(settings.bulletPoint + skill, leftX, yPosition);
              yPosition += settings.lineHeight;
            });
            yPosition = startY;
            rightColumn.forEach((skill, index) => {
              checkPageBreak(settings.lineHeight);
              pdf.text(settings.bulletPoint + skill, rightX, yPosition);
              yPosition += settings.lineHeight;
            });
            yPosition = startY + Math.max(leftColumn.length, rightColumn.length) * settings.lineHeight;
          };

          const renderSkillsHorizontally = (skills: string[]) => {
            const skillsText = skills.join(' • ');
            const lines = pdf.splitTextToSize(skillsText, settings.maxWidth);
            if (!lines?.length) {
              console.warn('No text lines generated for skills section');
              return;
            }
            lines.forEach(line => {
              if (typeof line === 'string' && line.trim()) {
                checkPageBreak(settings.lineHeight);
                pdf.text(line, config.margin + settings.indent, yPosition);
                yPosition += settings.lineHeight;
              }
            });
          };

          if (skillsArray.length >= settings.minSkillsForColumns) {
            renderSkillsInColumns(skillsArray);
          } else {
            renderSkillsHorizontally(skillsArray);
          }
          yPosition += settings.spacingAfter;
        }
      }

      // Projects
      if (resumeData.projects?.length) {
        addSectionHeader(' Projects');
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
        addSectionHeader(' Certifications');
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
          if (cert.date) certDetails.push(cleanText(cert.date));
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
          bulletSize: 0.8,
          columnGap: 20,
        };
        pdf.setFontSize(settings.fontSize);
        pdf.setFont(config.fonts.primary, 'normal');
        pdf.setTextColor(...config.colors.text);
        const languages = resumeData.languages
          .map((lang: Language) => ({
            name: cleanText(lang.language),
            proficiency: cleanText(lang.proficiency)
          }))
          .filter(lang => lang.name && lang.proficiency)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (languages.length <= 3) {
          languages.forEach((lang, index) => {
            checkPageBreak(settings.lineHeight);
            pdf.setFillColor(...config.colors.text);
            pdf.circle(config.margin + settings.indent, yPosition - 1, settings.bulletSize, 'F');
            const languageText = `${lang.name} (${lang.proficiency})`;
            pdf.text(languageText, config.margin + settings.indent + 4, yPosition);
            yPosition += settings.lineHeight;
          });
        } else {
          const columns = 3;
          const columnWidth = (settings.maxWidth - (columns - 1) * settings.columnGap) / columns;
          const itemsPerColumn = Math.ceil(languages.length / columns);
          let maxColumnHeight = 0;
          const startY = yPosition;
          const columnPositions = [
            config.margin + settings.indent,
            config.margin + settings.indent + columnWidth + settings.columnGap,
            config.margin + settings.indent + 2 * (columnWidth + settings.columnGap)
          ];
          for (let col = 0; col < columns; col++) {
            const startIndex = col * itemsPerColumn;
            const endIndex = Math.min(startIndex + itemsPerColumn, languages.length);
            const columnLanguages = languages.slice(startIndex, endIndex);
            if (columnLanguages.length === 0) continue;
            const columnX = columnPositions[col];
            let columnY = startY;
            columnLanguages.forEach((lang, index) => {
              if (col === 0) checkPageBreak(settings.lineHeight);
              pdf.setFillColor(...config.colors.text);
              pdf.circle(columnX, columnY - 1, settings.bulletSize, 'F');
              const languageText = `${lang.name} (${lang.proficiency})`;
              const lines = pdf.splitTextToSize(languageText, columnWidth - 6);
              pdf.text(lines[0], columnX + 4, columnY);
              columnY += settings.lineHeight;
            });
            const columnHeight = columnY - startY;
            maxColumnHeight = Math.max(maxColumnHeight, columnHeight);
          }
          yPosition = startY + maxColumnHeight;
        }
        yPosition += settings.spacingAfter;
      }

      // Interests
      if (resumeData.interests?.length) {
  addSectionHeader(' Interests');
  
  const settings = {
    fontSize: 10,
    lineHeight: 4,
    indent: 6,
    spacingAfter: 5,
    maxWidth: config.pageWidth - 2 * config.margin - 6,
    layout: 'left' // Options: 'left', 'center', 'right', 'justified'
  };
  
  pdf.setFontSize(settings.fontSize);
  pdf.setFont(config.fonts.primary, 'normal');
  pdf.setTextColor(...config.colors.text);
  
  // Clean and sort interests
  const cleanInterests = resumeData.interests
    .filter((interest: string) => interest && interest.trim())
    .map((interest: string) => cleanText(interest))
    .sort();
  
  // Create formatted text with bullet separator
  const interestsText = cleanInterests.join(' • ');
  
  // Split text into lines that fit within the width
  const lines = pdf.splitTextToSize(interestsText, settings.maxWidth);
  
  lines.forEach((line: string, index: number) => {
    checkPageBreak(settings.lineHeight + 2);
    
    let xPosition;
    const lineWidth = pdf.getTextWidth(line);
    
    switch (settings.layout) {
      case 'center':
        xPosition = (config.pageWidth - lineWidth) / 2;
        break;
      case 'right':
        xPosition = config.pageWidth - config.margin - lineWidth;
        break;
      case 'justified':
        // Only justify if not the last line and line has multiple words
        if (index < lines.length - 1 && line.includes(' ')) {
          const words = line.split(' ');
          if (words.length > 1) {
            const totalWordsWidth = words.reduce((sum, word) => sum + pdf.getTextWidth(word), 0);
            const totalSpaceNeeded = settings.maxWidth - totalWordsWidth;
            const spaceBetweenWords = totalSpaceNeeded / (words.length - 1);
            
            let currentX = config.margin + settings.indent;
            words.forEach((word, wordIndex) => {
              pdf.text(word, currentX, yPosition);
              if (wordIndex < words.length - 1) {
                currentX += pdf.getTextWidth(word) + spaceBetweenWords;
              }
            });
          } else {
            pdf.text(line, config.margin + settings.indent, yPosition);
          }
        } else {
          pdf.text(line, config.margin + settings.indent, yPosition);
        }
        break;
      case 'left':
      default:
        xPosition = config.margin + settings.indent;
        break;
    }
    
    // Only use xPosition for non-justified text
    if (settings.layout !== 'justified') {
      pdf.text(line, xPosition, yPosition);
    }
    
    yPosition += settings.lineHeight;
  });
  
  yPosition += settings.spacingAfter;
  
  // Optional: Add a subtle decorative element for center/right layouts
  if (settings.layout === 'center' || settings.layout === 'right') {
    const decorativeLineWidth = 30;
    let decorativeX;
    
    if (settings.layout === 'center') {
      decorativeX = (config.pageWidth - decorativeLineWidth) / 2;
    } else {
      decorativeX = config.pageWidth - config.margin - decorativeLineWidth;
    }
    
    pdf.setDrawColor(...config.colors.accent);
    pdf.setLineWidth(0.3);
    pdf.line(decorativeX, yPosition - 2, decorativeX + decorativeLineWidth, yPosition - 2);
    yPosition += 3;
  }
}

      // References
      if (resumeData.references?.length) {
  addSectionHeader(' References');
  for (let refIndex = 0; refIndex < resumeData.references.length; refIndex++) {
    const ref = validateReference(resumeData.references[refIndex]);
    checkPageBreak(25);
    pdf.setFontSize(12);
    pdf.setFont(config.fonts.primary, 'bold');
    pdf.setTextColor(...config.colors.primary);
    const refName = cleanText(ref.name || 'Reference Name Not Provided');
    pdf.text(refName, config.margin, yPosition);
    yPosition += 6;
    const titleCompany = [];
    if (ref.title && ref.title.trim()) titleCompany.push(cleanText(ref.title));
    if (ref.company && ref.company.trim()) titleCompany.push(cleanText(ref.company));
    if (titleCompany.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont(config.fonts.primary, 'italic');
      pdf.setTextColor(...config.colors.accent);
      const titleText = titleCompany.length === 2
        ? `${titleCompany[0]} at ${titleCompany[1]}`
        : titleCompany[0];
      pdf.text(titleText, config.margin, yPosition);
      yPosition += 5;
    }
    if (ref.relationship && ref.relationship.trim()) {
      pdf.setFontSize(9);
      pdf.setFont(config.fonts.primary, 'normal');
      pdf.setTextColor(...config.colors.secondary);
      pdf.text(`Relationship: ${cleanText(ref.relationship)}`, config.margin, yPosition);
      yPosition += 4;
    }
    const contactInfo = [];
    if (ref.email && ref.email.trim()) contactInfo.push(`Email: ${cleanText(ref.email)}`);
    if (ref.phone && ref.phone.trim()) contactInfo.push(`Phone: ${cleanText(ref.phone)}`);
    if (contactInfo.length > 0) {
      pdf.setFontSize(9);
      pdf.setFont(config.fonts.primary, 'normal');
      pdf.setTextColor(...config.colors.text);
      const contactText = contactInfo.join('  |  ');
      const textWidth = pdf.getTextWidth(contactText);
      const maxWidth = pdf.internal.pageSize.width - (config.margin * 2);
      if (textWidth > maxWidth) {
        contactInfo.forEach((contact, index) => {
          pdf.text(contact, config.margin, yPosition);
          yPosition += 3;
        });
      } else {
        pdf.text(contactText, config.margin, yPosition);
        yPosition += 4;
      }
    }
    if (refIndex < resumeData.references.length - 1) {
      yPosition += 2; // Increased spacing before line
      // Add thin, visible separator line
      pdf.setDrawColor(...config.colors.lightGray);
      pdf.setLineWidth(0.1);
      pdf.line(config.margin, yPosition, config.pageWidth - config.margin, yPosition);
      yPosition += 6; // Increased spacing after line
    } else {
      yPosition += 2;
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