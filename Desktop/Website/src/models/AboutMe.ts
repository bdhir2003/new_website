import mongoose, { Schema, model, models } from 'mongoose';
import { AboutMe } from '@/types';

const AboutMeSchema = new Schema<AboutMe>({
  name: String,
  title: String,
  description: String,
  profileImage: String,
  heroTitle: String,
  heroSubtitle: String,
  email: String,
  phone: String,
  location: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
  },
}, {
  timestamps: true,
});

export const AboutMeModel = models.AboutMe || model<AboutMe>('AboutMe', AboutMeSchema);
