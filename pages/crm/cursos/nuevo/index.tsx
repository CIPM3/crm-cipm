"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, BookOpen, DollarSign, Clock, Loader2 } from "lucide-react"
import { useCreateCourse } from "@/hooks/cursos"

export default function NewCoursePage() {
  const { create, loading, error } = useCreateCourse()
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const course = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration: formData.get("duration") as string,
      status: formData.get("status") as string,
      type: formData.get("type") as string,
      thumbnail: formData.get("thumbnail") as string,
      featured: formData.get("featured") === "on",
    }

    // Validaciones
    if (!course.title || !course.description || !course.price || !course.duration) {
      setFormError("Todos los campos obligatorios deben ser completados.")
      return
    }

    if (isNaN(course.price) || course.price <= 0) {
      setFormError("El precio debe ser un número mayor a 0.")
      return
    }

    try {
      await create(course)
      router.push("/admin/cursos")
    } catch (err) {
      setFormError("Ocurrió un error al guardar el curso. Inténtalo nuevamente.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/cursos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Curso</h1>
          <p className="text-muted-foreground">Añadir un nuevo curso a la plataforma</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {error && <p className="text-red-500 text-sm">{error.message}</p>}

            <div className="space-y-2">
              <Label htmlFor="title">Título del Curso</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="title"
                  name="title"
                  placeholder="Introducción a la Gestión de Proyectos"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe el contenido y objetivos del curso..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (MXN)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2,500"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="duration" name="duration" placeholder="4 semanas" className="pl-10" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status" defaultValue="Activo">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Curso</Label>
                <Select name="type" defaultValue="Online">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL de la Imagen de Portada</Label>
              <Input id="thumbnail" name="thumbnail" placeholder="https://ejemplo.com/imagen.jpg" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Destacado</Label>
                <p className="text-xs text-muted-foreground">Mostrar este curso en la sección de destacados</p>
              </div>
              <Switch id="featured" name="featured" />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/cursos">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-5 mr-2" /> Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}