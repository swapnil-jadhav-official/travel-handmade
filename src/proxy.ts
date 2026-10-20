import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  return NextResponse.rewrite(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!admin|api|login|blog|_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|otf|woff2?|css|js|json|txt|xml|webmanifest)$).*)',
  ],
};
