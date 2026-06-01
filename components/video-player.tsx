"use client"

// import { useSession } from "next-auth/react"
import { ReactNode } from "react"
import { Lock } from "lucide-react"

// ⚠️ Authentication temporarily disabled for deployment
// TODO: Re-enable authentication system

interface VideoPlayerProps {
  videoUrl?: string
  title?: string
  children?: ReactNode
}

export function VideoPlayer({ videoUrl, title, children }: VideoPlayerProps) {
  // const { data: session } = useSession()
  // const hasAccess = session?.user?.hasPaid
  const hasAccess = true // Temporarily grant access to all

  /* COMMENTED OUT - RE-ENABLE WHEN FIXING AUTH
  if (!hasAccess) {
    return (
      <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            הסרטון ינעל עד לרכישת הקורס
          </p>
        </div>
      </div>
    )
  }
  */

  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            הסרטון יעלה בקרוב
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {children || (
        <video
          controls
          className="w-full h-full"
          poster="/video-placeholder.jpg"
        >
          <source src={videoUrl} type="video/mp4" />
          הדפדפן שלך לא תומך בתגית video.
        </video>
      )}
    </div>
  )
}
