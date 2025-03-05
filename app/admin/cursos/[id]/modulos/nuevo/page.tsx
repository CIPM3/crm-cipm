"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { ModuloForm, type ModuloFormValues } from "@/components/form/modulo-form"

export default function NewModuloPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const course = getCourseById(params.id)

  if (!course) {
    notFound()
  }

  const handleSubmit = async (values: ModuloFormValues) => {
    try {
      // Aquí iría la lógica para guardar el nuevo módulo en la base de datos
      console.log("Creando nuevo módulo:", values)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

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

