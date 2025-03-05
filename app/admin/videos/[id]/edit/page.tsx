"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules, getCourseById } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { VideoForm, type VideoFormValues } from "@/components/video-form"

export default function EditVideoPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Encontrar el video en los módulos
  let videoData: any = null
  let moduleData: any = null
  let courseData: any = null

  // Buscar el video en todos los módulos
  for (const module of modules) {
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

  // Preparar los valores iniciales para el formulario
  const initialValues: VideoFormValues = {
    title: videoData.title,
    description: videoData.description || "Este video explica conceptos fundamentales relacionados con el módulo.",
    url: videoData.url || "",
    thumbnail: videoData.thumbnail || "",
    duration: videoData.duration || "",
    category: videoData.category || "Fundamentos",
    tags: videoData.tags || "",
    status: videoData.status || "Publicado",
    featured: videoData.featured || false,
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: VideoFormValues) => {
    setIsSubmitting(true)

    try {
      // Aquí iría la lógica para actualizar el video en la base de datos
      console.log("Actualizando video:", values)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la página de detalle del video
      router.push(`/admin/videos/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el video:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/videos/${params.id}`)
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
          <VideoForm initialValues={initialValues} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}

