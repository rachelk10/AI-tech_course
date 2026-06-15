import { NextResponse } from "next/server"
import { REFERRAL_CODE_REGEX, sanitizeReferralCode, readReferrersFile, writeReferrersFile } from "@/lib/referrals"

const generateReferralCode = () => crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()

const createUniqueReferralCode = async (preferredCode?: string): Promise<string> => {
  const normalizedPreferred = sanitizeReferralCode(preferredCode)?.toUpperCase()

  // Check only in JSON file
  const readExternalCodes = async (): Promise<string[]> => {
    try {
      const referrers = await readReferrersFile()
      return referrers.map((r) => String(r.referralCode).toUpperCase())
    } catch (e) {
      return []
    }
  }

  if (normalizedPreferred && REFERRAL_CODE_REGEX.test(normalizedPreferred)) {
    const existingCodes = await readExternalCodes()
    if (!existingCodes.includes(normalizedPreferred)) {
      return normalizedPreferred
    }
    throw new Error("קוד ההפניה הזה כבר קיים. נסי קוד אחר.")
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateReferralCode()
    const existingCodes = await readExternalCodes()
    if (!existingCodes.includes(code)) {
      return code
    }
  }

  throw new Error("לא הצלחנו ליצור קוד ייחודי כרגע. נסי שוב.")
}

export async function GET() {
  try {
    const referrers = await readReferrersFile()
    return NextResponse.json(referrers, { status: 200 })
  } catch (error) {
    // File may not exist yet
    return NextResponse.json([], { status: 200 })
  }
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

    // Save external referrer to local JSON file
    let referrers: Array<any> = []
    try {
      referrers = await readReferrersFile()
    } catch (e) {
      // file may not exist yet, will create
      referrers = []
    }

    const newRef = {
      id: referralCode,
      name,
      email,
      phone,
      referralCode,
      count: 0,
      createdAt: new Date().toISOString(),
    }

    referrers.push(newRef)
    await writeReferrersFile(referrers)

    const origin = new URL(request.url).origin

    return NextResponse.json(
      {
        referrer: {
          id: newRef.id,
          name: newRef.name,
          email: newRef.email,
          phone: newRef.phone,
          referralCode: newRef.referralCode,
          referralLink: `${origin}/?ref=${newRef.referralCode}`,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "אירעה שגיאה ביצירת ממליצה"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
