"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Award, BookOpen, CheckCircle, Clock, FileText, Heart, Loader2, Menu, MessageCircle, Play, Share2, Star, ThumbsUp, Undo2, Video, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import HeaderCliente from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"
import { useFetchCourses, useGetCourseById } from "@/hooks/cursos"
import CursoCard from "@/components/card/curso-card"
import { useGetModulesByCourseId } from "@/hooks/modulos"
import { useGetContentsByModuleId } from "@/hooks/contenidos"
import { useGetEnrollmentsByCourseId, useGetEnrollmentsByStudentId, useUpdateEnrollment, useUpdateEnrollmentByStudentAndCourse } from "@/hooks/enrollments"
import { useAuthStore } from "@/store/useAuthStore"
import React, { useEffect, useMemo, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  // Hooks principales (todos se llaman siempre, antes de cualquier return)
  const { course, loading, error } = useGetCourseById(params.id)
  const { courses, loading: loadingCourses, error: errorCourses } = useFetchCourses()
  const { modules, loading: loadingModules, error: errorModules } = useGetModulesByCourseId(params.id)
  // Si tu hook espera un moduleId, deberías recorrer los módulos y llamar el hook para cada uno, pero aquí lo dejamos como está para mantener la lógica original.
  const { content, loading: loadingContent, error: errorContent } = useGetContentsByModuleId(params.id)
  const { enrollments: courseEnrollments, loading: loadingEnrollments } = useGetEnrollmentsByCourseId(params.id)
  const { user } = useAuthStore()
  // Siempre llama el hook, aunque user sea undefined
  const userId = user?.id ?? ""
  const { enrollments: userEnrollments = [] } = useGetEnrollmentsByStudentId(userId)

  // Memoizar cálculos pesados
  const Thumbnail = (course as any)?.thumbnail || "/placeholder.svg?height=200&width=400&text=Curso"
  const videoQty = useMemo(() => content.filter((item) => item.type === "video").length, [content])
  const documentQty = useMemo(() => content.filter((item) => item.type === "document").length, [content])
  const quizQty = useMemo(() => content.filter((item) => item.type === "quiz").length, [content])
  const isBuyed = useMemo(
    () => userEnrollments.some((enrollment) => enrollment.courseId === course?.id),
    [userEnrollments, course?.id]
  )
  // Estado para mostrar el player
  const [showPlayer, setShowPlayer] = useState(false)
  // Agrupar contenidos por módulo
  const contentsByModule = useMemo(() => {
    return modules.reduce((acc, module) => {
      acc[module.id] = content.filter((c) => c.moduleId === module.id)
      return acc
    }, {} as Record<string, typeof content>)
  }, [modules, content])

  // Loading y error global (después de todos los hooks)
  if (loading || loadingCourses || loadingModules || loadingContent || loadingEnrollments) {
    return (
      <div className="flex min-h-screen flex-col">
        <HeaderCliente />
        <main className="flex-1">
          <div className="container mx-auto py-12">
            <div className="text-center flex flex-col items-center mb-12">
              <h1 className="text-3xl font-bold">Cargando curso</h1>
              <Loader2 className="animate-spin size-10" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  if (error || errorCourses || errorModules || errorContent) {
    return (
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
  }
  if (!course) {
    return (
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
  }

  // --- RENDER PRINCIPAL ---
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <BreadcrumbNav title={course.title} />
          {!showPlayer ? (
            <>
              <CourseHeader
                course={course}
                modules={modules}
                enrollments={courseEnrollments}
                Thumbnail={Thumbnail}
                videoQty={videoQty}
                documentQty={documentQty}
                quizQty={quizQty}
                isBuyed={isBuyed}
                onShowPlayer={() => setShowPlayer(true)}
              />
              <CourseTabsSection
                modules={modules}
                course={course}
                contentsByModule={contentsByModule}
              />
              <RelatedCourses courses={courses} course={course} />
            </>
          ) : (
            <CoursePlayer
              course={course}
              modules={modules}
              contentsByModule={contentsByModule}
              onBack={() => setShowPlayer(false)}
            />
          )}
        </div>
      </main>
      <Footer />
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

function CourseHeader({ course, modules, enrollments, Thumbnail, videoQty, documentQty, quizQty, isBuyed, onShowPlayer }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div className="lg:col-span-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{course.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-muted-foreground">({enrollments.length} estudiantes)</span>
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
          <ContentCount icon={<Video className="h-4 w-4 text-primary" />} label="videos" count={videoQty} />
          <ContentCount icon={<FileText className="h-4 w-4 text-primary" />} label="documentos" count={documentQty} />
          <ContentCount icon={<CheckCircle className="h-4 w-4 text-primary" />} label="evaluaciones" count={quizQty} />
        </div>
      </div>
      <CourseSidebar course={course} Thumbnail={Thumbnail} isBuyed={isBuyed} onShowPlayer={onShowPlayer} />
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

function CourseSidebar({ course, Thumbnail, isBuyed, onShowPlayer }) {
  return (
    <div>
      <Card className="overflow-hidden shadow-lg">
        <div className="aspect-video w-full overflow-hidden">
          <img src={Thumbnail} alt={course.title} className="h-full w-full object-cover" />
        </div>
        <CardContent className="p-6">
          <div className="text-3xl font-bold mb-6">${course.price.toLocaleString()}</div>
          {
            isBuyed ? (
              <Button className="w-full mb-4" onClick={onShowPlayer}>
                Ver Curso
              </Button>
            ) : (
              <Link href={`/cursos/${course.id}`}>
                <Button className="w-full mb-4">Inscribirse Ahora</Button>
              </Link>
            )
          }
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


function CourseTabsSection({ modules, course, contentsByModule }) {
  return (
    <Tabs defaultValue="contenido" className="mb-12">
      <TabsList className="mb-6">
        <TabsTrigger value="contenido">Contenido del Curso</TabsTrigger>
        <TabsTrigger value="instructores">Instructores</TabsTrigger>
        <TabsTrigger value="opiniones">Opiniones</TabsTrigger>
      </TabsList>
      <TabsContent value="contenido">
        <CourseContent modules={modules} course={course} contentsByModule={contentsByModule} />
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

// --- PLAYER COMPONENTE ---
export function CoursePlayer({ course, modules, contentsByModule, onBack }) {
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Content selection
  const firstModule = modules[0];
  const firstContent = (contentsByModule[firstModule?.id] || [])[0];
  const [selectedContent, setSelectedContent] = useState(firstContent);
  
  // Get current user
  const USER = useAuthStore(state => state.user);
  
  // Get enrollment data
  const { enrollments, loading: loadingEnrollment } = useGetEnrollmentsByStudentId(USER?.id!!);
  const courseEnrollment = enrollments?.find(e => e.courseId === course.id);
  
  // Calculate progress
  const allContents = modules.flatMap(m => contentsByModule[m.id] || []);
  const totalContent = allContents.length;
  const [completedContent, setCompletedContent] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const progressPercentage = totalContent ? (completedContent.length / totalContent) * 100 : 0;
  
  // Update enrollment hook
  const { updateEnrollment, loading: updatingEnrollment } = useUpdateEnrollmentByStudentAndCourse();

  // Initialize from enrollment data
  useEffect(() => {
    if (!loadingEnrollment && courseEnrollment && !initialized) {
      setCompletedContent(courseEnrollment.completedContentIds || []);
      setInitialized(true);
      
      // Select first uncompleted content if exists
      if (courseEnrollment.completedContentIds) {
        const firstIncomplete = allContents.find(
          content => !courseEnrollment.completedContentIds.includes(content.id)
        );
        if (firstIncomplete) {
          const module = modules.find(m => 
            contentsByModule[m.id]?.some(c => c.id === firstIncomplete.id)
          );
          setSelectedContent({ 
            ...firstIncomplete, 
            moduleTitle: module?.title || "" 
          });
        }
      }
    }
  }, [loadingEnrollment, courseEnrollment, initialized, allContents, modules, contentsByModule]);

  const handleContentSelect = (content: typeof firstContent, moduleTitle: string) => {
    setSelectedContent({ ...content, moduleTitle });
  };

  const handleToggleCompleted = async () => {
    if (!selectedContent || !USER?.id) return;

    try {
      let newCompleted: string[];
      let newProgress: number;
      let action: 'completed' | 'uncompleted';

      if (completedContent.includes(selectedContent.id)) {
        // Undo completion
        newCompleted = completedContent.filter(id => id !== selectedContent.id);
        action = 'uncompleted';
      } else {
        // Mark as completed
        newCompleted = [...completedContent, selectedContent.id];
        action = 'completed';
      }

      newProgress = Math.round((newCompleted.length / totalContent) * 100);
      setCompletedContent(newCompleted);
      
      await updateEnrollment(USER.id, course.id, {
        progress: newProgress,
        completedContentIds: newCompleted,
        lastAccessed: new Date().toISOString(),
        ...(action === 'completed' && { 
          lastContentCompleted: selectedContent.id 
        }),
      });
      

      // Auto-advance to next content when marking as completed
      if (action === 'completed' && newCompleted.length < totalContent) {
        const currentIndex = allContents.findIndex(c => c.id === selectedContent.id);
        if (currentIndex < allContents.length - 1) {
          const nextContent = allContents[currentIndex + 1];
          const module = modules.find(m => 
            contentsByModule[m.id]?.some(c => c.id === nextContent.id)
          );
          setSelectedContent({ 
            ...nextContent, 
            moduleTitle: module?.title || "" 
          });
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      setCompletedContent(completedContent);
    
    }
  };

  if (loadingEnrollment || !initialized) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Cargando tu progreso...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 relative">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Course content sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 border-r bg-background overflow-y-auto
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
                <Link href="/cursos">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="font-semibold truncate">{course.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso del curso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedContent.length} de {totalContent} lecciones completadas
            </p>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-2">
              <h3 className="font-medium text-sm">
                Módulo {moduleIndex + 1}: {module.title}
              </h3>
              <div className="space-y-1">
                {(contentsByModule[module.id] || []).map((content) => (
                  <button
                    key={content.id}
                    onClick={() => handleContentSelect(content, module.title)}
                    className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                      selectedContent?.id === content.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {content.type === "video" && <Play className="h-4 w-4 flex-shrink-0" />}
                      {content.type === "document" && <FileText className="h-4 w-4 flex-shrink-0" />}
                      {content.type === "quiz" && <Award className="h-4 w-4 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{content.title}</p>
                        <p className="text-xs opacity-70">
                          {content.type === "video" && content.duration}
                          {content.type === "document" && content.duration}
                          {content.type === "quiz" && `${content.questions} preguntas`}
                        </p>
                      </div>
                      {completedContent.includes(content.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content player */}
      <div className="flex-1">
        {selectedContent ? (
          <>
            <div className="bg-gradient-to-b from-[#1a2236] to-[#232b3e] rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[350px]">
              {selectedContent.type === "video" ? (
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
                  {selectedContent.url ? (
                    <video
                      src={selectedContent.url}
                      poster={selectedContent.thumbnail || course.thumbnail}
                      controls
                      controlsList="nodownload noremoteplayback"
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a2236] to-[#232b3e]">
                      <div className="text-center text-white">
                        <img
                          src={selectedContent.thumbnail || course.thumbnail}
                          alt={selectedContent.title}
                          className="mx-auto mb-4 rounded max-h-60 object-contain"
                        />
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                        <p className="text-lg font-medium">{selectedContent.title}</p>
                        <p className="text-sm opacity-70">{selectedContent.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedContent.type === "document" ? (
                <div className="p-8 text-center">
                  <FileText className="h-16 w-16 text-white opacity-70 mb-4 mx-auto" />
                  <h3 className="text-2xl text-white font-semibold mb-2">{selectedContent.title}</h3>
                  <p className="text-white/80">Documento de lectura</p>
                </div>
              ) : selectedContent.type === "quiz" ? (
                <div className="p-8 text-center">
                  <Award className="h-16 w-16 text-white opacity-70 mb-4 mx-auto" />
                  <h3 className="text-2xl text-white font-semibold mb-2">{selectedContent.title}</h3>
                  <p className="text-white/80">{selectedContent.questions} preguntas</p>
                </div>
              ) : null}
            </div>

            <div className="flex mt-6 py-4 flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedContent.title}</h3>
                <p className="text-muted-foreground">{selectedContent.moduleTitle}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedContent.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleToggleCompleted}
                  disabled={!USER || updatingEnrollment}
                  variant={
                    completedContent.includes(selectedContent.id) 
                      ? "secondary" 
                      : "default"
                  }
                  className="flex-shrink-0"
                >
                  {updatingEnrollment ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : completedContent.includes(selectedContent.id) ? (
                    <>
                      <Undo2 className="h-4 w-4 mr-2" />
                      Deshacer completado
                    </>
                  ) : (
                    "Marcar como completado"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-y">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Me gusta
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>

            <CommentsSection />
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Selecciona una lección para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentsSection() {
  // Estado local para comentarios (simulación)
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "María García",
      time: "hace 2 horas",
      text: "Excelente introducción, muy clara la explicación sobre los conceptos básicos.",
      likes: 5,
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      time: "hace 1 día",
      text: "¿Podrían profundizar más en la diferencia entre proyecto y operación?",
      likes: 2,
    },
  ])
  const [input, setInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim().length === 0) return
    setComments([
      {
        id: Date.now(),
        name: "Tú",
        time: "ahora",
        text: input,
        likes: 0,
      },
      ...comments,
    ])
    setInput("")
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold text-lg">Comentarios ({comments.length})</span>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border rounded-lg p-3 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          placeholder="Escribe tu comentario o pregunta..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={input.trim().length === 0}
          >
            Publicar comentario
          </button>
        </div>
      </form>
      <div className="mt-6 space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center text-xs font-bold text-gray-500">
                {comment.name[0]}
              </div>
              <span className="font-semibold">{comment.name}</span>
              <span className="text-xs text-muted-foreground">{comment.time}</span>
            </div>
            <div className="mb-2">{comment.text}</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>👍 {comment.likes}</span>
              <button className="hover:underline">Responder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseContent({ modules, course, contentsByModule }) {
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
                {(contentsByModule[module.id] || []).map((content, i) => (
                  <Link
                    key={i}
                    href={`/cursos/${course.id}`}
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
      name: "Adrian Leal",
      role: "CEO de Cursos Perzonalizados Monterrey",
      desc: "Con mas de 15 anos de experiencia en clases de ingles, Adrian es un experto en la enseñanza de idiomas y habilidades empresariales.",
      rating: 4.9,
      reviews: 120,
      img: "https://firebasestorage.googleapis.com/v0/b/cipmbilling-24963.appspot.com/o/cursoImages%2F215c23359a99c235fe999204b%2F215c23359a99c235fe999204b.jpg?alt=media&token=3d735907-1ce2-462d-a6c4-8715aa1d198a"
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
                  className="rounded-full h-32 w-32 object-contain mx-auto sm:mx-0"
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