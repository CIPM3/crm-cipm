"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ContenidoForm } from "@/components/form/contenido-form"
import { ContentFormValues } from "@/components/form/content-form"
import { useGetVideoById, useUpdateVideo } from "@/hooks/videos"
import { useGetModulesByCourseId } from "@/hooks/modulos"
import { toast } from "sonner"

export default function EditVideoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { video: videoData, error, loading } = useGetVideoById(params.id)
  const { update: updateVideo, loading: isSubmitting } = useUpdateVideo()

  // courseId puede ser undefined en el primer render, está bien pasarlo así al hook
  const courseId = videoData?.courseId

  const { modules, loading: loadingModules, error: errorModules } = useGetModulesByCourseId(courseId)

  const handleSubmit = async (values: ContentFormValues) => {
    try {
      await updateVideo(params.id, {
        title: values.title,
        description: values.description,
        url: values.url,
        duration: values.duration,
        moduleId: values.moduleId,
        type: values.type,
        questions: values.questions ? Number(values.questions) : undefined,
      })
      toast.success("Video actualizado exitosamente")
      router.push(`/admin/videos/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el video:", error)
      toast.error("Error al actualizar el video")
    }
  }

  const handleCancel = () => {
    router.push(`/admin/videos/${params.id}`)
  }

  if (loading || loadingModules) {
    return <div className="text-center py-10">Cargando curso...</div>
  }

  if (error || errorModules) {
    return <div className="text-center py-10 text-red-500">Error al cargar el curso o módulos.</div>
  }

  if (!videoData || !modules) {
    return <div className="text-center py-10 text-gray-500">El curso o los módulos no existen o no están disponibles.</div>
  }

  const initialValues: ContentFormValues = {
    title: videoData.title,
    description: videoData.description || "Este video explica conceptos fundamentales relacionados con el módulo.",
    url: videoData.url || "",
    duration: videoData.duration || "",
    moduleId: videoData.moduleId || "",
    type: videoData.type || "video",
    questions: videoData.questions ? String(videoData.questions) : "",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/videos/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Editar Video</h1>
          <p className="text-muted-foreground">Actualiza la información del video "{videoData.title}"</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Video</CardTitle>
        </CardHeader>
        <CardContent>
          <ContenidoForm
            initialValues={initialValues}
            modules={modules}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}