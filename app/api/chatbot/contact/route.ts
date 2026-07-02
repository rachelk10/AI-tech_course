import { NextResponse } from "next/server"

export const runtime = "nodejs"

const DEFAULT_CHATBOT_API_URL = "http://127.0.0.1:8000"

function getChatbotApiBaseUrl() {
  return (process.env.CHATBOT_API_URL || DEFAULT_CHATBOT_API_URL).replace(/\/$/, "")
}

export async function POST(request: Request) {
  try {
    const { message } = (await request.json()) as { message?: string }

    if (!message?.trim()) {
      return NextResponse.json({ message: "נא לכתוב שאלה לפני השליחה." }, { status: 400 })
    }

    const response = await fetch(`${getChatbotApiBaseUrl()}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message.trim() }),
      signal: AbortSignal.timeout(45000),
      cache: "no-store",
    })

    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      const errorBody = contentType.includes("application/json")
        ? JSON.stringify(await response.json().catch(() => ({})))
        : await response.text().catch(() => "")

      return NextResponse.json(
        {
          message:
            errorBody ||
            `שירות הצ'אט החזיר שגיאה (${response.status}).`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "הצ'אט לא הגיב בזמן. נסי שוב בעוד רגע."
        : "לא ניתן להתחבר כרגע לשרת הצ'אט. ודאי ששירות ה-FastAPI רץ על פורט 8000 או עדכני את CHATBOT_API_URL."

    return NextResponse.json({ message }, { status: 502 })
  }
}