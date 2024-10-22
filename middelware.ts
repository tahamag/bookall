import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith('/Admin')) {
      return NextResponse.redirect(new URL('/Admin/login', req.url));
    }
  }

  if (token?.role !== 'admin') {
    if (pathname.startsWith('/Admin')) {
      return NextResponse.redirect(new URL('/Admin/login', req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/Admin', '/Admin/:path*'],
}

