import Link from "next/link"
import { modules, getCourseById } from "@/lib/utils"
import { Play, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import HeaderCliente from "@/components/header/header-cliente"
import FiltersSearch from "@/components/filters/filters-search"
import VideoCard from "@/components/card/video-card";
import Footer from "@/pages/cliente/main/footer";
import InfoAdicional from "../cursos/info-adicional";

export default function VideosPage() {
  // Extraer todos los videos de los módulos
  const allVideos = modules
    .filter((module) => module.status === "Activo")
    .flatMap((module) => {
      const course = getCourseById(module.courseId)
      return module.content
        .filter((content) => content.type === "video")
        .map((video) => ({
          ...video,
          moduleId: module.id,
          moduleTitle: module.title,
          courseId: module.courseId,
          courseName: course?.title || "",
          duration: video.duration || "N/A",
        }))
    })


  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <HeaderCliente />

      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Biblioteca de Videos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra colección de videos educativos sobre gestión de proyectos y desarrollo profesional
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <FiltersSearch
            placeholder="Buscar videos"
            filters={allVideos.map(video => ({ id: video.id, value: video.id, name: video.title }))}
          />



          {/* Lista de videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.map((video, index) => (
              <Link href={`/videos/${video.id}`} key={index} className="h-full">
                <VideoCard
                  key={video.id}
                  delay={index * 0.1}
                  video={video}
                  type="cliente"
                />
              </Link>
            ))}
          </div>

          <div className="bg-muted/50 py-12 md:py-24 mt-12">
            <InfoAdicional />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

