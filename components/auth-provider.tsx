"use client"

// import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

// ⚠️ Authentication temporarily disabled for deployment
// TODO: Re-enable authentication system

export function AuthProvider({ children }: { children: ReactNode }) {
  // Authentication temporarily disabled - render children directly
  return <>{children}</>
  
  /* COMMENTED OUT - RE-ENABLE WHEN FIXING AUTH
  return <SessionProvider>{children}</SessionProvider>
  */
}
