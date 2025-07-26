import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';
import mongoose, { Schema, model, models } from 'mongoose';

// Simple Education schema matching the admin interface
const EducationSchema = new Schema({
  institution: String,
  degree: String,
  field: String,
  startDate: String,
  endDate: String,
  gpa: String,
  description: String,
  current: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const EducationModel = models.SimpleEducation || model('SimpleEducation', EducationSchema);

export async function GET() {
  try {
    await connectDB();
    
    const education = await EducationModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: education },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get education error:', error);
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
    
    const educationData = await request.json();
    console.log('Creating education:', educationData);
    
    const education = await EducationModel.create(educationData);
    
    return NextResponse.json(
      { success: true, data: education, message: 'Education entry created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create education error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
