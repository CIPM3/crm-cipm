import CourseDetailClient from './course-detail-client'

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return <CourseDetailClient params={params} />
}