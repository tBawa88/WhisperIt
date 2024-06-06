import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const currentUrl = request.nextUrl;

    //if user has token, and they're trying to access these following routes, redirect them to /dashboard
    if (token &&
        (
            currentUrl.pathname.startsWith('/sign-in') ||
            currentUrl.pathname.startsWith('/sign-up') ||
            currentUrl.pathname.startsWith('/verify') ||
            currentUrl.pathname.startsWith('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))

    }

    //if user is not logged in, redirect them to sign-in url
    if (!token && currentUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    //if everything is okay, call next()
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verifiy/:path*'
    ],
}