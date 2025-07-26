import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disable middleware to fix redirect loop
  // TODO: Re-enable after fixing the token verification issue
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*']
};
