import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <Link href="/" className="text-xl font-bold">
              CIPM Educación
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Inicio
            </Link>
            <Link href="/cursos" className="text-sm font-medium hover:text-primary">
              Cursos
            </Link>
            <Link href="/videos" className="text-sm font-medium hover:text-primary">
              Videos
            </Link>
            <Link href="/#testimonios" className="text-sm font-medium hover:text-primary">
              Testimonios
            </Link>
            <Link href="/#contacto" className="text-sm font-medium hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">CIPM Educación</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Formación especializada en Gestión de Proyectos para profesionales que buscan la excelencia.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Plataforma</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/cursos" className="hover:text-foreground">
                    Cursos
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="hover:text-foreground">
                    Videos
                  </Link>
                </li>
                <li>
                  <Link href="/#testimonios" className="hover:text-foreground">
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
                <li>Teléfono: +52 55 1234 5678</li>
                <li>Dirección: Av. Reforma 123, CDMX</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CIPM Educación. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

