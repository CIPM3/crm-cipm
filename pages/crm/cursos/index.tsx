import Link from "next/link"
import { Button } from "@/components/ui/button"
import { courses } from "@/lib/utils"
import { Plus } from "lucide-react"
import CursoCard from "@/components/card/curso-card"

export default function AdminCoursesPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Cursos</h1>
        <Button asChild>
          <Link href="/admin/cursos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CursoCard key={course.id} curso={course}/>
        ))}
      </div>
    </div>
  )
}

