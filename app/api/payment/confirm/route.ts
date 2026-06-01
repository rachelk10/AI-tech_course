import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// API endpoint לאישור תשלום
// בעתיד זה יהיה webhook מספק התשלום (Stripe, PayPal וכו')
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "לא מחובר" },
        { status: 401 }
      )
    }

    // כאן תוסיף לוגיקה לאימות תשלום מול ספק התשלום
    // לדוגמה: אימות webhook מ-Stripe
    
    // עדכן את המשתמש כששילם
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { hasPaid: true }
    })

    return NextResponse.json({
      success: true,
      message: "התשלום אושר בהצלחה",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        hasPaid: updatedUser.hasPaid,
      }
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
