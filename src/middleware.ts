import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import {NextRequest, NextResponse} from 'next/server'

export const config = {
	matcher: '/test/:path*',
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      async authorized({ token }) {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)
