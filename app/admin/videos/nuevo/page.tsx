"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Video, Clock, Link2, Tag } from "lucide-react"
import { useCreateVideo } from "@/hooks/videos"

export default function NewVideoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()

  const {create} = useCreateVideo()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title")?.toString().trim() || ""
    const description = formData.get("description")?.toString().trim() || ""
    const url = formData.get("url")?.toString().trim() || ""
    const duration = formData.get("duration")?.toString().trim() || ""
    const thumbnail = formData.get("thumbnail")?.toString().trim() || ""
    const tags = formData.get("tags")?.toString().trim() || ""
    const featured = formData.get("featured") === "on"

    // Validaciones básicas
    if (!title || !description || !url || !duration) {
      setFormError("Todos los campos obligatorios deben estar completos.")
      return
    }
    // Validar duración formato mm:ss o hh:mm:ss
    if (!/^(\d{1,2}:)?\d{1,2}:\d{2}$/.test(duration)) {
      setFormError("La duración debe tener formato mm:ss o hh:mm:ss")
      return
    }

    // Mostrar los datos en consola
    let data = {
      title,
      description,
      url,
      duration,
      thumbnail,
      tags,
      featured,
    }

    setIsSubmitting(true)
    await create(data)
    router.push("/admin/videos")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/videos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Video</h1>
          <p className="text-muted-foreground">Añadir un nuevo video a la plataforma</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Video</Label>
              <div className="relative">
                <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                placeholder="Describe el contenido del video..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL del Video</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="url" name="url" placeholder="https://ejemplo.com/video.mp4" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="duration" name="duration" placeholder="15:30" className="pl-10" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL de la Miniatura</Label>
              <Input id="thumbnail" name="thumbnail" placeholder="https://ejemplo.com/thumbnail.jpg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tags"
                  name="tags"
                  placeholder="gestión, proyectos, introducción (separadas por comas)"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Destacado</Label>
                <p className="text-xs text-muted-foreground">Mostrar este video en la sección de destacados</p>
              </div>
              <Switch id="featured" name="featured" />
            </div>

            {formError && (
              <div className="text-red-500 text-sm font-medium">{formError}</div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/videos">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Guardando..." : "Guardar Video"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}