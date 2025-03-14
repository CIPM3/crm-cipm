"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'
import { useLogout } from '@/hooks/user/useLogout'
import { redirect } from 'next/navigation'
import { NAVS } from '@/lib/constants'
import { auth } from '@/lib/firebase'

const HeaderCliente = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const UserData = useAuthStore((state) => state.user)
    const logout = useLogout()


    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.svg" className="h-8 w-8 text-primary" alt="logo" />
                    <span className="text-xl font-bold">CIPM</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {
                        NAVS.map(nav => (
                            <Link key={nav.title} href={nav.href} className="text-sm font-medium">
                                {nav.title}
                            </Link>
                        ))
                    }
                    {
                        UserData?.role !== 'cliente' &&
                        <Link href={'/admin'} className="text-sm font-medium">
                            Panel Administrativo
                        </Link>
                    }
                </nav>
                <div className="hidden md:flex items-center gap-2">
                    {
                        UserData
                            ? (
                                <Button onClick={logout} className='w-full gap-2' variant="outline" asChild>
                                    <Link href="/"><User className='w-4 h-4' /> {UserData.name}</Link>
                                </Button>)
                            : (<>
                                <Button className='w-full' variant="outline" asChild>
                                    <Link href="/login">Iniciar Sesión</Link>
                                </Button>
                                <Button className='w-full' asChild>
                                    <Link href="/register">Registrarse</Link>
                                </Button>
                            </>)
                    }
                </div>
                <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(true)}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                {showMobileMenu && (
                    <div className="fixed inset-0 z-50 bg-background md:hidden">
                        <div className="flex w-full justify-between h-16 items-center gap-4 border-b bg-background px-4">
                            <div className="ml-4 flex items-center text-lg font-semibold"><img src='/logo.svg' className='w-8 h-8' alt='logo' />CIPM</div>

                            <Button variant="outline" size="icon" onClick={() => setShowMobileMenu(false)}>
                                <X className="h-5 w-5" />
                                <span className="sr-only">Cerrar menú</span>
                            </Button>
                        </div>
                        <div className="grid gap-2 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
                            <nav className="flex-1 px-2 space-y-1">
                                {NAVS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                                        )}
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className='w-full flex gap-2  justify-between px-4'>
                            {
                                UserData
                                    ? (
                                        <Button onClick={logout} className='w-full gap-2' variant="outline" asChild>
                                            <Link href="/"><User className='w-4 h-4' /> {UserData.name}</Link>
                                        </Button>)
                                    : (<>
                                        <Button className='w-full' variant="outline" asChild>
                                            <Link href="/login">Iniciar Sesión</Link>
                                        </Button>
                                        <Button className='w-full' asChild>
                                            <Link href="/register">Registrarse</Link>
                                        </Button>
                                    </>)
                            }

                        </div>
                    </div>
                )}

            </div>
        </header>
    )
}

export default HeaderCliente
