import mongoose, { Schema, model, models } from 'mongoose';
import { Education, Achievement, Project, Skill, Podcast, Award } from '@/types';

const EducationSchema = new Schema<Education>({
  institution: String,
  degree: String,
  field: String,
  startDate: Date,
  endDate: Date,
  gpa: String,
  description: String,
  logo: String,
}, {
  timestamps: true,
});

const AchievementSchema = new Schema<Achievement>({
  title: String,
  category: {
    type: String,
    enum: ['MCH', 'Academic', 'Professional', 'Other'],
  },
  description: String,
  date: Date,
  organization: String,
  image: String,
  link: String,
}, {
  timestamps: true,
});

const ProjectSchema = new Schema<Project>({
  title: String,
  description: String,
  longDescription: String,
  technologies: [String],
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'in-progress',
  },
  images: [String],
  githubUrl: String,
  liveUrl: String,
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const SkillSchema = new Schema<Skill>({
  name: String,
  category: {
    type: String,
    enum: ['Technical', 'Programming', 'Tools', 'Soft Skills'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
  icon: String,
}, {
  timestamps: true,
});

const PodcastSchema = new Schema<Podcast>({
  title: String,
  description: String,
  platform: String,
  episodeNumber: Number,
  publishDate: Date,
  duration: String,
  audioUrl: String,
  spotifyUrl: String,
  applePodcastsUrl: String,
  thumbnail: String,
}, {
  timestamps: true,
});

const AwardSchema = new Schema<Award>({
  title: String,
  organization: String,
  date: Date,
  description: String,
  category: {
    type: String,
    enum: ['Academic', 'Professional', 'Competition', 'Recognition'],
  },
  image: String,
  certificateUrl: String,
}, {
  timestamps: true,
});

export const EducationModel = models.Education || model<Education>('Education', EducationSchema);
export const AchievementModel = models.Achievement || model<Achievement>('Achievement', AchievementSchema);
export const ProjectModel = models.Project || model<Project>('Project', ProjectSchema);
export const SkillModel = models.Skill || model<Skill>('Skill', SkillSchema);
export const PodcastModel = models.Podcast || model<Podcast>('Podcast', PodcastSchema);
export const AwardModel = models.Award || model<Award>('Award', AwardSchema);
