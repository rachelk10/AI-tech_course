import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { REFERRAL_COOKIE_NAME, sanitizeReferralCode } from "@/lib/referrals"

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
        const externalReferrer = await prisma.referrer.findUnique({
          where: { referralCode },
          select: { id: true },
        })

        if (externalReferrer) {
          referredByReferrerId = externalReferrer.id
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
