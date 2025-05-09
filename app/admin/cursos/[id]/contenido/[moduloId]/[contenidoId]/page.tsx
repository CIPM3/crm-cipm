"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ContentForm, type ContentFormValues } from "@/components/form/content-form"
import { getModulesByCourseId } from "@/lib/utils"

export default function EditContentPage({ params }: { params: { id: string; contentId: string } }) {
  const router = useRouter()
  const courseId = params.id
  const contentId = params.contentId
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Obtener los módulos del curso
  const modules = getModulesByCourseId(courseId)

  // Simular la carga del contenido desde la API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Aquí iría la lógica para obtener el contenido de la base de datos
        // Simulamos la obtención del contenido
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Buscar el contenido en los módulos
        let foundContent: any = null
        let moduleId = ""

        for (const module of modules) {
          const found = module.content.find((c: any) => c.id === contentId)
          if (found) {
            foundContent = found
            moduleId = module.id
            break
          }
        }

        if (foundContent) {
          setContent({
            ...foundContent,
            moduleId,
          })
        }
      } catch (error) {
        console.error("Error al cargar el contenido:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [contentId, modules])

  const handleSubmit = async (values: ContentFormValues) => {
    setIsSubmitting(true)

    try {
      // Aquí iría la lógica para actualizar el contenido en la base de datos
      console.log("Actualizando contenido:", contentId, values)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la página del curso con la pestaña de contenido activa
      router.push(`/admin/cursos/${courseId}?tab=content`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el contenido:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Contenido no encontrado</h2>
        <p className="text-muted-foreground mb-4">El contenido que buscas no existe o ha sido eliminado.</p>
        <Button asChild>
          <Link href={`/admin/cursos/${courseId}?tab=content`}>
            <span className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al curso
            </span>
          </Link>
        </Button>
      </div>
    )
  }

  // Preparar los valores iniciales para el formulario
  const initialValues: ContentFormValues = {
    title: content.title,
    type: content.type,
    moduleId: content.moduleId,
    url: content.url || "",
    duration: content.duration || "",
    description: content.description || "",
    questions: content.questions ? String(content.questions) : "",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/cursos/${courseId}?tab=content`}>
            <span className="flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Contenido</h1>
          <p className="text-muted-foreground">Modifica la información del contenido</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentForm
            initialValues={initialValues}
            modules={modules}
            courseId={courseId}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/admin/cursos/${courseId}?tab=content`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
