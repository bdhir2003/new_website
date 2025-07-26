import mongoose, { Schema, model, models } from 'mongoose';
import { Publication } from '@/types';

const PublicationSchema = new Schema<Publication>({
  title: {
    type: String,
    required: true,
  },
  authors: [{
    type: String,
    required: true,
  }],
  journal: String,
  conference: String,
  publisher: String,
  publicationDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['Journal Article', 'Conference Paper', 'Book Chapter', 'Thesis', 'Report', 'Other'],
    required: true,
  },
  abstract: String,
  keywords: [String],
  doi: String,
  url: String,
  pdfUrl: String,
  citation: String,
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const PublicationModel = models.Publication || model<Publication>('Publication', PublicationSchema);
