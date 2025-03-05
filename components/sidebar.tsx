"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, BarChart, Settings, LogOut, FileText, Video } from "lucide-react"
import { cn } from "@/lib/utils"

export const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Estudiantes",
    href: "/admin/estudiantes",
    icon: Users,
  },
  {
    title: "Cursos",
    href: "/admin/cursos",
    icon: BookOpen,
  },
  {
    title: "Contenido",
    href: "/admin/contenido",
    icon: FileText,
  },
  {
    title: "Videos",
    href: "/admin/videos",
    icon: Video,
  },
  {
    title: "Reportes",
    href: "/admin/reportes",
    icon: BarChart,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white border-r shadow-sm">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 gap-2 px-4 border-b bg-primary">
          <img src="/logo.svg" className="w-8 h-8" alt="logo" />
          <h1 className="text-xl font-bold text-white">CIPM CRM</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    pathname === item.href ? "text-primary-foreground" : "text-gray-500",
                  )}
                />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <button className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3 ">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Adrian Leal</p>
                <div className="flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  <LogOut className="mr-1 h-4 w-4" />
                  Cerrar sesión
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

