export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AboutMe {
  _id?: string;
  name: string;
  title: string;
  description: string;
  profileImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  updatedAt?: Date;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  description?: string;
  logo?: string;
  updatedAt?: Date;
}

export interface Achievement {
  _id?: string;
  title: string;
  category: 'MCH' | 'Academic' | 'Professional' | 'Other';
  description: string;
  date: Date;
  organization?: string;
  logo?: string;
  image?: string;
  link?: string;
  updatedAt?: Date;
}

export interface Video {
  _id?: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail?: string;
  category?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Publication {
  _id?: string;
  title: string;
  authors: string[];
  journal?: string;
  conference?: string;
  publisher?: string;
  publicationDate: Date;
  type: 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Thesis' | 'Report' | 'Other';
  abstract?: string;
  keywords?: string[];
  doi?: string;
  url?: string;
  pdfUrl?: string;
  citation?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  status: 'completed' | 'in-progress' | 'planned';
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  updatedAt?: Date;
}

export interface Skill {
  _id?: string;
  name: string;
  category: 'Technical' | 'Programming' | 'Tools' | 'Soft Skills';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string;
  updatedAt?: Date;
}

export interface Podcast {
  _id?: string;
  title: string;
  description: string;
  platform: string;
  episodeNumber?: number;
  publishDate: Date;
  duration?: string;
  audioUrl?: string;
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  thumbnail?: string;
  updatedAt?: Date;
}

export interface Award {
  _id?: string;
  title: string;
  organization: string;
  date: Date;
  description?: string;
  category: 'Academic' | 'Professional' | 'Competition' | 'Recognition';
  image?: string;
  certificateUrl?: string;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
