"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import Hls from "hls.js"

export default function PreviewPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const videoSrc = "https://vz-423fe9ec-846.b-cdn.net/57e1f459-57a5-4b71-afdc-091a152fef22/playlist.m3u8"

    // Check if HLS is supported
    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1, // -1 means auto, but we'll set it to highest quality
        autoStartLoad: true,
      })
      
      hls.loadSource(videoSrc)
      hls.attachMedia(video)
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Set to highest quality level (last level in the array)
        const levels = hls.levels
        if (levels.length > 0) {
          hls.currentLevel = levels.length - 1 // Highest quality
        }
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = videoSrc
    }

    // Track playing state
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

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
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
          ברוכים הבאים ל-Machine Learning!
        </h1>
        <p className="text-white/60 text-lg max-w-xl mb-12 leading-relaxed">
          סרטון התרשמות קצר
        </p>

        {/* ── Video player ── */}
        <div className={`w-full px-8 md:px-16 lg:px-24 transition-all duration-700 ease-out ${isPlaying ? '' : 'max-w-3xl mx-auto'}`}>
          <div className="rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(88,28,62,0.6)] border border-white/10 bg-black transition-all duration-700 ease-out">
            <video
              ref={videoRef}
              controls
              className="w-full h-full"
              playsInline
              preload="metadata"
              poster="https://vz-423fe9ec-846.b-cdn.net/57e1f459-57a5-4b71-afdc-091a152fef22/thumbnail_c2fc8a94.jpg"
            >
              הדפדפן שלך לא תומך בתגית video.
            </video>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-[#581c3e] via-[#321332] to-[#18122b] text-white border-0 px-8 py-6 text-base rounded-2xl shadow-[0_14px_36px_-14px_rgba(88,28,62,0.8)] hover:scale-105 transition-transform duration-300"
            >
              <Link href="/#payment">
                אני רוצה להירשם
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
