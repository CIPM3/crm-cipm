import { getAllCourses } from '@/api/Cursos'
import CourseContentClient from './course-content-client'

// Generate static params for all courses at build time
export async function generateStaticParams() {
  try {
    const courses = await getAllCourses()
    
    // Return array of params objects for each course
    return courses.map((course) => ({
      id: course.id,
    }))
  } catch (error) {
    console.error('Error generating static params for courses:', error)
    // Return empty array to prevent build failure
    return []
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <CourseContentClient params={params} />
}