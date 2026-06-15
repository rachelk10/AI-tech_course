import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { REFERRAL_COOKIE_NAME, sanitizeReferralCode, readReferrersFile, writeReferrersFile } from "@/lib/referrals"

// API endpoint לאישור תשלום
// בעתיד זה יהיה webhook מספק התשלום (Stripe, PayPal וכו')
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { referralCode: bodyReferralCode } = body as { referralCode?: string }

    // קבל את הreferral code מה-body או מה-cookie
    const cookieStore = await cookies()
    const cookieReferralCode = sanitizeReferralCode(cookieStore.get(REFERRAL_COOKIE_NAME)?.value)
    const referralCode = sanitizeReferralCode(bodyReferralCode) || cookieReferralCode

    // Increment referral count when payment is confirmed (only at payment time)
    if (referralCode) {
      try {
        const referrers = await readReferrersFile()
        const found = referrers.find(
          (r) => String(r.referralCode).toUpperCase() === String(referralCode).toUpperCase(),
        )
        if (found) {
          // Only increment count when payment is confirmed
          found.count = (Number(found.count) || 0) + 1
          await writeReferrersFile(referrers)
        }
      } catch (e) {
        console.warn("Could not read/write local referrers.json during payment:", e)
      }
    }

    // Try to update user if already authenticated
    const session = await auth()
    let updatedUser = null

    if (session?.user?.email) {
      // עדכן את המשתמש כששילם
      updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: { hasPaid: true }
      })
    }

    return NextResponse.json({
      success: true,
      message: "התשלום אושר בהצלחה",
      user: updatedUser ? {
        id: updatedUser.id,
        email: updatedUser.email,
        hasPaid: updatedUser.hasPaid,
      } : null
    })
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json(
      { error: "אירעה שגיאה באישור התשלום" },
      { status: 500 }
    )
  }
}

// API endpoint לבדיקת סטטוס תשלום
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "לא מחובר" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { hasPaid: true }
    })

    return NextResponse.json({
      hasPaid: user?.hasPaid || false
    })
  } catch (error) {
    console.error("Payment status error:", error)
    return NextResponse.json(
      { error: "אירעה שגיאה בבדיקת סטטוס התשלום" },
      { status: 500 }
    )
  }
}
