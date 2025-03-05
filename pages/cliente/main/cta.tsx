import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const CTA = () => {
    return (
        <section id="contacto" className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            ¿Listo para impulsar tu carrera profesional?
                        </h2>
                        <p className="md:text-xl">
                            Únete a nuestra comunidad de profesionales y accede a contenido exclusivo, certificaciones oficiales y
                            oportunidades de networking.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-primary-foreground text-primary hover:text-primary-foreground hover:bg-primary/90"
                            asChild
                        >
                            <Link href="/register">Registrarse Ahora</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA
