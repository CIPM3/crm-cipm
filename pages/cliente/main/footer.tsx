import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-12">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.svg" className="h-8 w-8 text-primary" alt="logo" />
                            <span className="text-xl font-bold">CIPM</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Formación especializada en Gestión de Proyectos para profesionales que buscan la excelencia.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-base font-medium">Plataforma</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#cursos" className="hover:text-foreground">
                                    Cursos
                                </Link>
                            </li>
                            <li>
                                <Link href="#videos" className="hover:text-foreground">
                                    Videos
                                </Link>
                            </li>
                            <li>
                                <Link href="#testimonios" className="hover:text-foreground">
                                    Testimonios
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-base font-medium">Empresa</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-base font-medium">Contacto</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Email: info@cipmeducacion.com</li>
                            <li>Teléfono: +52 181 2156 4610</li>
                            <li>Dirección: Monterrey, Mexico</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CIPM Educación. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}

export default Footer
