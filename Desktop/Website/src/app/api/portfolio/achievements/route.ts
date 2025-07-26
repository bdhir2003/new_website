import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';
import mongoose, { Schema, model, models } from 'mongoose';

// Simple Achievement schema matching the admin interface
const AchievementSchema = new Schema({
  title: String,
  organization: String,
  date: String,
  description: String,
  category: String,
}, {
  timestamps: true,
});

const AchievementModel = models.SimpleAchievement || model('SimpleAchievement', AchievementSchema);

export async function GET() {
  try {
    await connectDB();
    
    const achievements = await AchievementModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: achievements },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get achievements error:', error);
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
    
    const achievementData = await request.json();
    console.log('Creating achievement:', achievementData);
    
    const achievement = await AchievementModel.create(achievementData);
    
    return NextResponse.json(
      { success: true, data: achievement, message: 'Achievement created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create achievement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
