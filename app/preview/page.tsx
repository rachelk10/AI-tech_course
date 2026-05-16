import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "סרטון התרשמות — קורס AI",
  description: "צפה בסרטון התרשמות מהקורס וגלה מה מחכה לך",
}

export default function PreviewPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[linear-gradient(160deg,#0f0a1e_0%,#1e0d2a_35%,#2d1030_65%,#0f0a1e_100%)] text-white"
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
          <ArrowRight className="w-4 h-4" />
          חזרה לאתר
        </Link>
        <Link href="/" className="flex items-center gap-3">
          <Image src="/AI_logo.png" alt="AI Course Logo" width={44} height={44} className="rounded-lg" />
          <span className="font-bold text-lg tracking-wide">קורס AI 2026</span>
        </Link>
      </header>

      {/* ── Hero text ── */}
      <main className="flex flex-col items-center px-6 pt-10 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-white/15 bg-white/5 text-sm text-white/70">
          <Play className="w-3.5 h-3.5 text-pink-400" />
          סרטון התרשמות מהקורס
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
          תציץ לפני שמחליטים
        </h1>
        <p className="text-white/60 text-lg max-w-xl mb-12 leading-relaxed">
          בסרטון הקצר הזה תקבלי תחושה אמיתית של סגנון ההוראה, רמת ההסבר ואיך נראים תכני הקורס.
        </p>

        {/* ── Video player ── */}
        <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(88,28,62,0.6)] border border-white/10 bg-black">
          <video
            src="/preview.mp4"
            controls
            poster="/background.png"
            className="w-full aspect-video object-cover"
          >
            הדפדפן שלך אינו תומך בהפעלת וידאו.
          </video>
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 flex flex-col items-center gap-4">
          <p className="text-white/60 text-base">אהבת מה שראית? השאר פרטים ונחזור אלייך</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-[#581c3e] via-[#321332] to-[#18122b] text-white border-0 px-8 py-6 text-base rounded-2xl shadow-[0_14px_36px_-14px_rgba(88,28,62,0.8)] hover:scale-105 transition-transform duration-300"
            >
              <Link href="/#contact">
                שלח לי את הסרטון + פרטים נוספים
                <FileText className="w-5 h-5 mr-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-2xl px-6 py-6 text-base"
            >
              <Link href="/#content">חזרה לתוכן הקורס</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
