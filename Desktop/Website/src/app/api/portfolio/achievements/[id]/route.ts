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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const achievement = await AchievementModel.findByIdAndUpdate(
      params.id,
      achievementData,
      { new: true, runValidators: false }
    );

    if (!achievement) {
      return NextResponse.json(
        { success: false, message: 'Achievement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: achievement, message: 'Achievement updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update achievement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const achievement = await AchievementModel.findByIdAndDelete(params.id);

    if (!achievement) {
      return NextResponse.json(
        { success: false, message: 'Achievement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Achievement deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete achievement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
