import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VideoModel } from '@/models/Video';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

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

    const video = await VideoModel.findByIdAndUpdate(
      id,
      videoData,
      { new: true }
    );

    if (!video) {
      return NextResponse.json(
        { success: false, message: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: video, message: 'Video updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update video error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    const video = await VideoModel.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json(
        { success: false, message: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
