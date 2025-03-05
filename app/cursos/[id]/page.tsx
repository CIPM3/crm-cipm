import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCourseById, getModulesByCourseId, getCourses } from "@/lib/utils"
import { ArrowLeft, BookOpen, CheckCircle, Clock, FileText, Play, Star, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = getCourseById(params.id)

  if (!course || course.status !== "Activo") {
    notFound()
  }

  const modules = getModulesByCourseId(course.id).filter((module) => module.status === "Activo")

  // Contar tipos de contenido
  const contentCounts = modules.reduce(
    (acc, module) => {
      module.content?.forEach((content) => {
        if (content.type === "video") acc.videos++
        if (content.type === "document") acc.documents++
        if (content.type === "quiz") acc.quizzes++
      })
      return acc
    },
    { videos: 0, documents: 0, quizzes: 0 },
  )

  const courses = getCourses()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
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

      <main className="flex-1">
        <div className="container mx-auto py-12">
          {/* Breadcrumb y navegación */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/cursos">
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
                  <Link href="/cursos" className="hover:text-foreground">
                    Cursos
                  </Link>
                </li>
                <li>/</li>
                <li className="font-medium text-foreground">{course.title}</li>
              </ol>
            </nav>
          </div>

          {/* Encabezado del curso */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-muted-foreground">({course.enrollments} estudiantes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{modules.length} módulos</span>
                </div>
                <Badge>{course.type || "Online"}</Badge>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <span>{contentCounts.videos} videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <span>{contentCounts.documents} documentos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span>{contentCounts.quizzes} evaluaciones</span>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(course.title)}`}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-6">${course.price.toLocaleString()}</div>
                  <Button className="w-full mb-4">Inscribirse Ahora</Button>
                  <p className="text-sm text-muted-foreground text-center mb-4">Acceso completo de por vida</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Certificado de finalización</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Acceso a todos los materiales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Soporte de instructores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Actualizaciones gratuitas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contenido del curso */}
          <Tabs defaultValue="contenido" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="contenido">Contenido del Curso</TabsTrigger>
              <TabsTrigger value="instructores">Instructores</TabsTrigger>
              <TabsTrigger value="opiniones">Opiniones</TabsTrigger>
            </TabsList>

            <TabsContent value="contenido">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Lo que aprenderás</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Dominar los fundamentos de la gestión de proyectos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Aplicar metodologías ágiles en entornos reales</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Desarrollar habilidades de liderazgo efectivo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Prepararte para certificaciones internacionales</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold">Módulos del curso</h2>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <Card key={module.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">
                          Módulo {index + 1}: {module.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-3">
                          {module.content?.map((content, i) => (
                            <Link
                              key={i}
                              href={`/cursos/${course.id}/contenido/${content.id}`}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                            >
                              {content.type === "video" && (
                                <>
                                  <Play className="h-5 w-5 text-primary" />
                                  <div className="flex-1">
                                    <p className="font-medium">{content.title}</p>
                                    <p className="text-sm text-muted-foreground">{content.duration}</p>
                                  </div>
                                  <Badge variant="outline">Video</Badge>
                                </>
                              )}
                              {content.type === "document" && (
                                <>
                                  <FileText className="h-5 w-5 text-primary" />
                                  <div className="flex-1">
                                    <p className="font-medium">{content.title}</p>
                                    <p className="text-sm text-muted-foreground">Material de lectura</p>
                                  </div>
                                  <Badge variant="outline">Documento</Badge>
                                </>
                              )}
                              {content.type === "quiz" && (
                                <>
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                  <div className="flex-1">
                                    <p className="font-medium">{content.title}</p>
                                    <p className="text-sm text-muted-foreground">{content.questions} preguntas</p>
                                  </div>
                                  <Badge variant="outline">Evaluación</Badge>
                                </>
                              )}
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructores">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Conoce a tus instructores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <img
                          src="/placeholder.svg?height=150&width=150"
                          alt="Instructor"
                          className="rounded-full h-32 w-32 object-cover mx-auto sm:mx-0"
                        />
                        <div>
                          <h3 className="text-xl font-bold mb-2">Alex Morgan</h3>
                          <p className="text-primary mb-2">Especialista en Gestión de Proyectos</p>
                          <p className="text-muted-foreground mb-4">
                            Con más de 15 años de experiencia en gestión de proyectos internacionales. Certificado PMP y
                            Scrum Master.
                          </p>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">4.9</span>
                            <span className="text-muted-foreground">(120 valoraciones)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <img
                          src="/placeholder.svg?height=150&width=150"
                          alt="Instructor"
                          className="rounded-full h-32 w-32 object-cover mx-auto sm:mx-0"
                        />
                        <div>
                          <h3 className="text-xl font-bold mb-2">Sam Taylor</h3>
                          <p className="text-primary mb-2">Experto en Metodologías Ágiles</p>
                          <p className="text-muted-foreground mb-4">
                            Consultor de transformación ágil para empresas Fortune 500. Autor de varios libros sobre
                            Scrum y Kanban.
                          </p>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">4.8</span>
                            <span className="text-muted-foreground">(98 valoraciones)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="opiniones">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold">{course.rating}</div>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-muted-foreground mt-1">{course.enrollments} valoraciones</div>
                  </div>

                  <div className="flex-1 space-y-2 w-full max-w-md">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      // Simulamos porcentajes de valoraciones
                      const percent = rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center gap-1 w-12">
                            <span>{rating}</span>
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-10">{percent}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">Opiniones de los estudiantes</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={`/placeholder.svg?height=50&width=50&text=U${i}`}
                          alt={`Usuario ${i}`}
                          className="rounded-full h-12 w-12"
                        />
                        <div>
                          <h3 className="font-bold">Usuario Ejemplo {i}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${j < 5 ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">hace {i} semanas</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Este curso superó todas mis expectativas. El contenido está muy bien estructurado y los
                        instructores explican los conceptos de manera clara y concisa. Recomendaría este curso a
                        cualquier persona interesada en mejorar sus habilidades de gestión de proyectos.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Cursos relacionados */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Cursos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses
                .filter((c) => c.id !== course.id && c.status === "Activo")
                .slice(0, 3)
                .map((relatedCourse) => (
                  <Link href={`/cursos/${relatedCourse.id}`} key={relatedCourse.id}>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={`/placeholder.svg?height=150&width=300&text=${encodeURIComponent(relatedCourse.title)}`}
                          alt={relatedCourse.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{relatedCourse.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-medium">{relatedCourse.rating}</span>
                          </div>
                          <div className="text-lg font-bold">${relatedCourse.price.toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
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

