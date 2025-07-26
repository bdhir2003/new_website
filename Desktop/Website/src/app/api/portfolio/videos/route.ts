import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VideoModel } from '@/models/Video';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    const videos = await VideoModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: videos },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
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
    
    const videoData = await request.json();

    // Extract video ID from YouTube URL for thumbnail
    const extractVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const videoId = extractVideoId(videoData.youtubeUrl);
    if (videoId && !videoData.thumbnail) {
      videoData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const video = await VideoModel.create(videoData);
    
    return NextResponse.json(
      { success: true, data: video, message: 'Video added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
