"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { CursoForm, type CursoFormValues } from "@/components/form/curso-form"

export default function EditCursoPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Obtener el curso por ID
  const course = getCourseById(params.id)

  if (!course) {
    notFound()
  }

  // Preparar los valores iniciales para el formulario
  const initialValues: CursoFormValues = {
    title: course.title,
    description: course.description,
    price: course.price,
    duration: course.duration,
    status: course.status as "Activo" | "Inactivo",
    type: course.type as "Online" | "Presencial" | "Híbrido",
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: CursoFormValues) => {
    setIsSubmitting(true)

    try {
      // Aquí iría la lógica para actualizar el curso en la base de datos
      console.log("Actualizando curso:", values)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la página de detalle del curso
      router.push(`/admin/cursos/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el curso:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/cursos/${params.id}`)
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
          <h1 className="text-3xl font-bold tracking-tight">Editar Curso</h1>
          <p className="text-muted-foreground">Actualiza la información del curso "{course.title}"</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <CursoForm initialValues={initialValues} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}

