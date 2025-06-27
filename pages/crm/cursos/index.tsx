"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CursoCard from "@/components/card/curso-card"
import { useFetchCourses } from "@/hooks/cursos"
import CursoCardSkeleton from "@/components/card/curso-skeleton-card"

export default function AdminCoursesPage() {
  const { courses, loading, error } = useFetchCourses()

  if (loading) return (
    <div className="flex flex-col h-[86dvh]">
      <Header isLoading={loading} isError={!!error} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          Array.from({ length: 2 }, (_, index) => (
            <CursoCardSkeleton key={index} />
          ))
        }
        <CursoCardSkeleton/>
      </div>
    </div>
  )
  if (error) return (
    <div className="flex flex-col h-[86dvh]">
      <Header isLoading={loading} isError={!!error} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <p>Error al cargar los cursos</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[86dvh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Cursos</h1>
        <Button asChild>
          <Link href="/admin/cursos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course,idx) => (
          <CursoCard delay={idx * 0.15} key={course.id} curso={course} type="crm" />
        ))}
      </div>
    </div>
  )
}


interface HeaderProps {
  isLoading: boolean
  isError: boolean
}
const Header = ({ isError, isLoading }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold tracking-tight">Gestión de Cursos</h1>
      {
        !isError || !isLoading && (
          <Button asChild>
            <Link href="/admin/cursos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
            </Link>
          </Button>
        )
      }

    </div>
  )
}

