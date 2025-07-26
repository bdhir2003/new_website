import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';
import mongoose, { Schema, model, models } from 'mongoose';

// Simple Award schema matching the admin interface
const AwardSchema = new Schema({
  title: String,
  organization: String,
  date: String,
  description: String,
  category: String,
  level: String,
  certificateUrl: String,
}, {
  timestamps: true,
});

const AwardModel = models.SimpleAward || model('SimpleAward', AwardSchema);

export async function GET() {
  try {
    await connectDB();
    
    const awards = await AwardModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: awards },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get awards error:', error);
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
    
    const awardData = await request.json();
    const award = await AwardModel.create(awardData);
    
    return NextResponse.json(
      { success: true, data: award, message: 'Award created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create award error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
