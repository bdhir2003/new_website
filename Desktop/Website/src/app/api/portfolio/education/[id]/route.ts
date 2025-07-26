import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { EducationModel } from '@/models/Portfolio';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const educationData = await request.json();
    const education = await EducationModel.findByIdAndUpdate(
      params.id,
      educationData,
      { new: true }
    );

    if (!education) {
      return NextResponse.json(
        { success: false, message: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: education, message: 'Education entry updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update education error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const education = await EducationModel.findByIdAndDelete(params.id);

    if (!education) {
      return NextResponse.json(
        { success: false, message: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Education entry deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete education error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
