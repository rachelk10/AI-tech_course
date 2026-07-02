"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import { MessageCircle, RefreshCw, Send, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ChatRole = "user" | "assistant"

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

interface ContactResponse {
  request_id: string
  status: string
  final_output?: string
  category?: string
  output_type?: string
  retry_count: number
  needs_human: boolean
}

let messageCounter = 0

const makeId = () => `chat_${Date.now()}_${messageCounter++}`

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

async function sendContactMessage(message: string): Promise<ContactResponse> {
  const response = await fetch("/api/chatbot/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })

  const data = (await response.json().catch(() => null)) as
    | (Partial<ContactResponse> & { message?: string })
    | null

  if (!response.ok) {
    throw new Error(data?.message || "אירעה שגיאה בחיבור לעוזר הקורס.")
  }

  return data as ContactResponse
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(135deg,#18122b_0%,#321332_55%,#581c3e_100%)] text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div className={cn("flex max-w-[82%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-tr-sm bg-[linear-gradient(90deg,#18122b_0%,#321332_50%,#581c3e_100%)] text-white"
              : "rounded-tl-sm border border-[#7d2b60]/20 bg-white text-slate-800",
          )}
        >
          <p dir="auto" className="whitespace-pre-wrap break-words [unicode-bidi:plaintext]">
            {message.content}
          </p>
        </div>

        <span className="px-1 text-[10px] text-slate-500">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5" aria-live="polite" aria-label="העוזר כותב">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(135deg,#18122b_0%,#321332_55%,#581c3e_100%)] text-white shadow-sm">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-[#7d2b60]/20 bg-white px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#581c3e] [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#581c3e] [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#581c3e] [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export function CourseChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown as unknown as EventListener)
    return () => window.removeEventListener("keydown", onKeyDown as unknown as EventListener)
  }, [])

  useEffect(() => {
    const element = messagesRef.current

    if (element) {
      element.scrollTo({ top: element.scrollHeight, behavior: "smooth" })
    }
  }, [messages, isTyping, isOpen])

  const resetConversation = useCallback(() => {
    setMessages([])
    setDraft("")
    setIsTyping(false)
  }, [])

  const autoGrow = useCallback(() => {
    const element = textareaRef.current

    if (!element) {
      return
    }

    element.style.height = "auto"
    element.style.height = `${Math.min(element.scrollHeight, 140)}px`
  }, [])

  const sendMessage = useCallback(async () => {
    const trimmedMessage = draft.trim()

    if (!trimmedMessage || isTyping) {
      return
    }

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmedMessage,
      createdAt: Date.now(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setDraft("")
    setIsTyping(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
      const response = await sendContactMessage(trimmedMessage)
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content:
          response.final_output ||
          (response.needs_human
            ? "השאלה שלך הועברה לבדיקה אנושית, ונחזור אליך ברגע שתהיה תשובה מוכנה."
            : "התקבלה תשובה לא תקינה מהשרת. אפשר לנסות שוב בעוד רגע."),
        createdAt: Date.now(),
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "אירעה שגיאה בחיבור לעוזר הקורס. אפשר לנסות שוב בעוד רגע.",
        createdAt: Date.now(),
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } finally {
      setIsTyping(false)
    }
  }, [draft, isTyping])

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div
        className={cn(
          "pointer-events-auto w-[min(410px,calc(100vw-1.5rem))] origin-bottom-right overflow-hidden rounded-[28px] border border-[#7d2b60]/20 bg-white shadow-[0_24px_60px_-15px_rgba(50,19,50,0.38)] transition-all duration-300",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0",
        )}
        role="dialog"
        aria-hidden={!isOpen}
        aria-label="עוזר AI של הקורס"
      >
        <header className="flex items-center gap-3 bg-[linear-gradient(90deg,#18122b_0%,#321332_50%,#581c3e_100%)] px-4 py-3.5 text-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold">עוזר הקורס</h2>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              מחובר · אפשר לשאול על הקורס
            </p>
          </div>

          <button
            type="button"
            onClick={resetConversation}
            aria-label="ניקוי השיחה"
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="סגירת הצ'אט"
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={messagesRef} className="max-h-[min(60vh,520px)] min-h-[360px] space-y-4 overflow-y-auto bg-[#faf8fc] px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#18122b_0%,#321332_55%,#581c3e_100%)] text-white shadow-lg">
                <Sparkles className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold text-slate-900">היי, אני עוזר ה־AI של הקורס 👋</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                אפשר לשאול אותי על הסילבוס, הפרויקטים, למי הקורס מתאים, ואיך מתחילים.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>

        <div className="border-t border-[#7d2b60]/10 bg-white/95 p-3 backdrop-blur">
          <div className="flex items-end gap-2 rounded-2xl border border-[#7d2b60]/15 bg-white p-1.5 shadow-sm focus-within:border-[#581c3e]/40 focus-within:ring-2 focus-within:ring-[#581c3e]/10">
            <textarea
              ref={textareaRef}
              rows={1}
              value={draft}
              disabled={isTyping}
              onChange={(event) => {
                setDraft(event.target.value)
                autoGrow()
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={isTyping ? "עוזר הקורס כותב…" : "כתבי כאן את השאלה שלך…"}
              aria-label="הקלדת הודעה לצ'אט"
              className="max-h-[140px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isTyping || !draft.trim()}
              aria-label="שליחת הודעה"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(90deg,#18122b_0%,#321332_50%,#581c3e_100%)] text-white shadow-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1.5 px-1 text-center text-[10px] text-slate-500">
            Enter לשליחה · Shift + Enter לשורה חדשה
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label={isOpen ? "סגירת הצ'אט" : "פתיחת הצ'אט"}
        aria-expanded={isOpen}
        className="pointer-events-auto relative grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(90deg,#18122b_0%,#321332_50%,#581c3e_100%)] text-white shadow-[0_16px_36px_-10px_rgba(50,19,50,0.6)] transition-transform hover:scale-105"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}

        {!isOpen && (
          <span className="absolute right-0 top-0 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-300 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-fuchsia-300" />
          </span>
        )}
      </button>
    </div>
  )
}