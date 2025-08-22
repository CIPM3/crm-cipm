import { getAllCourses } from '@/api/Cursos'
import NewContentClient from './new-content-client'

// Generate static params for admin routes - return empty array to prevent build errors
export async function generateStaticParams() {
  // For admin routes, we don't pre-generate static pages since they require authentication
  // and the data is dynamic. Return empty array to satisfy Next.js static export requirement.
  return []
}

export default function NewContentPage({ params }: { params: { id: string } }) {
  return <NewContentClient params={params} />
}
