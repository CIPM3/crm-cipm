import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import OptimizedProviders from "@/components/providers/OptimizedProviders"
import type { Metadata, Viewport } from 'next'

// Evita la prerenderización estática para prevenir errores en build
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "CIPM - Sistema CRM",
    template: "%s | CIPM - Sistema CRM"
  },
  description: "Plataforma de gestión de cursos, estudiantes y recursos educativos",
  keywords: ["CRM", "educación", "cursos", "estudiantes", "gestión"],
  authors: [{ name: "CIPM" }],
  creator: "CIPM",
  publisher: "CIPM",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "CIPM Sistema CRM",
    title: "CIPM - Sistema CRM",
    description: "Plataforma de gestión de cursos, estudiantes y recursos educativos",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIPM - Sistema CRM",
    description: "Plataforma de gestión de cursos, estudiantes y recursos educativos",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
        
        {/* Prevent FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
          `
        }} />
      </head>
      <body 
        className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        <OptimizedProviders>
          {children}
        </OptimizedProviders>
      </body>
    </html>
  )
}
