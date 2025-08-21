"use client"

import { useState } from "react"
import { Bell, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ADMIN_NAVS } from "@/lib/constants"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@/hooks/user/useLogout"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()
  const currentUser = useAuthStore((state) => state.user);
  const UserData = useAuthStore((state) => state.user)
  const logout = useLogout()
 


  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="w-full flex-1">
        {/* <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form> */}
      </div>
      <Button variant="ghost" size="icon" className="ml-auto">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificaciones</span>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/" target="_blank">
          Ver sitio web
        </Link>
      </Button>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 w-full justify-between items-center gap-4 border-b bg-background px-4">
            <div className="ml-4 flex items-center gap-2 text-lg font-semibold"><img src="/logo.svg" className="w-8 h-8" alt="logo" /> CIPM CRM</div>
            <Button variant="outline" size="icon" onClick={() => setShowMobileMenu(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>
          <div className="grid gap-2 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <nav className="flex-1 px-2 space-y-1">
              {ADMIN_NAVS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100",
                  )}
                  onClick={() => setShowMobileMenu(false)}
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
            <button className="absolute bottom-5 left-5 flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3 ">
                  <div className="flex w-full items-center justify-between gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={currentUser?.avatar!!} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{UserData?.name}</p>
                    <LogOut onClick={logout} className="mr-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

