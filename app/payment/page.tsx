"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [referrers, setReferrers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedReferrer, setSelectedReferrer] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [showWelcomeText, setShowWelcomeText] = useState(false)

  // ⚠️ Authentication temporarily disabled
  const session = null
  const status = "unauthenticated"

  useEffect(() => {
    if (showDialog) {
      loadReferrers()
    }
  }, [showDialog])

  const loadReferrers = async () => {
    try {
      const res = await fetch("/api/referrers")
      const data = await res.json()
      setReferrers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error("Failed to load referrers:", e)
      setReferrers([])
    }
  }

  const handleSubmit = async () => {
    if (!email || !selectedReferrer) {
      setError("אנא מלא את כל השדות")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Save referral code to cookie before registration
      document.cookie = `referral_code=${selectedReferrer}; path=/; max-age=${7 * 24 * 60 * 60}`

      // 1. Register the user with referral code
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: Math.random().toString(36).slice(-12), // temp password
          name: email.split("@")[0],
          referralCode: selectedReferrer,
        }),
      })

      if (!registerRes.ok) {
        const errorData = await registerRes.json()
        throw new Error(errorData.error || "ההרשמה נכשלה")
      }

      // 2. Confirm payment (increment referral count)
      const paymentRes = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: selectedReferrer,
        }),
      })

      if (paymentRes.ok) {
        setShowDialog(false)
        router.push("/?payment=success")
      } else {
        throw new Error("שגיאה באישור התשלום")
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Temporarily disabled auth check
  /* 
  if (!session) {
    router.push("/auth/signin?callbackUrl=/payment")
    return null
  }

  if (session.user.hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">כבר יש לך גישה!</CardTitle>
              <CardDescription>
                התשלום שלך אושר ויש לך גישה מלאה לכל תכני הקורס
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/#content">התחל ללמוד</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/profile">הפרופיל שלי</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CreditCard className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl">רכישת הקורס</CardTitle>
            <CardDescription>
              קבל גישה מלאה לכל תכני הקורס
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-2">₪499</p>
              <p className="text-muted-foreground">תשלום חד פעמי</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">מה כלול:</h3>
              <ul className="space-y-2">
                {[
                  "גישה לכל 8 מודולים",
                  "12+ פרויקטים מעשיים",
                  "גישה לכל הסרטונים",
                  "קוד מלא לכל פרויקט",
                  "תמיכה בקהילה",
                  "עדכונים עתידיים בחינם",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Alert>
              <AlertDescription>
                <strong>כרגע מערכת התשלום בבנייה.</strong>
                <br />
                לרכישה, אנא צור קשר במייל:{" "}
                <a
                  href="mailto:rachelshor100@gmail.com"
                  className="text-primary hover:underline"
                >
                  rachelshor100@gmail.com
                </a>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {!showWelcomeText ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowWelcomeText(true)}
                >
                  מעבר לתשלום מאובטח
                </Button>
              ) : (
                <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                  <div className="text-right space-y-4 leading-relaxed">
                    <p className="font-semibold text-lg">
                      ברוכים הבאים למחזור ההשקה של הקורס.
                    </p>
                    <p>
                      הפרק הראשון יעלה בעז"ה עד א' בתמוז, מועד פתיחת הקורס, ולאחר מכן יתווספו תכנים חדשים מדי שבוע. כל תכני הקורס צפויים לעלות בתוך כחודשיים, כאשר אנו פועלים במלוא המרץ כדי להשלים את ההעלאה אף מוקדם יותר.
                    </p>
                    <p>
                      ההעלאה ההדרגתית מאפשרת ללמוד בצורה ממוקדת, לתרגל את החומר הנלמד ולהתקדם שלב אחר שלב, מבלי להרגיש מוצפים בכמות גדולה של תכנים בבת אחת.
                    </p>
                    <p>
                      עם השלמת העלאת כל תכני הקורס, תישמר לך גישה מלאה לכל השיעורים למשך שלוש שנים, כך שניתן יהיה לחזור על החומר, לרענן נושאים חשובים ולהתקדם בקצב האישי שלך לאורך זמן.
                    </p>
                    <p>
                      תודה שבחרת להצטרף אלינו. אנו שמחים ללוות אותך בדרך לרכישת ידע ומיומנויות בתחום הבינה המלאכותית – אחד התחומים המשפיעים והמבוקשים ביותר בעולם התעסוקה של היום. מאחלים לך הצלחה רבה, סיפוק והתקדמות משמעותית לאורך הקורס ובבניית קריירה עדכנית ורלוונטית לשנים הבאות.
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowDialog(true)}
                  >
                    אני רוצה להרשם
                  </Button>
                </div>
              )}
              <Button variant="outline" asChild className="w-full">
                <Link href="/">חזרה לדף הבית</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for email and referrer selection */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>בחר ממליץ וספק מייל</DialogTitle>
            <DialogDescription>
              אנא בחר את הממליץ שלך וספק מייל להעברת הקוד
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ממליץ</label>
              <Select value={selectedReferrer} onValueChange={setSelectedReferrer}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר ממליץ" />
                </SelectTrigger>
                <SelectContent>
                  {referrers.map((ref) => (
                    <SelectItem key={ref.referralCode} value={ref.referralCode}>
                      {ref.name} - {ref.referralCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">מייל</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "טוען..." : "המשך לתשלום"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowDialog(false)}
                disabled={loading}
              >
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
