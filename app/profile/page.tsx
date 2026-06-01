"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
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
    router.push("/auth/signin")
    return null
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : session.user.email?.[0]?.toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">הפרופיל שלי</CardTitle>
            <CardDescription>פרטי החשבון והמנוי שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">שם:</span>
                <span className="font-medium">{session.user.name || "לא הוזן"}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">מייל:</span>
                <span className="font-medium">{session.user.email}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">סטטוס מנוי:</span>
                <div className="flex items-center gap-2">
                  {session.user.hasPaid ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">פעיל - גישה מלאה</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-600">ממתין לתשלום</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {!session.user.hasPaid && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-amber-800">
                  כדי לקבל גישה מלאה לכל תכני הקורס, יש לבצע תשלום
                </p>
                <Button asChild className="w-full">
                  <Link href="/payment">רכישת הקורס</Link>
                </Button>
              </div>
            )}

            {session.user.hasPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-green-800">
                  יש לך גישה מלאה לכל תכני הקורס! ניתן להתחיל ללמוד
                </p>
                <Button asChild className="w-full">
                  <Link href="/#content">התחל ללמוד</Link>
                </Button>
              </div>
            )}

            <Button variant="outline" asChild className="w-full">
              <Link href="/">חזרה לדף הבית</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
