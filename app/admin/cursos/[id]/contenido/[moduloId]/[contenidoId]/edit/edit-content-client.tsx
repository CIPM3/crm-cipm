"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ContentForm, type ContentFormValues } from "@/components/form/content-form"
import { useGetContentById, useUpdateContent } from "@/hooks/contenidos"
import { useGetModulesByCourseId } from "@/hooks/modulos"

interface EditContentClientProps {
  params: { id: string; moduloId: string; contenidoId: string }
}

export default function EditContentClient({ params }: EditContentClientProps) {
  const router = useRouter()
  const courseId = params.id
  const moduloId = params.moduloId
  const contentId = params.contenidoId
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { modules } = useGetModulesByCourseId(courseId) // Hook para obtener el módulo por ID
  const { content, loading, error } = useGetContentById(contentId)
  const { update } = useUpdateContent() 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
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

  const handleSubmit = async (values: ContentFormValues) => {
    setIsSubmitting(true)
    try {
      // Aquí iría la lógica para actualizar el contenido en la base de datos
      let data = {
        title: values.title,
        type: values.type,
        moduleId: values.moduleId,
        url: values.url,
        duration: values.duration,
        description: values.description,
      }
      await update(contentId,data)

      router.push(`/admin/cursos/${courseId}?tab=content`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el contenido:", error)
    } finally {
      setIsSubmitting(false)
    }
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