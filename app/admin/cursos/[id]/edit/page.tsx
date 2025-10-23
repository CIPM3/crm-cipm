"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { CursoForm, type CursoFormValues } from "@/components/form/curso-form"
import { useGetCourseById, useUpdateCourse } from "@/hooks/cursos"

export default function EditCursoPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Obtener el curso por ID
  const { course, loading, error } = useGetCourseById(params.id)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {update:UpdateCurso} = useUpdateCourse()

  // Renderizar contenido basado en el estado
  if (loading) {
    return <div className="text-center py-10">Cargando curso...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error al cargar el curso: {error.message}</div>
  }

  if (!course) {
    return <div className="text-center py-10 text-gray-500">El curso no existe o no está disponible.</div>
  }

  // Preparar los valores iniciales para el formulario
  const initialValues: CursoFormValues = {
    title: course.title,
    description: course.description,
    price: course.price,
    duration: course.duration,
    status: course.status as "Activo" | "Inactivo",
    type: course.type as "Online" | "Presencial" | "Híbrido",
    thumbnail: course.thumbnail || "",
  }


  const handleSubmit = async (values: CursoFormValues) => {
    setIsSubmitting(true)

    try {
      console.log('📝 Updating course:', { id: params.id, data: values })
      await UpdateCurso({ id: params.id, data: values })
      console.log('✅ Course updated successfully')

      // Redirigir a la página de detalle del curso
      router.push(`/admin/cursos/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error("❌ Error al actualizar el curso:", error)
      alert("Error al actualizar el curso. Por favor intenta de nuevo.")
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

