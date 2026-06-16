import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { REFERRAL_COOKIE_NAME, sanitizeReferralCode } from "@/lib/referral-utils"
import { promises as fs } from "fs"
import path from "path"

const generateReferralCode = () => crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()

const createUniqueReferralCode = async (): Promise<string> => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateReferralCode()
    const userExists = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    })
    const referrerExists = await prisma.referrer.findUnique({
      where: { referralCode: code },
      select: { id: true },
    })

    if (!userExists && !referrerExists) {
      return code
    }
  }

  throw new Error("Failed to generate unique referral code")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, referralCode: bodyReferralCode } = body as {
      email?: string
      password?: string
      name?: string
      referralCode?: string
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "אנא מלא את כל השדות הנדרשים" },
        { status: 400 }
      )
    }

    // בדוק אם המשתמש כבר קיים
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "משתמש עם מייל זה כבר קיים" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const referralCode =
      sanitizeReferralCode(bodyReferralCode) ??
      sanitizeReferralCode(cookieStore.get(REFERRAL_COOKIE_NAME)?.value)

    let referredById: string | undefined
    let referredByReferrerId: string | undefined
    if (referralCode) {
      const userReferrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true, email: true },
      })

      if (userReferrer && userReferrer.email.toLowerCase() !== email.toLowerCase()) {
        referredById = userReferrer.id
      } else {
        // Look for external referrers in local JSON file (no DB for external referrers)
        // Note: Count increment moved to payment/confirm — only count when user actually pays
        try {
          const referrersPath = path.join(process.cwd(), "data", "referrers.json")
          const raw = await fs.readFile(referrersPath, "utf-8")
          const referrers = JSON.parse(raw) as Array<any>
          const found = referrers.find(r => String(r.referralCode).toUpperCase() === String(referralCode).toUpperCase())
          if (found) {
            // Count increment moved to payment/confirm endpoint
            // We don't have a DB id for external referrers; keep referredByReferrerId undefined
          }
        } catch (e) {
          // If file not found or parsing failed, ignore and continue silently
          console.warn("Could not read/write local referrers.json", e)
        }
      }
    }

    // הצפן את הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10)
    const generatedReferralCode = await createUniqueReferralCode()

    // צור משתמש חדש
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        referralCode: generatedReferralCode,
        referredById,
        referredByReferrerId,
        hasPaid: false,
      }
    })

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          referralCode: user.referralCode,
          referralLink: `${new URL(request.url).origin}/auth/signup?ref=${user.referralCode}`,
        }
      },
      { status: 201 }
    )

    if (referredById || referredByReferrerId) {
      response.cookies.set({
        name: REFERRAL_COOKIE_NAME,
        value: "",
        maxAge: 0,
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "אירעה שגיאה בהרשמה" },
      { status: 500 }
    )
  }
}
