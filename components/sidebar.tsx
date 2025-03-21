"use client"

import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@/hooks/user/useLogout"
import { ADMIN_NAVS } from "@/lib/constants"
import { useEffect } from "react"
import { auth } from "@/lib/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function Sidebar() {
  const pathname = usePathname()

  const currentUser = useAuthStore((state) => state.user);

  const UserData = useAuthStore((state) => state.user)
  const logout = useLogout()

  const IS_DEV = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (auth.currentUser === null && !IS_DEV) {
      redirect('/login')
    }
  }, [auth.currentUser])

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white border-r shadow-sm">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 gap-2 px-4 border-b bg-primary">
          <img src="/logo.svg" className="w-8 h-8" alt="logo" />
          <h1 className="text-xl font-bold text-white">CIPM CRM</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            {ADMIN_NAVS.map((item) => (
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
    </div>
  )
}

