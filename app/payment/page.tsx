"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

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
              <Button className="w-full" size="lg" asChild>
                <a href="mailto:rachelshor100@gmail.com?subject=רכישת קורס AI">
                  צור קשר לרכישה
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">חזרה לדף הבית</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
