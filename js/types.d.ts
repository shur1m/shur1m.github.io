export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  url: string;
}

export interface ProjectMetadata {
  name: string;
  description: string;
  tags?: string[];
  tech?: string[];
  url: string;
}

export interface ResumeRoleMetadata {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SkillGroupMetadata {
  title: string;
  items: string[];
}
