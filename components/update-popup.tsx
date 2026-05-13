"use client"

import { useState, useEffect } from "react"
import { X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function UpdatePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log("[v0] UpdatePopup mounted, starting 10 second timer")
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("updatePopupDismissed")
      console.log("[v0] Timer fired, dismissed:", dismissed)
      if (!dismissed) {
        setIsVisible(true)
        console.log("[v0] Popup now visible")
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem("updatePopupDismissed", "true")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setIsSubmitted(true)
    
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-full duration-500">
      <div className="relative rounded-2xl bg-card p-6 w-[90vw] max-w-md shadow-2xl border border-border glow">
        <button
          onClick={handleClose}
          className="absolute top-3 left-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-purple)] to-[var(--gradient-pink)] flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                רוצה לקבל עדכון ברגע שהתוכן יעלה?
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="השם שלך"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-secondary/50 border-border focus:border-primary"
              />
              <Input
                type="email"
                placeholder="כתובת המייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="bg-secondary/50 border-border focus:border-primary text-left"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[var(--gradient-purple)] via-[var(--gradient-blue)] to-[var(--gradient-pink)] text-white border-0 font-semibold"
              >
                {isLoading ? "שולח..." : "עדכנו אותי!"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-3">
              לא נשלח ספאם, רק עדכון אחד כשהקורס יהיה מוכן
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--gradient-purple)] to-[var(--gradient-pink)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">תודה רבה!</h3>
            <p className="text-muted-foreground">נעדכן אותך ברגע שהתוכן יעלה</p>
          </div>
        )}
      </div>
    </div>
  )
}
