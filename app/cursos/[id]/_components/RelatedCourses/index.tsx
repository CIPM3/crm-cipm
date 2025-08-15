import Link from "next/link"
import CursoCard from "@/components/card/curso-card"
import { Course } from "@/types"

interface RelatedCoursesProps {
  courses: Course[]
  course: Course
}

export default function RelatedCourses({ courses, course }: RelatedCoursesProps) {
  // Filtrar cursos relacionados (excluir el curso actual y solo mostrar activos)
  const relatedCourses = courses
    .filter((c) => c.id !== course.id && c.status === "Activo")
    .slice(0, 3)

  // No mostrar la sección si no hay cursos relacionados
  if (relatedCourses.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Cursos relacionados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCourses.map((relatedCourse) => (
          <Link 
            href={`/cursos/${relatedCourse.id}`} 
            key={relatedCourse.id}
            className="block transition-transform hover:scale-105"
          >
            <CursoCard curso={relatedCourse} type="cliente" />
          </Link>
        ))}
      </div>
    </section>
  )
}