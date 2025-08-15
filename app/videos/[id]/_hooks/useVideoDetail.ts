import { useMemo } from "react"
import { modules, getCourseById } from "@/lib/utils"
import { useGetContentById } from "@/hooks/contenidos"
import { useGetVideoById } from "@/hooks/videos"
import { VideoDetailData } from "@/types"

export function useVideoDetail(videoId: string) {
  // Hooks para obtener datos
  const { content: contentData, loading: loadingContent } = useGetContentById(videoId)
  const { video: videoIndependiente, loading: loadingVideo } = useGetVideoById(videoId)

  const isLoading = loadingContent || loadingVideo

  // Procesar datos
  const videoDetailData: VideoDetailData = useMemo(() => {
    let videoData = null
    let moduleData = null
    let courseData = null
    let relatedVideos: any[] = []

    if (contentData) {
      videoData = contentData
      
      // Buscar módulo y curso
      for (const module of modules) {
        if (module.status !== "Activo") continue
        if (module.content.find((c) => c.id === videoId)) {
          moduleData = module
          courseData = getCourseById(module.courseId)
          break
        }
      }

      // Videos relacionados del mismo curso
      if (courseData && moduleData) {
        relatedVideos = modules
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
      }
    } else if (videoIndependiente) {
      videoData = videoIndependiente
    }

    return {
      videoData,
      moduleData,
      courseData,
      relatedVideos
    }
  }, [contentData, videoIndependiente, videoId])

  return {
    videoDetailData,
    isLoading
  }
}