"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Clock, Save, CircleOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useGetVideoById } from "@/hooks/videos"
import { DeleteVideoDialog } from "@/components/dialog/delete-video-dialog"

function VideoActions({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  videoId,
  videoTitle,
}: {
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  videoId: string
  videoTitle: string
}) {
  return (
    <div className="flex gap-2">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          {/* <DeleteVideoDialog videoId={videoId} videoTitle={videoTitle} variant="outline" /> */}
        </>
      )}
    </div>
  )
}

function VideoFormFields({
  formData,
  onChange,
}: {
  formData: { title: string; duration: string; url: string; description: string }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título del Video</Label>
        <Input id="title" name="title" value={formData.title} onChange={onChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="duration">Duración</Label>
        <Input
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={onChange}
          placeholder="00:00"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="url">URL del Video</Label>
        <Input
          id="url"
          name="url"
          value={formData.url}
          onChange={onChange}
          placeholder="https://example.com/video.mp4"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
        />
      </div>
    </div>
  )
}

function VideoDetailView({ videoData }: { videoData: any }) {
  return (
    <div className="space-y-6">
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        {videoData.url ? (
          <video
            controls
            controlsList="nodownload"
            className="w-full h-full rounded-lg"
            onContextMenu={e => e.preventDefault()}
          >
            <source src={videoData.url} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        ) : (
          <div className="text-center text-white">
            <svg
              className="mx-auto h-16 w-16 mb-4 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium">Vista previa no disponible</p>
            <p className="text-sm text-white/70 mt-2">
              No hay URL de video configurada o el formato no es compatible
            </p>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Descripción</h3>
          <p className="text-muted-foreground">{videoData.description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Duración: {videoData.duration}</span>
          </div>
        </div>
        {videoData.url && (
          <div>
            <h3 className="text-sm font-medium mb-1">URL del Video</h3>
            <code className="block p-2 bg-muted rounded-md text-sm overflow-x-auto">{videoData.url}</code>
          </div>
        )}
      </div>
    </div>
  )
}

function VideoExtraInfo({ videoData }: { videoData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Adicional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">ID del Video</h3>
          <p className="text-sm text-muted-foreground">{videoData.id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-1">Tipo de Contenido</h3>
          <Badge variant="outline">Video</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

const initialFormState = (video: any, id: string) => ({
  title: video?.title || "",
  duration: video?.duration || "",
  url: video?.url || "",
  description: video?.description || "",
  id,
})

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const { video, loading, error } = useGetVideoById(params.id)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(initialFormState(video, params.id))

  React.useEffect(() => {
    setFormData(initialFormState(video, params.id))
  }, [video, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Lógica para guardar los cambios
    setIsEditing(false)
    console.log("Datos guardados:", formData)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="w-full flex items-center justify-between">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <div className="w-24 h-10">
                <div className="animate-pulse bg-muted rounded-md h-full w-full" />
              </div>
              <div className="w-24 h-10">
                <div className="animate-pulse bg-muted rounded-md h-full w-full" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-8 w-48 animate-pulse bg-muted rounded mb-2" />
            <div className="h-5 w-80 animate-pulse bg-muted rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-40 animate-pulse bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted animate-pulse rounded-lg mb-6" />
                <div className="space-y-4">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-24 bg-muted animate-pulse rounded mt-4" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <div className="h-6 w-32 animate-pulse bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
                <div>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 h-[85dvh] flex-col gap-3 text-center flex justify-center items-center">
        <CircleOff className="size-14 text-gray-500" />
        <h2 className="text-xl text-gray-400">Error al cargar el video</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/videos">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <VideoActions
            isEditing={isEditing}
            onEdit={() => {
              // setIsEditing(true)
            }}
            onCancel={() => {
              //setIsEditing(false)
            }}
            onSave={handleSave}
            videoId={formData.id}
            videoTitle={formData.title}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Editar Video" : "Detalle del Video"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modifica la información del video"
              : "Visualiza y gestiona el contenido del video"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? "Información del Video" : formData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <VideoFormFields formData={formData} onChange={handleChange} />
              ) : (
                <VideoDetailView videoData={formData} />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <VideoExtraInfo videoData={formData} />
        </div>
      </div>
    </div>
  )
}
