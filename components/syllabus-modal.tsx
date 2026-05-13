"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, Mail, User, Sparkles } from "lucide-react"

interface SyllabusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SyllabusModal({ open, onOpenChange }: SyllabusModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim()) {
      setError("נא למלא את כל השדות")
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("נא להזין כתובת מייל תקינה")
      return
    }

    setIsSubmitting(true)

    // Simulate API call (in production, this would save to Google Sheets)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form after animation completes
    setTimeout(() => {
      setName("")
      setEmail("")
      setIsSuccess(false)
      setError("")
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="gradient-border bg-card text-foreground max-w-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-purple)] to-[var(--gradient-blue)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span>קבל את הסילבוס המלא</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-2 leading-relaxed">
                השאירו פרטים ונשלח לכם את הסילבוס המפורט ישירות למייל
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  שם מלא
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="הכנס את שמך"
                  className="bg-secondary/50 border-border focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  כתובת מייל
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="bg-secondary/50 border-border focus:border-primary text-left"
                  dir="ltr"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[var(--gradient-purple)] via-[var(--gradient-blue)] to-[var(--gradient-pink)] text-white border-0 py-6"
              >
                {isSubmitting ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 ml-2" />
                    שלחו לי את הסילבוס
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                לא נשלח ספאם. מבטיחים.
              </p>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gradient-purple)] to-[var(--gradient-pink)] flex items-center justify-center mx-auto mb-6 glow">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              הסילבוס בדרך אליך!
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              שלחנו את הסילבוס המלא ל-
              <br />
              <span className="text-primary font-medium" dir="ltr">{email}</span>
            </p>
            <Button 
              onClick={handleClose}
              variant="outline"
              className="gradient-border bg-transparent hover:bg-secondary/50"
            >
              חזרה לקורס
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
