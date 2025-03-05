import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

const HeaderAuth = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.svg" className="h-8 w-8 text-primary" alt="logo" />
                    <span className="text-xl font-bold">CIPM</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/">Volver al inicio</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default HeaderAuth
