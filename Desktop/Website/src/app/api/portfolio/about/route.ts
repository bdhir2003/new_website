import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { AboutMeModel } from '@/models/AboutMe';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    const about = await AboutMeModel.findOne();
    
    return NextResponse.json(
      { success: true, data: about },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get about error:', error);
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
    
    const aboutData = await request.json();

    // Delete existing about data (since there should only be one)
    await AboutMeModel.deleteMany({});
    
    // Create new about data
    const about = await AboutMeModel.create(aboutData);
    
    return NextResponse.json(
      { success: true, data: about, message: 'About section updated successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create/update about error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    
    const aboutData = await request.json();
    
    // Find and update or create if doesn't exist
    const about = await AboutMeModel.findOneAndUpdate(
      {},
      aboutData,
      { new: true, upsert: true }
    );
    
    return NextResponse.json(
      { success: true, data: about, message: 'About section updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update about error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
