import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules, getCourseById } from "@/lib/utils"
import { ArrowLeft, BookOpen, Clock, ThumbsUp, MessageSquare, Share2, Bookmark, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  // Encontrar el video en los módulos
  let videoData: any = null
  let moduleData: any = null
  let courseData: any = null

  // Buscar el video en todos los módulos
  for (const module of modules) {
    if (module.status !== "Activo") continue

    const video = module.content.find((content) => content.type === "video" && content.id === params.id)

    if (video) {
      videoData = video
      moduleData = module
      courseData = getCourseById(module.courseId)
      break
    }
  }

  if (!videoData || !moduleData || !courseData) {
    notFound()
  }

  // Encontrar videos relacionados del mismo curso
  const relatedVideos = modules
    .filter((module) => module.courseId === moduleData.courseId && module.status === "Activo")
    .flatMap((module) =>
      module.content
        .filter((content) => content.type === "video" && content.id !== videoData.id)
        .map((video) => ({
          ...video,
          moduleTitle: module.title,
        })),
    )
    .slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
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

      <main className="flex-1">
        <div className="container mx-auto py-12">
          {/* Breadcrumb y navegación */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/videos">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
            <nav className="flex">
              <ol className="flex items-center gap-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Inicio
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/videos" className="hover:text-foreground">
                    Videos
                  </Link>
                </li>
                <li>/</li>
                <li className="font-medium text-foreground">{videoData.title}</li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Reproductor de video */}
              <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="mx-auto h-16 w-16 mb-4 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xl font-medium">Reproducir video</p>
                  <p className="text-sm text-white/70 mt-2">
                    Regístrate o inicia sesión para ver el contenido completo
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Button asChild>
                      <Link href="/register">Registrarse</Link>
                    </Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Información del video */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{videoData.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{videoData.duration}</span>
                </div>
                <Badge>{courseData.title}</Badge>
                <Badge variant="outline">{moduleData.title}</Badge>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Me gusta
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>

              <div className="border-t pt-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                <p className="text-muted-foreground mb-4">
                  Este video forma parte del curso "{courseData.title}" y cubre conceptos fundamentales sobre gestión de
                  proyectos. Aprenderás técnicas prácticas que podrás aplicar inmediatamente en tu entorno profesional.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                    <span>Parte del módulo: {moduleData.title}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <span>Duración total del curso: {courseData.duration}</span>
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Comentarios</h2>
                  <span className="text-sm text-muted-foreground">12 comentarios</span>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <img src="/placeholder.svg?height=40&width=40" alt="Avatar" className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <textarea
                        placeholder="Añade un comentario..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        rows={3}
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <Button>Comentar</Button>
                      </div>
                    </div>
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <img
                        src={`/placeholder.svg?height=40&width=40&text=U${i}`}
                        alt={`Usuario ${i}`}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">Usuario Ejemplo {i}</h3>
                          <span className="text-xs text-muted-foreground">hace {i} días</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Excelente explicación. Me ha ayudado mucho a entender este concepto que me estaba costando
                          comprender. ¡Gracias por compartir!
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span>Me gusta ({i * 5})</span>
                          </button>
                          <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>Responder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Información del curso */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Sobre este curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold mb-2">{courseData.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{courseData.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Duración:</span>
                      <span className="font-medium">{courseData.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Módulos:</span>
                      <span className="font-medium">{modules.filter((m) => m.courseId === courseData.id).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Precio:</span>
                      <span className="font-medium">${courseData.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/cursos/${courseData.id}`}>Ver Curso Completo</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Videos relacionados */}
              <h3 className="font-bold text-lg mb-4">Videos relacionados</h3>
              <div className="space-y-4">
                {relatedVideos.map((video, index) => (
                  <Link href={`/videos/${video.id}`} key={index}>
                    <div className="flex gap-3 group">
                      <div className="relative w-24 h-16 flex-shrink-0">
                        <img
                          src={`/placeholder.svg?height=64&width=96&text=Video`}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="rounded-full bg-primary/90 p-1 text-primary-foreground">
                            <Play className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 px-1 text-[10px] text-white rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{video.moduleTitle}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
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

