"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ModuloForm, type ModuloFormValues } from "@/components/form/modulo-form"
import { useGetCourseById } from "@/hooks/cursos"
import { useGetModulesByCourseId, useUpdateModule } from "@/hooks/modulos"

export default function EditModuloPage({ params }: { params: { id: string; moduloId: string } }) {
  const router = useRouter()

  const { course, loading, error } = useGetCourseById(params.id)
  const { modules, loading:loadingMM,error:errorMM } = useGetModulesByCourseId(params.id)
  const module = modules.find((m) => m.id === params.moduloId)

  const {update} = useUpdateModule()

  if (loading || loadingMM) {
    return <div className="text-center py-10">Cargando curso...</div>
  }

  if (error || errorMM) {
    return <div className="text-center py-10 text-red-500">Error al cargar el curso</div>
  }

  if (!course || !module) {
    return <div className="text-center py-10 text-gray-500">El curso no existe o no está disponible.</div>
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
      let data = {
        ...values,
        moduleId: params.moduloId,
      }

      await update(module.id,data)

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

