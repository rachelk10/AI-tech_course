"use client"

// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Lock, LogIn } from "lucide-react"
import Link from "next/link"

// ⚠️ Authentication temporarily disabled for deployment
// TODO: Re-enable authentication system

interface ProtectedContentProps {
  children: ReactNode
  requirePayment?: boolean
  fallback?: ReactNode
}

export function ProtectedContent({ 
  children, 
  requirePayment = true,
  fallback 
}: ProtectedContentProps) {
  // const { data: session, status } = useSession()
  // const router = useRouter()
  
  // Temporarily grant access to all content
  return <>{children}</>
  
  /* COMMENTED OUT - RE-ENABLE WHEN FIXING AUTH

  // טוען
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // לא מחובר
  if (!session) {
    if (fallback) return <>{fallback}</>
    
    return (
      <Alert className="my-4">
        <LogIn className="h-4 w-4" />
        <AlertTitle>נדרשת התחברות</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>תוכן זה זמין למשתמשים מחוברים בלבד</p>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/auth/signin">התחבר</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/signup">הרשם</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // מחובר אבל לא שילם
  if (requirePayment && !session.user.hasPaid) {
    if (fallback) return <>{fallback}</>
    
    return (
      <Alert className="my-4">
        <Lock className="h-4 w-4" />
        <AlertTitle>תוכן זה דורש מנוי</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>כדי לצפות בתוכן זה, יש לרכוש את הקורס</p>
          <Button asChild size="sm">
            <Link href="/payment">רכישת הקורס</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // יש גישה
  return <>{children}</>
  */
}
