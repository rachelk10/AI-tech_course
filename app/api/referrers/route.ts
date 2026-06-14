import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { REFERRAL_CODE_REGEX, sanitizeReferralCode } from "@/lib/referrals"

const generateReferralCode = () => crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()

const createUniqueReferralCode = async (preferredCode?: string): Promise<string> => {
  const normalizedPreferred = sanitizeReferralCode(preferredCode)?.toUpperCase()

  if (normalizedPreferred && REFERRAL_CODE_REGEX.test(normalizedPreferred)) {
    const [userExists, externalExists] = await Promise.all([
      prisma.user.findUnique({ where: { referralCode: normalizedPreferred }, select: { id: true } }),
      prisma.referrer.findUnique({ where: { referralCode: normalizedPreferred }, select: { id: true } }),
    ])

    if (!userExists && !externalExists) {
      return normalizedPreferred
    }

    throw new Error("קוד ההפניה הזה כבר קיים. נסי קוד אחר.")
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateReferralCode()
    const [userExists, externalExists] = await Promise.all([
      prisma.user.findUnique({ where: { referralCode: code }, select: { id: true } }),
      prisma.referrer.findUnique({ where: { referralCode: code }, select: { id: true } }),
    ])

    if (!userExists && !externalExists) {
      return code
    }
  }

  throw new Error("לא הצלחנו ליצור קוד ייחודי כרגע. נסי שוב.")
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      phone?: string
      referralCode?: string
    }

    const name = body.name?.trim()
    const email = body.email?.trim() || null
    const phone = body.phone?.trim() || null

    if (!name) {
      return NextResponse.json({ error: "יש להזין שם ממליצה" }, { status: 400 })
    }

    const referralCode = await createUniqueReferralCode(body.referralCode)

    const referrer = await prisma.referrer.create({
      data: {
        name,
        email,
        phone,
        referralCode,
      },
    })

    const origin = new URL(request.url).origin

    return NextResponse.json(
      {
        referrer: {
          id: referrer.id,
          name: referrer.name,
          email: referrer.email,
          phone: referrer.phone,
          referralCode: referrer.referralCode,
          referralLink: `${origin}/auth/signup?ref=${referrer.referralCode}`,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "אירעה שגיאה ביצירת ממליצה"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
