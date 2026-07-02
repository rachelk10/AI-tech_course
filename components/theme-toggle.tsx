'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div
      className="relative inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm"
      role="group"
      aria-label="בחירת ערכת נושא"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1 h-8 w-8 rounded-full bg-primary shadow transition-all duration-500 ease-in-out ${
          isDark ? 'right-9' : 'right-1'
        }`}
      />

      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500 ease-in-out ${
          !isDark ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="מצב בהיר"
      >
        <Sun className="h-4 w-4 transition-colors duration-500 ease-in-out" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500 ease-in-out ${
          isDark ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="מצב כהה"
      >
        <Moon className="h-4 w-4 transition-colors duration-500 ease-in-out" />
      </button>
    </div>
  )
}
