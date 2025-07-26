import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';
import mongoose, { Schema, model, models } from 'mongoose';

// Simple Project schema matching the admin interface
const ProjectSchema = new Schema({
  title: String,
  description: String,
  technologies: [String],
  imageUrl: String,
  projectUrl: String,
  githubUrl: String,
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'completed' },
}, {
  timestamps: true,
});

const ProjectModel = models.SimpleProject || model('SimpleProject', ProjectSchema);

export async function GET() {
  try {
    await connectDB();
    
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: projects },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get projects error:', error);
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
    
    const projectData = await request.json();
    console.log('Creating project:', projectData);
    
    const project = await ProjectModel.create(projectData);
    
    return NextResponse.json(
      { success: true, data: project, message: 'Project created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
