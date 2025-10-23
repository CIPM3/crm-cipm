"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Save, X, ExternalLink } from "lucide-react"
import { useUpdateCourse } from "@/hooks/cursos"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CursoThumbnailProps {
  courseId: string
  currentThumbnail?: string
  courseTitle: string
}

export function CursoThumbnail({ courseId, currentThumbnail, courseTitle }: CursoThumbnailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(currentThumbnail || "")
  const { update, loading } = useUpdateCourse()
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      await update({ id: courseId, data: { thumbnail: thumbnailUrl } })
      toast({
        title: "Miniatura actualizada",
        description: "La miniatura del curso se ha actualizado correctamente.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error al actualizar la miniatura:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la miniatura del curso.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setThumbnailUrl(currentThumbnail || "")
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Miniatura del Curso
          </CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail-url">URL de la Miniatura</Label>
              <Input
                id="thumbnail-url"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Ingresa la URL de la imagen que deseas usar como miniatura del curso
              </p>
            </div>

            {thumbnailUrl && (
              <div className="space-y-2">
                <Label>Vista Previa</Label>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={thumbnailUrl}
                    alt={`Miniatura de ${courseTitle}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading || !thumbnailUrl}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Guardando..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {currentThumbnail ? (
              <>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={currentThumbnail}
                    alt={`Miniatura de ${courseTitle}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={currentThumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                  >
                    Ver imagen completa
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-video w-full rounded-lg border border-dashed bg-muted/50 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p className="text-sm">No hay miniatura configurada</p>
                <p className="text-xs">Haz clic en "Editar" para agregar una</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
