import mongoose, { Schema, model, models } from 'mongoose';
import { Video } from '@/types';

const VideoSchema = new Schema<Video>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
  },
  thumbnail: String,
  category: String,
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const VideoModel = models.Video || model<Video>('Video', VideoSchema);
