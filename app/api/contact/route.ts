import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { name, email, question } = (await request.json()) as {
      name?: string
      email?: string
      question?: string
    }

    if (!name?.trim() || !email?.trim() || !question?.trim()) {
      return NextResponse.json({ message: "נא למלא שם, מייל ושאלה." }, { status: 400 })
    }

    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
    const SMTP_SECURE = process.env.SMTP_SECURE === "true"
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || "rachelshor100@gmail.com"
    const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || SMTP_USER

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_FROM_EMAIL) {
      return NextResponse.json(
        { message: "השרת לא מוגדר לשליחת מייל. יש לעדכן ערכי SMTP בקובץ .env." },
        { status: 500 },
      )
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `שאלה חדשה מהאתר - ${name}`,
      text: `שם: ${name}\nמייל: ${email}\n\nשאלה:\n${question}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2 style="margin-bottom:12px;">שאלה חדשה מהאתר</h2>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>מייל:</strong> ${email}</p>
          <p><strong>שאלה:</strong></p>
          <p style="white-space:pre-wrap">${question}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: "אירעה שגיאה בשליחת ההודעה." }, { status: 500 })
  }
}
