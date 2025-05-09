"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { modules, getCourseById } from "@/lib/utils"
import { ArrowLeft, BookOpen, CheckCircle, Clock, Download, FileText, Play, Video } from "lucide-react"

export default function ContentDetailPage({ params }: { params: { id: string; contentId: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("content")

  // Obtener el curso
  const course = getCourseById(params.id)
  if (!course) {
    notFound()
  }

  // Encontrar el módulo y contenido específico
  let contentData: any = null
  let moduleData: any = null

  // Buscar en todos los módulos del curso
  const courseModules = modules.filter((module) => module.courseId === params.id)
  for (const module of courseModules) {
    const content = module.content.find((item) => item.id === params.contentId)
    if (content) {
      contentData = content
      moduleData = module
      break
    }
  }

  if (!contentData || !moduleData) {
    notFound()
  }

  // Determinar el tipo de contenido para mostrar la interfaz adecuada
  const contentType = contentData.type

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/cursos/${params.id}`}>
            <span>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver al curso</span>
            </span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{contentData.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/cursos/${params.id}`} className="hover:underline">
              {course.title}
            </Link>
            <span>•</span>
            <span>{moduleData.title}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {contentType === "video" && (
              <div className="aspect-video bg-black">
                {contentData.url ? (
                  <video
                    controls
                    className="w-full h-full"
                    poster={`/placeholder.svg?height=400&width=800&text=${encodeURIComponent(contentData.title)}`}
                  >
                    <source src={contentData.url} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-70" />
                      <p className="text-xl font-medium">Vista previa no disponible</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {contentType === "document" && (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-medium mb-2">{contentData.title}</h3>
                  <p className="text-muted-foreground mb-4">Documento de apoyo para el módulo {moduleData.title}</p>
                  <Button asChild>
                    <a href={contentData.url || "#"} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar documento
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {contentType === "quiz" && (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-medium mb-2">Evaluación: {contentData.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    Esta evaluación contiene {contentData.questions || "varias"} preguntas para poner a prueba tus
                    conocimientos.
                  </p>
                  <Button>
                    <Play className="mr-2 h-4 w-4" />
                    Comenzar evaluación
                  </Button>
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="resources">Recursos</TabsTrigger>
                  <TabsTrigger value="discussion">Discusión</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Descripción</h3>
                    <p className="text-muted-foreground">
                      {contentData.description ||
                        "Este contenido forma parte del módulo de aprendizaje y te ayudará a comprender mejor los conceptos clave del curso."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Objetivos de aprendizaje</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Comprender los conceptos fundamentales presentados en este material</li>
                      <li>Aplicar el conocimiento adquirido en situaciones prácticas</li>
                      <li>Desarrollar habilidades específicas relacionadas con el tema</li>
                      <li>Prepararse para las evaluaciones del módulo</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Materiales adicionales</h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 border rounded-md">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Guía de referencia rápida</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center p-2 border rounded-md">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Ejercicios prácticos</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Enlaces recomendados</h3>
                    <div className="space-y-2">
                      <a href="#" className="block p-2 border rounded-md hover:bg-muted">
                        <div className="font-medium">Documentación oficial</div>
                        <div className="text-sm text-muted-foreground">Recurso externo con información detallada</div>
                      </a>
                      <a href="#" className="block p-2 border rounded-md hover:bg-muted">
                        <div className="font-medium">Artículo relacionado</div>
                        <div className="text-sm text-muted-foreground">Lectura complementaria sobre el tema</div>
                      </a>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="space-y-4">
                  <div className="p-4 bg-muted rounded-md text-center">
                    <p className="text-muted-foreground">
                      Inicia sesión para participar en la discusión sobre este contenido.
                    </p>
                    <Button variant="outline" className="mt-2">
                      Iniciar sesión
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contenido del módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">{moduleData.title}</h3>
                <div className="text-xs text-muted-foreground">
                  {moduleData.content.length} elementos • {moduleData.duration || "Duración variable"}
                </div>
              </div>

              <div className="space-y-2">
                {moduleData.content.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/cursos/${params.id}/contenido/${item.id}`}
                    className={`flex items-center p-2 rounded-md ${
                      item.id === contentData.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                    }`}
                  >
                    <div className="mr-3">
                      {item.type === "video" && <Video className="h-4 w-4 text-primary" />}
                      {item.type === "document" && <FileText className="h-4 w-4 text-blue-500" />}
                      {item.type === "quiz" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.title}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {item.type === "video" && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.duration}
                          </span>
                        )}
                        {item.type === "document" && <span>Documento</span>}
                        {item.type === "quiz" && <span>{item.questions || "Varias"} preguntas</span>}
                      </div>
                    </div>
                    {item.id === contentData.id && (
                      <Badge variant="outline" className="ml-2">
                        Actual
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/cursos/${params.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Volver al curso
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

