"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ContentForm, type ContentFormValues } from "@/components/form/content-form"
import { useGetModulesByCourseId } from "@/hooks/modulos"
import { useGetContentById, useUpdateContent } from "@/hooks/contenidos"
import { toast } from "sonner"

export default function EditContentPage({ params }: { params: { id: string; moduloId: string; contenidoId: string } }) {
  const router = useRouter()
  const courseId = params.id
  const contentId = params.contenidoId

  // Obtener los módulos del curso
  const { modules, loading: loadingModules, error: errorModules } = useGetModulesByCourseId(courseId)

  // Obtener el contenido por ID
  const { content, loading: loadingContent, error: errorContent } = useGetContentById(contentId)

  // Hook para actualizar contenido
  const { update: updateContentData, loading: isSubmitting } = useUpdateContent()

  const isLoading = loadingModules || loadingContent

  const handleSubmit = async (values: ContentFormValues) => {
    try {
      await updateContentData(contentId, {
        title: values.title,
        type: values.type,
        moduleId: values.moduleId,
        url: values.url,
        duration: values.duration,
        description: values.description,
        questions: values.questions ? Number(values.questions) : undefined,
      })
      toast.success("Contenido actualizado exitosamente")
      router.push(`/admin/cursos/${courseId}?tab=content`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el contenido:", error)
      toast.error("Error al actualizar el contenido")
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

  if (errorContent || errorModules) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Error al cargar</h2>
        <p className="text-muted-foreground mb-4">
          {errorContent?.message || errorModules?.message || "Ocurrió un error al cargar los datos"}
        </p>
        <Button asChild>
          <Link href={`/admin/cursos/${courseId}?tab=content`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al curso
          </Link>
        </Button>
      </div>
    )
  }

  if (!content || !modules) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Contenido no encontrado</h2>
        <p className="text-muted-foreground mb-4">El contenido que buscas no existe o ha sido eliminado.</p>
        <Button asChild>
          <Link href={`/admin/cursos/${courseId}?tab=content`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al curso
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
