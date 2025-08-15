
import { VideoPlayerProps } from "@/types"
import VideoInfo from "./VideoInfo"
import VideoDescription from "./VideoDescription"

export default function VideoPlayer({ videoData, courseData, moduleData }: VideoPlayerProps) {
  return (
    <>
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

      <VideoInfo 
        videoData={videoData} 
        courseData={courseData} 
        moduleData={moduleData} 
      />
      
      <VideoDescription 
        courseData={courseData} 
        moduleData={moduleData} 
      />
    </>
  )
}
