"use client"

import React from "react"
import Header from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"

// Componentes
import BreadcrumbNav from "./_components/BreadcrumbNav"
import VideoPlayer from "./_components/VideoPlayer"
import RelatedVideos from "./_components/RelatedVideos"
import CourseInfo from "./_components/CourseInfo"
import CommentsSection from "./_components/CommentsSection"
import { VideoDetailSkeleton, NotFoundState } from "./_components/LoadingStates"

// Hook personalizado
import { useVideoDetail } from "./_hooks/useVideoDetail"

interface VideoDetailClientProps {
  params: { id: string }
}

export default function VideoDetailClient({ params }: VideoDetailClientProps) {
  const { videoDetailData, isLoading } = useVideoDetail(params.id)

  // Estados de carga y error
  if (isLoading) {
    return <VideoDetailSkeleton />
  }

  if (!videoDetailData.videoData) {
    return <NotFoundState />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <BreadcrumbNav videoTitle={videoDetailData.videoData.title} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-2">
              <VideoPlayer
                videoData={videoDetailData.videoData}
                courseData={videoDetailData.courseData}
                moduleData={videoDetailData.moduleData}
              />
              
              {/* Videos relacionados para curso (solo si tiene curso) */}
              {videoDetailData.courseData && videoDetailData.moduleData && (
                <RelatedVideos
                  relatedVideos={videoDetailData.relatedVideos}
                  videoId={params.id}
                />
              )}
              
              <CommentsSection 
                videoId={params.id}
                videoTitle={videoDetailData.videoData.title}
              />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Videos relacionados generales (sidebar) */}
              <RelatedVideos
                relatedVideos={[]}
                videoId={params.id}
                isLoading={false}
              />
              
              {/* Información del curso */}
              <CourseInfo courseData={videoDetailData.courseData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}