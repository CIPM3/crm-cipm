import Link from 'next/link'
import React from 'react'

const FooterAuth = () => {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CIPM Educación. Todos los derechos reservados.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <Link href="#" className="hover:underline">
                        Política de Privacidad
                    </Link>
                    <Link href="#" className="hover:underline">
                        Términos y Condiciones
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default FooterAuth
