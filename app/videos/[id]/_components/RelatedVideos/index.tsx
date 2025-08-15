import Link from "next/link"
import { useFetchVideos } from "@/hooks/videos"
import VideoCard from "./VideoCard"
import { RelatedVideosProps } from "@/types"

export default function RelatedVideos({ 
  relatedVideos: initialRelatedVideos, 
  videoId, 
  isLoading: externalLoading = false 
}: RelatedVideosProps) {
  const { videos, loading, error } = useFetchVideos()

  // Determinar si mostrar videos relacionados específicos o generales
  let displayVideos = initialRelatedVideos
  let isLoading = externalLoading

  // Si no hay videos relacionados específicos, usar videos generales
  if (!initialRelatedVideos || initialRelatedVideos.length === 0) {
    isLoading = loading
    if (videoId && videos.length > 0) {
      displayVideos = videos.filter(video => video.id !== videoId).slice(0, 4)
    } else {
      displayVideos = videos.slice(0, 4)
    }
  }

  if (error) {
    return (
      <div className="w-full h-fit pb-1 shadow-md shadow-black/10 px-4 rounded-lg">
        <h3 className="font-bold text-lg mb-4">Videos relacionados</h3>
        <div className="flex justify-center items-center text-gray-400 font-semibold">
          Error al cargar videos relacionados.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-fit pb-1 shadow-md shadow-black/10 px-4 rounded-lg">
      <h3 className="font-bold text-lg mb-4">Videos relacionados</h3>
      
      <div className="space-y-4 mb-8 grid">
        {/* Loading skeleton */}
        {isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-3 group">
                <div className="relative size-28 h-20 flex-shrink-0">
                  <div className="animate-pulse w-full h-full object-cover rounded-md bg-muted" />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="animate-pulse bg-muted w-full h-3 rounded-md" />
                  <div className="animate-pulse bg-muted w-1/3 h-3 rounded-md" />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Videos list */}
        {!isLoading && displayVideos.length > 0 && displayVideos.map((video, index) => (
          <VideoCard 
            key={video.id || index} 
            video={video} 
          />
        ))}

        {/* No videos message */}
        {!isLoading && displayVideos.length === 0 && (
          <div className="text-muted-foreground">No hay videos relacionados.</div>
        )}

        {/* Ver más link */}
        {!isLoading && displayVideos.length >= 4 && (
          <Link href="/videos">
            <div className="text-center text-primary hover:underline mt-4">
              Ver más videos
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}