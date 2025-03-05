"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules, getCourseById } from "@/lib/utils"
import { ArrowLeft, Edit, Save, Trash2, Clock, BookOpen, FileText, CheckSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContentDetailPage({ params }: { params: { id: string; contenidoId: string } }) {
  // Encontrar el contenido en los módulos
  let contentData: any = null
  let moduleData: any = null
  let courseData: any = null

  // Buscar el contenido en todos los módulos
  for (const module of modules) {
    if (module.courseId === params.id) {
      const content = module.content.find((content) => content.id === params.contenidoId)
      if (content) {
        contentData = content
        moduleData = module
        courseData = getCourseById(module.courseId)
        break
      }
    }
  }

  if (!contentData || !moduleData || !courseData) {
    notFound()
  }

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: contentData.title,
    type: contentData.type,
    url: contentData.url || "",
    duration: contentData.duration || "",
    questions: contentData.questions?.toString() || "",
    description: "Este contenido forma parte del módulo y proporciona información relevante para el curso.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    // En una implementación real, esto actualizaría la base de datos
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/cursos/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Editar Contenido" : contentData.title}</h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modifica la información del contenido"
              : `${contentData.type.charAt(0).toUpperCase() + contentData.type.slice(1)} del curso ${courseData.title}`}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Información del Contenido" : contentData.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de Contenido</Label>
                    <Select
                      defaultValue={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Documento</SelectItem>
                        <SelectItem value="quiz">Evaluación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === "video" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="url">URL del Video</Label>
                        <Input
                          id="url"
                          name="url"
                          value={formData.url}
                          onChange={handleChange}
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duración</Label>
                        <Input
                          id="duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="00:00"
                        />
                      </div>
                    </>
                  )}

                  {formData.type === "document" && (
                    <div className="grid gap-2">
                      <Label htmlFor="url">URL del Documento</Label>
                      <Input
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://example.com/document.pdf"
                      />
                    </div>
                  )}

                  {formData.type === "quiz" && (
                    <div className="grid gap-2">
                      <Label htmlFor="questions">Número de Preguntas</Label>
                      <Input
                        id="questions"
                        name="questions"
                        type="number"
                        value={formData.questions}
                        onChange={handleChange}
                        placeholder="10"
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="module">Módulo</Label>
                    <Select defaultValue={moduleData.id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar módulo" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules
                          .filter((m) => m.courseId === courseData.id)
                          .map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {contentData.type === "video" && (
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      {contentData.url ? (
                        <video
                          controls
                          className="w-full h-full rounded-lg"
                          poster={`/placeholder.svg?height=400&width=800&text=${encodeURIComponent(contentData.title)}`}
                        >
                          <source src={contentData.url} type="video/mp4" />
                          Tu navegador no soporta el elemento de video.
                        </video>
                      ) : (
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
                          <p className="text-xl font-medium">Vista previa no disponible</p>
                          <p className="text-sm text-white/70 mt-2">
                            No hay URL de video configurada o el formato no es compatible
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {contentData.type === "document" && (
                    <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-xl font-medium mb-2">Documento</p>
                      {contentData.url ? (
                        <Button asChild>
                          <Link href={contentData.url} target="_blank">
                            Ver Documento
                          </Link>
                        </Button>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay URL de documento configurada</p>
                      )}
                    </div>
                  )}

                  {contentData.type === "quiz" && (
                    <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                      <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-xl font-medium mb-2">Evaluación</p>
                      <p className="text-lg mb-4">{contentData.questions} preguntas</p>
                      <Button>Ver Evaluación</Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Descripción</h3>
                      <p className="text-muted-foreground">{formData.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {contentData.type === "video" && contentData.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duración: {contentData.duration}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Curso: {courseData.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Módulo: {moduleData.title}</span>
                      </div>
                    </div>

                    {contentData.url && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">URL</h3>
                        <code className="block p-2 bg-muted rounded-md text-sm overflow-x-auto">{contentData.url}</code>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">ID del Contenido</h3>
                <p className="text-sm text-muted-foreground">{contentData.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Estado</h3>
                <Badge variant={moduleData.status === "Activo" ? "default" : "secondary"}>{moduleData.status}</Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Tipo de Contenido</h3>
                <Badge variant="outline">{contentData.type.charAt(0).toUpperCase() + contentData.type.slice(1)}</Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Curso Asociado</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{courseData.title}</Badge>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <Link href={`/admin/cursos/${courseData.id}`}>Ver</Link>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Módulo</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{moduleData.title}</span>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <Link href={`/admin/cursos/${courseData.id}?module=${moduleData.id}`}>Ver</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

