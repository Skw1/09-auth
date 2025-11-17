import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
  runtime: 'experimental-edge',
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (isPrivateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }
    if (refreshToken) {
      try {
        const response = await checkSession();
        const setCookieHeader = response.headers['set-cookie'];
        const newUser = response.data;

        if (newUser && response.status === 200) {
          const res = NextResponse.next();
          if (setCookieHeader) {
            if (Array.isArray(setCookieHeader)) {
              setCookieHeader.forEach(cookie => res.headers.append('set-cookie', cookie));
            } else if (setCookieHeader) {
              res.headers.append('set-cookie', setCookieHeader);
            }
          }
          return res;
        }
      } catch (error) {
        console.error(
          'Session refresh failed:',
          error instanceof Error ? error.message : String(error)
        );
        const redirectResponse = NextResponse.redirect(new URL('/sign-in', req.url));
        redirectResponse.cookies.delete('accessToken');
        redirectResponse.cookies.delete('refreshToken');
        return redirectResponse;
      }
    }

    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isAuthRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
    if (refreshToken) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
