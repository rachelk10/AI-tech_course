import type { Metadata } from 'next'
import { Heebo, Secular_One, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'

const assistant = Heebo({ 
  subsets: ["hebrew", "latin"],
  variable: '--font-assistant'
});

const displayFont = Secular_One({
  subsets: ["hebrew", "latin"],
  weight: "400",
  variable: '--font-display'
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space'
});

export const metadata: Metadata = {
  title: 'AI Academy - לימודי Machine Learning',
  description: 'הקורס המקיף ללימוד Machine Learning בעברית - מהיסודות ועד לפרויקטים מתקדמים',
  generator: 'v0.app',
  icons: {
    icon: '/AI_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" className="bg-background">
      <body className={`${assistant.variable} ${displayFont.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
