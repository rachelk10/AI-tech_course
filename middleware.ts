import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { getToken } from "next-auth/jwt"

// ⚠️ Authentication temporarily disabled for deployment
// TODO: Re-enable authentication system

export async function middleware(request: NextRequest) {
  // Authentication temporarily disabled
  return NextResponse.next()
  
  /* COMMENTED OUT - RE-ENABLE WHEN FIXING AUTH
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isLoggedIn = !!token
  const { pathname } = request.nextUrl

  // Protected routes
  const isProfilePage = pathname.startsWith("/profile")
  const isCourseContentPage = pathname.match(/^\/course\/[^\/]+\/content/)

  if ((isProfilePage || isCourseContentPage) && !isLoggedIn) {
    // Redirect to signin with callback URL
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url)
    )
  }

  return NextResponse.next()
  */
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/course/:path*/content/:path*",
  ],
}
