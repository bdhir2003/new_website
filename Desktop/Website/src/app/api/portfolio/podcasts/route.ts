import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';
import mongoose, { Schema, model, models } from 'mongoose';

// Simple Podcast schema matching the admin interface
const PodcastSchema = new Schema({
  title: String,
  description: String,
  platform: String,
  episodeNumber: String,
  publishDate: String,
  duration: String,
  podcastUrl: String,
  spotifyUrl: String,
  appleUrl: String,
  youtubeUrl: String,
  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const PodcastModel = models.SimplePodcast || model('SimplePodcast', PodcastSchema);

export async function GET() {
  try {
    await connectDB();
    
    const podcasts = await PodcastModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: podcasts },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get podcasts error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const podcastData = await request.json();
    const podcast = await PodcastModel.create(podcastData);
    
    return NextResponse.json(
      { success: true, data: podcast, message: 'Podcast created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create podcast error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
