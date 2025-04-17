import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Check if the path is admin
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  
  // If user accesses the admin path
  if (isAdminPath) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
    
    // If authenticated but not admin, redirect to home
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 