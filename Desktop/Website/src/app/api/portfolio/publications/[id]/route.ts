import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PublicationModel } from '@/models/Publication';
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
    
    const publicationData = await request.json();
    const { id } = params;

    // Process authors array if it's a string
    if (typeof publicationData.authors === 'string') {
      publicationData.authors = publicationData.authors.split(',').map((author: string) => author.trim());
    }

    // Process keywords array if it's a string
    if (typeof publicationData.keywords === 'string') {
      publicationData.keywords = publicationData.keywords.split(',').map((keyword: string) => keyword.trim());
    }

    const publication = await PublicationModel.findByIdAndUpdate(
      id,
      publicationData,
      { new: true }
    );

    if (!publication) {
      return NextResponse.json(
        { success: false, message: 'Publication not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: publication, message: 'Publication updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update publication error:', error);
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
    const publication = await PublicationModel.findByIdAndDelete(id);

    if (!publication) {
      return NextResponse.json(
        { success: false, message: 'Publication not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Publication deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete publication error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
