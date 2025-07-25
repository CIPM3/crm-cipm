"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules, getCourseById } from "@/lib/utils"
import { ArrowLeft, BookOpen, Clock, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFetchVideos, useGetVideoById } from "@/hooks/videos"
import { useGetContentById } from "@/hooks/contenidos"
import Header from "@/components/header/header-cliente"
import React from "react"
import Footer from "@/pages/cliente/main/footer"
import ComentarioCard from "@/components/card/comentario-card"

function VideoInfo({ videoData, courseData, moduleData }: any) {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{videoData?.title}</h1>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{videoData?.duration}</span>
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

function RelatedVideos({ relatedVideos, videoId }: { relatedVideos: any[], videoId?: string }) {
  const { videos, loading, error } = useFetchVideos()

  if (error) {
    return <div className="text-red-500">Error al cargar videos relacionados.</div>
  }

  // Filtrar videos relacionados, excluyendo el video actual
  if (videoId) {
    relatedVideos = videos.filter(video => video.id !== videoId).slice(0, 4)
  } else {
    relatedVideos = videos.slice(0, 4)
  }


  if (!relatedVideos.length) {
    return <div className="text-muted-foreground">No hay videos relacionados.</div>
  }

  return (
    <div className="w-full h-fit pb-1  shadow-md shadow-black/10 px-4 rounded-lg">
      <h3 className="font-bold text-lg mb-4">Videos relacionados</h3>
      <div className="space-y-4 mb-8 grid">

        {
          loading && (
            <>
              {
                Array.from({ length: 4 }).map((_, index) => (
                  <div className="flex gap-3 group">
                    <div className="relative size-28 h-20 flex-shrink-0">
                      <div className="animate-pulse w-full h-full object-cover rounded-md bg-muted" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div className="animate-pulse bg-muted w-full h-3 rounded-md" />
                      <div className="animate-pulse bg-muted w-1/3 h-3 rounded-md" />
                    </div>
                  </div>
                ))
              }
            </>
          )
        }

        {
          error && (
            <div className="flex justify-center items-center text-gray-400 font-semibold">Error al cargar videos relacionados.</div>
          )
        }

        {relatedVideos.length > 0 && relatedVideos.map((video, index) => (
          <Link href={`/videos/${video.id}`} key={index}>
            <div className="flex gap-3 group">
              <div className="relative size-28 h-20 flex-shrink-0">
                <img
                  src={`${video.thumbnail ? video.thumbnail : "/placeholder.svg?height=64&width=96&text=Video"}`}
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

        {
          relatedVideos.length >= 4 && (
            <Link href={`/videos`}>
              <div className="text-center text-primary hover:underline mt-4">
                Ver más videos
              </div>
            </Link>
          )
        }
      </div>
    </div>
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
  const { content: contentData, loading: loadingContent } = useGetContentById(params.id)
  const { video: videoIndependiente, loading: loadingVideo } = useGetVideoById(params.id)

  const isLoading = loadingContent || loadingVideo

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

  const relatedVideos = (courseData && moduleData)
    ? modules
      .filter((module) => module.courseId === moduleData.courseId && module.status === "Activo")
      .flatMap((module) =>
        module.content
          .filter((content) => content.type === "video" && content.id !== videoData?.id)
          .map((video) => ({
            ...video,
            moduleTitle: module.title,
          })),
      )
      .slice(0, 4)
    : [
      // {
      //   id: "random1",
      //   title: "Video Aleatorio 1",
      //   duration: "5:00",
      //   url: "/placeholder.mp4",
      //   thumbnail: "/placeholder.svg?height=360&width=640&text=Video+Aleatorio+1",
      //   moduleTitle: "Módulo Aleatorio 1",
      // },
      // {
      //   id: "random2",
      //   title: "Video Aleatorio 2",
      //   duration: "6:30",
      //   url: "/placeholder.mp4",
      //   thumbnail: "/placeholder.svg?height=360&width=640&text=Video+Aleatorio+2",
      //   moduleTitle: "Módulo Aleatorio 2",
      // },
    ]

  // Mostrar skeleton si está cargando
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto py-12">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Video skeleton */}
                <div className="aspect-video bg-muted rounded-lg mb-6 animate-pulse" />
                {/* Title skeleton */}
                <div className="h-8 w-2/3 bg-muted rounded mb-4 animate-pulse" />
                {/* Info skeleton */}
                <div className="flex gap-4 mb-6">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </div>
                {/* Description skeleton */}
                <div className="border-t pt-6 mb-8">
                  <div className="h-6 w-1/4 bg-muted rounded mb-4 animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
                {/* Related videos skeleton */}
                <div className="h-6 w-1/3 bg-muted rounded mb-4 animate-pulse" />
                <div className="space-y-4 mb-8">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-24 h-16 bg-muted rounded-md animate-pulse" />
                      <div>
                        <div className="h-4 w-32 bg-muted rounded mb-2 animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Comments skeleton */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-10 w-full bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                {/* Course info skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-1/2 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-1/3 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Mostrar mensaje si no se encontró el video
  if (!videoData && !isLoading) {
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


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          {/* Breadcrumb y navegación */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
            <nav className="flex">
              <ol className="flex flex-col md:flex-row md:items-center gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <li>
                      <Link href="/" className="hover:text-foreground">
                        Inicio
                      </Link>
                    </li>
                    <li>/</li>
                  </div>
                  <div className="flex items-center gap-1">
                    <li>
                      <Link href="/videos" className="hover:text-foreground">
                        Videos
                      </Link>
                    </li>
                    <li>/</li>
                  </div>
                </div>
                <li className="font-medium text-foreground">{videoData?.title}</li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Reproductor de video */}
              <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-cover rounded-lg"
                  src={videoData?.url}
                  poster={videoData?.thumbnail || "/placeholder.svg?height=360&width=640&text=Video"}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  Tu navegador no soporta la etiqueta de video.
                </video>
              </div>

              <VideoInfo videoData={videoData} courseData={courseData} moduleData={moduleData} />
              <VideoDescription courseData={courseData} moduleData={moduleData} />
              {courseData && moduleData && <RelatedVideos relatedVideos={relatedVideos} />}

              {/* Comentarios */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Comentarios</h2>
                  <span className="text-sm text-muted-foreground">1 comentario</span>
                </div>
                {/* Comentario random */}
                <ComentarioCard />
              </div>
            </div>
            <div>
              <RelatedVideos videoId={params.id} relatedVideos={relatedVideos} />
            </div>
            <div>
              <CourseInfo courseData={courseData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}