import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'waremax-super-secret-key-for-jwt-2026';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all routes under /manager and /staff
  if (pathname.startsWith('/manager') || pathname.startsWith('/staff')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Not logged in -> Redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      // Verify token
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // Checking Role Constraints
      if (pathname.startsWith('/manager') && role !== 'Manager') {
        // Staff trying to access Manager pages
        const url = request.nextUrl.clone();
        url.pathname = '/staff';
        return NextResponse.redirect(url);
      }

      // Automatically attach role headers for layout usage if needed
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-role', role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      // Invalid token -> Delete cookie and redirect
      const url = request.nextUrl.clone();
      url.pathname = '/';
      const response = NextResponse.redirect(url);
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Prevent logged-in users from seeing the login page again
  if (pathname === '/') {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
         const secret = new TextEncoder().encode(JWT_SECRET);
         const { payload } = await jwtVerify(token, secret);
         const role = payload.role as string;
         const url = request.nextUrl.clone();
         url.pathname = role === 'Manager' ? '/manager' : '/staff';
         return NextResponse.redirect(url);
      } catch (e) {
         // Silently ignore if token is invalid, let them see login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manager/:path*', '/staff/:path*', '/'],
};
