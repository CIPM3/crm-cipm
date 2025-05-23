"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { ModuloForm, type ModuloFormValues } from "@/components/form/modulo-form"
import { useGetCourseById } from "@/hooks/cursos"
import { useCreateModule } from "@/hooks/modulos"

export default function NewModuloPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const {course,loading,error} = useGetCourseById(params.id)
  const {create, loading:loadingCC,error:errorCC} = useCreateModule()

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

  const handleSubmit = async (values: ModuloFormValues) => {
    try {
      // Aquí puedes realizar la lógica para crear el módulo
      let moduleData = {
        title: values.title,
        description: values.description,
        courseId: params.id,
        status: values.status,
        order: values.order,
        content: []
      }

      await create(moduleData)

      // Redirigir a la página del curso
      router.push(`/admin/cursos/${params.id}?tab=modules`)
      router.refresh()
    } catch (error) {
      console.error("Error al crear el módulo:", error)
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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Módulo</h1>
          <p className="text-muted-foreground">Añadir un nuevo módulo al curso "{course.title}"</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <ModuloForm courseId={params.id} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}

