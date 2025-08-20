
import type React from "react"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { requireAdmin, generatePageMetadata } from "@/lib/server-utils"

// Generate optimized metadata
export const metadata = generatePageMetadata({
  title: "Panel Administrativo",
  description: "Sistema de gestión de cursos, estudiantes y recursos educativos",
  keywords: ["admin", "panel", "gestión", "CRM", "dashboard"]
})

// Loading components for streaming UI
function SidebarLoading() {
  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
        ))}
      </div>
    </div>
  )
}

function HeaderLoading() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  )
}

function MainLoading() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </main>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authentication check
  try {
    await requireAdmin()
  } catch (error) {
    redirect('/login')
  }

  return (
    <div className="flex overflow-hidden flex-col md:flex-row min-h-screen">
      {/* Sidebar with streaming */}
      <Suspense fallback={<SidebarLoading />}>
        <Sidebar />
      </Suspense>
      
      <div className="flex flex-col flex-1 overflow-hidden w-full md:ml-64">
        {/* Header with streaming */}
        <Suspense fallback={<HeaderLoading />}>
          <Header />
        </Suspense>
        
        {/* Main content with streaming and error boundary */}
        <Suspense fallback={<MainLoading />}>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {children}
          </main>
        </Suspense>
      </div>
    </div>
  )
}