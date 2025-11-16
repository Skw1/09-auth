import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
  runtime: 'experimental-edge',
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const url = req.nextUrl.clone();

  const isPrivate = url.pathname.startsWith('/profile') || url.pathname.startsWith('/notes');
  const isPublicAuth = url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up');

  if (!token && isPrivate) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (token && isPublicAuth) {
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
