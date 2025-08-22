import { getAllVideos } from '@/api/videos'
import VideoDetailClient from './video-detail-client'

// Generate static params for all videos at build time
export async function generateStaticParams() {
  try {
    const videos = await getAllVideos()
    
    // Return array of params objects for each video
    return videos.map((video) => ({
      id: video.id,
    }))
  } catch (error) {
    console.error('Error generating static params for videos:', error)
    // Return empty array to prevent build failure
    return []
  }
}

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  return <VideoDetailClient params={params} />
}