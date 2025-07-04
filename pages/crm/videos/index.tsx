"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ban, Plus, ShieldAlert } from "lucide-react"
import VideoCard from "@/components/card/video-card.lonely"
import { useFetchVideos } from "@/hooks/videos"
import CursoCardSkeleton from "@/components/card/curso-skeleton-card"

export default function AdminVideosPage() {

  const { videos: allVideos, loading, error } = useFetchVideos()

  return (
    <>
      {loading && (
        <Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              Array.from({ length: 2 }, (_, index) => (
                <CursoCardSkeleton key={index} />
              ))
            }
          </div>
        </Content>
      )}

      {
        error && (
          <Content>
            <div className="flex flex-col w-full h-full gap-2 items-center justify-center">

              <Ban className="size-14 text-gray-400" />
              Error al cargar los videos
            </div>
          </Content>
        )
      }

      {
        allVideos.length == 0 && (
          <Content>
            <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
             <ShieldAlert className="size-14 text-gray-400" />
              <h2>No existen videos aun. Puedes crear uno aqui</h2>
              <Button asChild>
                <Link href="/admin/videos/nuevo">
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Video
                </Link>
              </Button>
            </div>
          </Content>
        )
      }

      {allVideos.length >= 1 && (
        <Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                type="crm"
                video={video}
                delay={index * 0.3}
              />
            ))}
          </div>
        </Content>
      )}


    </>
  )
}


const Content = ({ children }) => {
  return (
    <div className="flex flex-col h-[87dvh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Videos</h1>
        <Button asChild>
          <Link href="/admin/videos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Video
          </Link>
        </Button>
      </div>
      {children}
    </div>
  )
}
