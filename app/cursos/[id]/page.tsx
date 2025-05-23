"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModulesByCourseId } from "@/lib/utils"
import { ArrowLeft, BookOpen, CheckCircle, Clock, FileText, Loader2, Play, Star, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import HeaderCliente from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"
import { useFetchCourses, useGetCourseById } from "@/hooks/cursos"
import CursoCard from "@/components/card/curso-card"
import { useGetModulesByCourseId } from "@/hooks/modulos"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { course, loading, error } = useGetCourseById(params.id)
  const { courses, loading: LoadingCourses, error: errorCourses } = useFetchCourses()
  const {modules} = useGetModulesByCourseId(params.id)


  if (loading) return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center flex flex-col items-center mb-12">
            <h1 className="text-3xl font-bold">Cargando curso</h1>
            <Loader2 className="animate-spin size-10"/>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
  if (error) return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center flex flex-col items-center mb-12">
            <h1 className="text-3xl font-bold">Error al cargar el curso</h1>
            <Link href={"/cursos"}>
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Cursos
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
  if (!course) return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center flex flex-col items-center mb-12">
            <h1 className="text-3xl font-bold">El curso no existe o ha sido eliminado.</h1>
            <Link href={"/cursos"}>
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Cursos
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

  const Thumbnail = course.thumbnail || "/placeholder.svg?height=200&width=400&text=Curso"

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

  // --- RENDER PRINCIPAL ---
  return (
    <div className="flex min-h-screen flex-col">
      <Content>
        <main className="flex-1">
          <div className="container mx-auto py-12">
            <BreadcrumbNav title={course.title} />
            <CourseHeader
              course={course}
              modules={modules}
              contentCounts={contentCounts}
              Thumbnail={Thumbnail}
            />
            <CourseTabsSection modules={modules} course={course} />
            <RelatedCourses courses={courses} course={course} />
          </div>
        </main>
      </Content>
    </div>
  )
}

// --- COMPONENTES INTERNOS ---

function BreadcrumbNav({ title }: { title?: string }) {
  return (
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
            <Link href="/" className="hover:text-foreground">Inicio</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/cursos" className="hover:text-foreground">Cursos</Link>
          </li>
          <li>/</li>
          <li className="font-medium text-foreground">{title}</li>
        </ol>
      </nav>
    </div>
  )
}

function CourseHeader({ course, modules, contentCounts, Thumbnail }) {
  return (
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
          <Badge>{"Online"}</Badge>
        </div>
        <div className="flex flex-wrap gap-4">
          <ContentCount icon={<Video className="h-4 w-4 text-primary" />} label="videos" count={contentCounts.videos} />
          <ContentCount icon={<FileText className="h-4 w-4 text-primary" />} label="documentos" count={contentCounts.documents} />
          <ContentCount icon={<CheckCircle className="h-4 w-4 text-primary" />} label="evaluaciones" count={contentCounts.quizzes} />
        </div>
      </div>
      <CourseSidebar course={course} Thumbnail={Thumbnail} />
    </div>
  )
}

function ContentCount({ icon, label, count }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-primary/10 p-1">{icon}</div>
      <span>{count} {label}</span>
    </div>
  )
}

function CourseSidebar({ course, Thumbnail }) {
  return (
    <div>
      <Card className="overflow-hidden shadow-lg">
        <div className="aspect-video w-full overflow-hidden">
          <img src={Thumbnail} alt={course.title} className="h-full w-full object-cover" />
        </div>
        <CardContent className="p-6">
          <div className="text-3xl font-bold mb-6">${course.price.toLocaleString()}</div>
          <Button className="w-full mb-4">Inscribirse Ahora</Button>
          <p className="text-sm text-muted-foreground text-center mb-4">Acceso completo de por vida</p>
          <div className="space-y-2">
            {[
              "Certificado de finalización",
              "Acceso a todos los materiales",
              "Soporte de instructores",
              "Actualizaciones gratuitas"
            ].map((txt, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">{txt}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CourseTabsSection({ modules, course }) {
  return (
    <Tabs defaultValue="contenido" className="mb-12">
      <TabsList className="mb-6">
        <TabsTrigger value="contenido">Contenido del Curso</TabsTrigger>
        <TabsTrigger value="instructores">Instructores</TabsTrigger>
        <TabsTrigger value="opiniones">Opiniones</TabsTrigger>
      </TabsList>
      <TabsContent value="contenido">
        <CourseContent modules={modules} course={course} />
      </TabsContent>
      <TabsContent value="instructores">
        <InstructorsTab />
      </TabsContent>
      <TabsContent value="opiniones">
        <ReviewsTab course={course} />
      </TabsContent>
    </Tabs>
  )
}

function CourseContent({ modules, course }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lo que aprenderás</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          "Dominar los fundamentos de la gestión de proyectos",
          "Aplicar metodologías ágiles en entornos reales",
          "Desarrollar habilidades de liderazgo efectivo",
          "Prepararte para certificaciones internacionales"
        ].map((txt, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <span>{txt}</span>
          </div>
        ))}
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
  )
}

function InstructorsTab() {
  const instructors = [
    {
      name: "Alex Morgan",
      role: "Especialista en Gestión de Proyectos",
      desc: "Con más de 15 años de experiencia en gestión de proyectos internacionales. Certificado PMP y Scrum Master.",
      rating: 4.9,
      reviews: 120,
      img: "/placeholder.svg?height=150&width=150"
    },
    {
      name: "Sam Taylor",
      role: "Experto en Metodologías Ágiles",
      desc: "Consultor de transformación ágil para empresas Fortune 500. Autor de varios libros sobre Scrum y Kanban.",
      rating: 4.8,
      reviews: 98,
      img: "/placeholder.svg?height=150&width=150"
    }
  ]
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Conoce a tus instructores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {instructors.map((inst, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={inst.img}
                  alt={inst.name}
                  className="rounded-full h-32 w-32 object-cover mx-auto sm:mx-0"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">{inst.name}</h3>
                  <p className="text-primary mb-2">{inst.role}</p>
                  <p className="text-muted-foreground mb-4">{inst.desc}</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{inst.rating}</span>
                    <span className="text-muted-foreground">({inst.reviews} valoraciones)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ReviewsTab({ course }) {
  return (
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
  )
}

function RelatedCourses({ courses, course }) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Cursos relacionados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses
          .filter((c) => c.id !== course.id && c.status === "Activo")
          .slice(0, 3)
          .map((relatedCourse) => (
            <Link href={`/cursos/${relatedCourse.id}`} key={relatedCourse.id}>
              <CursoCard curso={relatedCourse} type="cliente" />
            </Link>
          ))}
      </div>
    </div>
  )
}

// Mantén Content como está
const Content = ({ children }) => (
  <>
    <HeaderCliente />
    {children}
    <Footer />
  </>
)