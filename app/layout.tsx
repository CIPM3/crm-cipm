import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CIPM",
  description: "Plataforma de gestión de cursos y estudiantes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
        <body className={inter.className}>
          {children}
          <Toaster />  
        </body>
    </html>
  )
}
