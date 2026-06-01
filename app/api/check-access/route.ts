import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// API endpoint לבדיקה אם משתמש רשאי לצפות בתוכן
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          hasAccess: false,
          reason: "not_logged_in",
          message: "יש להתחבר כדי לצפות בתוכן"
        },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { hasPaid: true }
    })

    if (!user?.hasPaid) {
      return NextResponse.json(
        { 
          hasAccess: false,
          reason: "not_paid",
          message: "יש לרכוש את הקורס כדי לצפות בתוכן"
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      hasAccess: true,
      message: "יש לך גישה לתוכן"
    })
  } catch (error) {
    console.error("Access check error:", error)
    return NextResponse.json(
      { 
        hasAccess: false,
        reason: "error",
        message: "אירעה שגיאה בבדיקת הגישה"
      },
      { status: 500 }
    )
  }
}
