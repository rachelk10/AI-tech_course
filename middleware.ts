import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { REFERRAL_COOKIE_NAME, sanitizeReferralCode } from "@/lib/referrals"
// import { getToken } from "next-auth/jwt"

// ⚠️ Authentication temporarily disabled for deployment
// TODO: Re-enable authentication system

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const referralCode = sanitizeReferralCode(request.nextUrl.searchParams.get("ref"))
  if (referralCode) {
    response.cookies.set({
      name: REFERRAL_COOKIE_NAME,
      value: referralCode,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    })
  }

  // Authentication temporarily disabled
  return response
  
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
