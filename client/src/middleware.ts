import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Paths that require authentication
const protectedPaths = ['/dashboard', '/profile', '/settings'];
// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/register', '/verify-email'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath || isAuthPath) {
    try {
      // Get all cookies from the request
      const cookies = request.cookies.getAll();
      const cookieHeader = cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');

      // Check authentication status
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Cookie: cookieHeader,
        },
        credentials: 'include',
      });

      const isAuthenticated = response.ok;
      const data = await response.json();
      const isVerified = isAuthenticated && data.data.user.isVerified;

      // Handle protected paths
      if (isProtectedPath) {
        if (!isAuthenticated) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
        if (!isVerified && pathname !== '/verify-email') {
          return NextResponse.redirect(new URL('/verify-email', request.url));
        }
      }

      // Handle auth paths (redirect if already authenticated)
      if (isAuthPath && isAuthenticated && isVerified) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      if (isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
