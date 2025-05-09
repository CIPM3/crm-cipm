"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ContentForm, type ContentFormValues } from "@/components/form/content-form"
import { getModulesByCourseId } from "@/lib/utils"

export default function NewContentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const courseId = params.id
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener los módulos del curso
  const modules = getModulesByCourseId(courseId)

  const handleSubmit = async (values: ContentFormValues) => {
    setIsSubmitting(true)

    try {
      // Aquí iría la lógica para guardar el nuevo contenido en la base de datos
      console.log("Creando nuevo contenido:", values)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la página del curso con la pestaña de contenido activa
      router.push(`/admin/cursos/${courseId}?tab=content`)
      router.refresh()
    } catch (error) {
      console.error("Error al crear el contenido:", error)
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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Contenido</h1>
          <p className="text-muted-foreground">Añade nuevo contenido al curso</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentForm
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
