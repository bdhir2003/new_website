import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';
import mongoose, { Schema, model, models } from 'mongoose';

// Simple Skill schema matching the admin interface
const SkillSchema = new Schema({
  name: String,
  category: String,
  level: Number,
  experience: String,
  description: String,
}, {
  timestamps: true,
});

const SkillModel = models.SimpleSkill || model('SimpleSkill', SkillSchema);

export async function GET() {
  try {
    await connectDB();
    
    const skills = await SkillModel.find().sort({ category: 1, name: 1 });
    
    return NextResponse.json(
      { success: true, data: skills },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get skills error:', error);
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
    
    const skillData = await request.json();
    const skill = await SkillModel.create(skillData);
    
    return NextResponse.json(
      { success: true, data: skill, message: 'Skill created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
