export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  summary: string;
}

export interface CoverLetterResult {
  content: string;
  atsScore: number;
  suggestions: string[];
}

export interface ATSOptimizationResult {
  optimizedSummary: string;
  optimizedExperiences: Experience[];
  optimizedProjects: Project[];
  optimizedSkills: string[];
  atsScore: number;
  suggestions: string[];
}
