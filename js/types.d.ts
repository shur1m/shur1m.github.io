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
