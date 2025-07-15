export interface PersonalInfoInterface {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  profileImage?: string;
}

export interface SkillsInterface {
  languages: string[];
  frameworks: string[];
  tools: string[];
  concepts: string[];
}

export interface ClientInterface {
  name: string;
  period: string;
  achievements: string[];
}

export interface ExperienceInterface {
  id: number;
  position: string;
  company: string;
  duration: string;
  clients: ClientInterface[];
  startDate: string;
  endDate?: string;
}

export interface ProjectInterface {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  featured?: boolean;
}

export interface EducationInterface {
  degree: string;
  institution: string;
  location: string;
  year: string;
}

export interface PortfolioInterface {
  personalInfo: PersonalInfoInterface;
  skills: SkillsInterface;
  experience: ExperienceInterface[];
  projects: ProjectInterface[];
  education: EducationInterface;
  certifications: string[];
}
