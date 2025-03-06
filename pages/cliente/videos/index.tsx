import Link from "next/link"
import { modules, getCourseById } from "@/lib/utils"
import { Play, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import HeaderCliente from "@/components/header/header-cliente"
import FiltersSearch from "@/components/filters/filters-search"
import VideoCard from "@/components/card/video-card";
import Footer from "@/pages/cliente/main/footer";

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
                  video={video}
                  type="cliente"
                />
              </Link>
            ))}
          </div>

          {/* Sección de información adicional */}
          <div className="mt-16 bg-muted/50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Aprende a tu ritmo</h2>
              <p className="text-muted-foreground">Accede a contenido educativo de calidad cuando lo necesites</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Videos Explicativos</h3>
                <p className="text-muted-foreground">
                  Explicaciones claras y concisas de conceptos clave por expertos en la materia.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Disponible 24/7</h3>
                <p className="text-muted-foreground">
                  Accede a los videos en cualquier momento y desde cualquier dispositivo.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Badge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Contenido Actualizado</h3>
                <p className="text-muted-foreground">
                  Nuestros videos se actualizan regularmente para reflejar las últimas tendencias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

