// דוגמה לשימוש בהגנת תוכן בדף קורס
// יוצר קובץ זה ב: /app/course/example-lesson/page.tsx

"use client"

import { ProtectedContent } from "@/components/protected-content"
import { VideoPlayer } from "@/components/video-player"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import Link from "next/link"

export default function ExampleLessonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 pt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* כותרת */}
        <div>
          <h1 className="text-3xl font-bold mb-2">שיעור 1: מבוא ל-Machine Learning</h1>
          <p className="text-muted-foreground">
            בשיעור זה נלמד את היסודות של Machine Learning
          </p>
        </div>

        {/* וידאו - מוגן */}
        <ProtectedContent requirePayment>
          <Card>
            <CardHeader>
              <CardTitle>סרטון השיעור</CardTitle>
              <CardDescription>45 דקות</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoPlayer 
                videoUrl="/videos/lesson-1.mp4"
                title="מבוא ל-Machine Learning"
              />
            </CardContent>
          </Card>
        </ProtectedContent>

        {/* חומרי לימוד */}
        <Card>
          <CardHeader>
            <CardTitle>חומרי לימוד</CardTitle>
            <CardDescription>קבצים להורדה</CardDescription>
          </CardHeader>
          <CardContent>
            <ProtectedContent requirePayment>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/downloads/lesson-1-slides.pdf" download>
                    <FileText className="ml-2 h-4 w-4" />
                    מצגת השיעור (PDF)
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/downloads/lesson-1-code.zip" download>
                    <Download className="ml-2 h-4 w-4" />
                    קוד לדוגמה (ZIP)
                  </a>
                </Button>
              </div>
            </ProtectedContent>
          </CardContent>
        </Card>

        {/* תקציר - נגיש לכולם */}
        <Card>
          <CardHeader>
            <CardTitle>תקציר השיעור</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>בשיעור זה נלמד:</p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>מהו Machine Learning</li>
              <li>הבדלים בין Supervised ו-Unsupervised Learning</li>
              <li>מקרי שימוש נפוצים</li>
              <li>כלים וטכנולוגיות</li>
            </ul>
          </CardContent>
        </Card>

        {/* ניווט */}
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/course">חזרה לתוכן הקורס</Link>
          </Button>
          <Button asChild>
            <Link href="/course/lesson-2">השיעור הבא</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
