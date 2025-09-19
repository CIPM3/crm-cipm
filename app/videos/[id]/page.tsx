import VideoDetailClient from './video-detail-client'

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  return <VideoDetailClient params={params} />
}