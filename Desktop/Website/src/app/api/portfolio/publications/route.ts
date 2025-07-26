import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PublicationModel } from '@/models/Publication';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    const publications = await PublicationModel.find().sort({ publicationDate: -1 });
    
    return NextResponse.json(
      { success: true, data: publications },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get publications error:', error);
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
    
    const publicationData = await request.json();

    // Process authors array if it's a string
    if (typeof publicationData.authors === 'string') {
      publicationData.authors = publicationData.authors.split(',').map((author: string) => author.trim());
    }

    // Process keywords array if it's a string
    if (typeof publicationData.keywords === 'string') {
      publicationData.keywords = publicationData.keywords.split(',').map((keyword: string) => keyword.trim());
    }

    const publication = await PublicationModel.create(publicationData);
    
    return NextResponse.json(
      { success: true, data: publication, message: 'Publication added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create publication error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
