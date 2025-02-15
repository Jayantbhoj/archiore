import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';  // Import the type for request
import { verifySession } from './app/lib/session';

export async function middleware(request: NextRequest) {
  // Check for the session payload
  const payload = await verifySession();

  // If the user has a valid session and accesses the root route (`/`), redirect to `/home`
  if (payload && new URL(request.url).pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If no valid session (user is signed out) and accessing protected routes, redirect to signin page
  const protectedRoutes = ['/home/*', '/upload', '/profile'];
  if (!payload && protectedRoutes.includes(new URL(request.url).pathname)) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow the request to proceed for valid session or when accessing unprotected routes
  return NextResponse.next();
}
