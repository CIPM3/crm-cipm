"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules, getCourseById } from "@/lib/utils"
import { ArrowLeft, BookOpen, Clock, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useGetVideoById } from "@/hooks/videos"
import { useGetContentById } from "@/hooks/contenidos"
import Header from "@/components/header/header-cliente"
import React from "react"
import Footer from "@/pages/cliente/main/footer"

function VideoInfo({ videoData, courseData, moduleData }: any) {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{videoData.title}</h1>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{videoData.duration}</span>
        </div>
        {courseData && <Badge>{courseData.title}</Badge>}
        {moduleData && <Badge variant="outline">{moduleData.title}</Badge>}
      </div>
    </>
  )
}

function VideoDescription({ courseData, moduleData }: any) {
  if (courseData && moduleData) {
    return (
      <div className="border-t pt-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Descripción</h2>
        <p className="text-muted-foreground mb-4">
          Este video forma parte del curso "{courseData.title}" y cubre conceptos fundamentales sobre gestión de
          proyectos. Aprenderás técnicas prácticas que podrás aplicar inmediatamente en tu entorno profesional.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
            <span>Parte del módulo: {moduleData.title}</span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <span>Duración total del curso: {courseData.duration}</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="border-t pt-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Descripción</h2>
      <p className="text-muted-foreground mb-4">
        Este es un video independiente, no asociado a ningún curso. Disfruta el contenido gratuito.
      </p>
    </div>
  )
}

function RelatedVideos({ relatedVideos }: { relatedVideos: any[] }) {
  if (!relatedVideos.length) {
    return <div className="text-muted-foreground">No hay videos relacionados.</div>
  }
  return (
    <>
      <h3 className="font-bold text-lg mb-4">Videos relacionados</h3>
      <div className="space-y-4 mb-8">
        {relatedVideos.map((video, index) => (
          <Link href={`/videos/${video.id}`} key={index}>
            <div className="flex gap-3 group">
              <div className="relative w-24 h-16 flex-shrink-0">
                <img
                  src={`/placeholder.svg?height=64&width=96&text=Video`}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-full bg-primary/90 p-1 text-primary-foreground">
                    <Play className="h-3 w-3" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 px-1 text-[10px] text-white rounded">
                  {video.duration}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{video.moduleTitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

function CourseInfo({ courseData }: any) {
  if (!courseData) return null
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sobre este curso</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">{courseData.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{courseData.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Duración:</span>
            <span className="font-medium">{courseData.duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Módulos:</span>
            <span className="font-medium">{modules.filter((m) => m.courseId === courseData.id).length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Precio:</span>
            <span className="font-medium">${courseData.price?.toLocaleString?.() ?? "N/A"}</span>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link href={`/cursos/${courseData.id}`}>Ver Curso Completo</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  // Obtener datos de ambas fuentes
  const { content: contentData } = useGetContentById(params.id)
  const { video: videoIndependiente } = useGetVideoById(params.id)

  let videoData: any = null
  let moduleData: any = null
  let courseData: any = null

  if (contentData) {
    videoData = contentData
    for (const module of modules) {
      if (module.status !== "Activo") continue
      if (module.content.find((c) => c.id === params.id)) {
        moduleData = module
        courseData = getCourseById(module.courseId)
        break
      }
    }
  } else if (videoIndependiente) {
    videoData = videoIndependiente
  }

  if (!videoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Video no encontrado</h2>
        <p className="text-muted-foreground mb-6">El video que buscas no existe o ha sido removido.</p>
        <Button asChild>
          <Link href="/videos">Volver a videos</Link>
        </Button>
      </div>
    )
  }

  const relatedVideos = (courseData && moduleData)
    ? modules
        .filter((module) => module.courseId === moduleData.courseId && module.status === "Activo")
        .flatMap((module) =>
          module.content
            .filter((content) => content.type === "video" && content.id !== videoData.id)
            .map((video) => ({
              ...video,
              moduleTitle: module.title,
            })),
        )
        .slice(0, 4)
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          {/* Breadcrumb y navegación */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/videos">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
            <nav className="flex">
              <ol className="flex items-center gap-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Inicio
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/videos" className="hover:text-foreground">
                    Videos
                  </Link>
                </li>
                <li>/</li>
                <li className="font-medium text-foreground">{videoData.title}</li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Reproductor de video */}
              <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
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
                  <p className="text-xl font-medium">Reproducir video</p>
                  <p className="text-sm text-white/70 mt-2">
                    Regístrate o inicia sesión para ver el contenido completo
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Button asChild>
                      <Link href="/register">Registrarse</Link>
                    </Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <VideoInfo videoData={videoData} courseData={courseData} moduleData={moduleData} />
              <VideoDescription courseData={courseData} moduleData={moduleData} />
              {courseData && moduleData && <RelatedVideos relatedVideos={relatedVideos} />}

              {/* Comentarios */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Comentarios</h2>
                  <span className="text-sm text-muted-foreground">12 comentarios</span>
                </div>
                {/* ...comentarios igual... */}
              </div>
            </div>
            <div>
              <CourseInfo courseData={courseData} />
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}