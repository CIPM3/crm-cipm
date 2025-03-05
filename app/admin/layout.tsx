import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export const metadata = {
  title: "CIPM CRM - Panel Administrativo",
  description: "Sistema de gestión de cursos y estudiantes",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

