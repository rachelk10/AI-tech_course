import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

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

    // הצפן את הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10)

    // צור משתמש חדש
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        hasPaid: false,
      }
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "אירעה שגיאה בהרשמה" },
      { status: 500 }
    )
  }
}
