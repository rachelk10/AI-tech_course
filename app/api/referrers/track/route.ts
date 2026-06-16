import { NextResponse } from "next/server"
import { sanitizeReferralCode } from "@/lib/referral-utils"
import { readReferrersFile, writeReferrersFile } from "@/lib/referrals"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      referralCode?: string
    }

    const name = body.name?.trim()
    const email = body.email?.trim()
    const referralCodeFromBody = sanitizeReferralCode(body.referralCode)

    const cookieHeader = request.headers.get("cookie") || ""
    const referralCodeFromCookie = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("referral_code="))
      ? sanitizeReferralCode(
          cookieHeader
            .split(";")
            .map((part) => part.trim())
            .find((part) => part.startsWith("referral_code="))
            ?.split("=")[1],
        )
      : null

    const referralCode = referralCodeFromBody || referralCodeFromCookie

    if (!name || !email) {
      return NextResponse.json(
        { error: "אנא מלאי שם ומייל" },
        { status: 400 },
      )
    }

    if (!referralCode) {
      return NextResponse.json(
        { error: "לא נמצא קוד הפניה" },
        { status: 400 },
      )
    }

    let referrers: Array<any> = []

    try {
      referrers = await readReferrersFile()
    } catch (e) {
      return NextResponse.json(
        { error: "לא נמצא קובץ ממליצים" },
        { status: 404 },
      )
    }

    const found = referrers.find(
      (ref) => String(ref.referralCode).toUpperCase() === String(referralCode).toUpperCase(),
    )

    if (!found) {
      return NextResponse.json(
        { error: "ממליץ לא נמצא עבור קוד הפניה זה" },
        { status: 404 },
      )
    }

    found.count = (Number(found.count) || 0) + 1
    found.leads = Array.isArray(found.leads) ? found.leads : []
    found.leads.push({
      name,
      email,
      createdAt: new Date().toISOString(),
    })

    await writeReferrersFile(referrers)

    return NextResponse.json(
      {
        success: true,
        referrer: {
          referralCode: found.referralCode,
          count: found.count,
        },
        lead: {
          name,
          email,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "אירעה שגיאה בעדכון הממליץ"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
