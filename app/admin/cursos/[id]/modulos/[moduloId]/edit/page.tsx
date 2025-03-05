"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById, getModulesByCourseId } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { ModuloForm, type ModuloFormValues } from "@/components/form/modulo-form"

export default function EditModuloPage({ params }: { params: { id: string; moduloId: string } }) {
  const router = useRouter()
  const course = getCourseById(params.id)
  const modules = getModulesByCourseId(params.id)
  const module = modules.find((m) => m.id === params.moduloId)

  if (!course || !module) {
    notFound()
  }

  // Preparar los valores iniciales para el formulario
  const initialValues: ModuloFormValues = {
    title: module.title,
    description: module.description || "Este módulo contiene material educativo relacionado con el curso.",
    order: module.order,
    status: module.status as "Activo" | "Inactivo",
  }

  const handleSubmit = async (values: ModuloFormValues) => {
    try {
      // Aquí iría la lógica para actualizar el módulo en la base de datos
      console.log("Actualizando módulo:", values)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la página del curso
      router.push(`/admin/cursos/${params.id}?tab=modules`)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el módulo:", error)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/cursos/${params.id}?tab=modules`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/cursos/${params.id}?tab=modules`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Editar Módulo</h1>
          <p className="text-muted-foreground">
            Actualizar el módulo "{module.title}" del curso "{course.title}"
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <ModuloForm
            courseId={params.id}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}

