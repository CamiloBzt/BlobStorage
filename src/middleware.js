import { NextResponse } from 'next/server';

export function middleware(request) {
  if (
    request.headers.get('upgrade') === 'websocket' ||
    request.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.append('Access-Control-Allow-Headers', '*');
  return res;
}
