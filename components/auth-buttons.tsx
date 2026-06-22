"use client"

// import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
/*
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, CreditCard } from "lucide-react"
*/

// ⚠️ Authentication temporarily disabled for deployment
// TODO: Re-enable authentication system

export function AuthButtons() {
  // const { data: session, status } = useSession()

  // Authentication temporarily disabled - hide auth buttons
  return null

  /* COMMENTED OUT - RE-ENABLE WHEN FIXING AUTH

  if (status === "loading") {
    return (
      <div className="flex gap-2">
        <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />
        <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />
      </div>
    )
  }

  if (session?.user) {
    const initials = session.user.name
      ? session.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : session.user.email?.[0]?.toUpperCase() || "U"

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 ring-2 ring-purple-500">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name || "משתמש"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
              {session.user.hasPaid && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  ✓ גישה מלאה לקורס
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="ml-2 h-4 w-4" />
              <span>הפרופיל שלי</span>
            </Link>
          </DropdownMenuItem>
          {!session.user.hasPaid && (
            <DropdownMenuItem asChild>
              <Link href="/#payment" className="cursor-pointer">
                <CreditCard className="ml-2 h-4 w-4" />
                <span>רכישת הקורס</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="ml-2 h-4 w-4" />
            <span>התנתק</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="ghost" asChild>
        <Link href="/auth/signin">התחברות</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">הרשמה</Link>
      </Button>
    </div>
  )
  */
}
