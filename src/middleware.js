import { NextResponse } from 'next/server';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.wellnessz.nrr&hl=en_IN';

const APP_STORE_URL =
  'https://apps.apple.com/in/app/nrr/id6753868656';

const IOS_REGEX = /iPhone|iPad|iPod/i;
const ANDROID_REGEX = /Android/i;

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';

  if (IOS_REGEX.test(userAgent)) {
    return NextResponse.redirect(APP_STORE_URL, { status: 302 });
  }

  if (ANDROID_REGEX.test(userAgent)) {
    return NextResponse.redirect(PLAY_STORE_URL, { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};

