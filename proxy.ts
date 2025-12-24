
import NextAuth from 'next-auth';
import { auth } from '@/lib/auth';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    // Protect all routes starting with /founder
    const isProtected = nextUrl.pathname.startsWith('/founder');
    const isLoginPage = nextUrl.pathname === '/login';

    if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
    }

    if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/founder', nextUrl));
    }

    return;
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
