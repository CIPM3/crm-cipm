"use client"

import { getEnrollmentsByStudentId } from "@/lib/utils"
import StudentHeader from "@/components/estudiante/StudentHeader"
import StudentInfoCard from "@/components/estudiante/StudentInfoCard"
import StudentMetricsCard from "@/components/estudiante/StudentMetricsCard"
import StudentTabs from "@/components/estudiante/StudentTabs"
//API
import { Skeleton } from "@/components/ui/skeleton"
import { useGetClienteById } from "@/hooks/estudiantes/clientes"
import { useGetEnrollmentsByStudentId } from "@/hooks/enrollments"

export default function StudentPage({ params }: { params: { id: string } }) {
  const { cliente: student, loading, error } = useGetClienteById(params.id)
  const { enrollments } = useGetEnrollmentsByStudentId(params.id)

  console.log(enrollments)

  if (loading) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-[86dvh]">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <Skeleton className="h-[50dvh] w-full col-span-1" />
          <Skeleton className="h-[50dvh] w-full col-span-3" />
        </div>
        <Skeleton className="h-[50dvh] w-full" />
      </div>
    )
  }
  if (error || !student) {
    return (
      <div className="flex items-center justify-center h-[86dvh]">
        <p>Error al cargar el estudiante. Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StudentHeader student={student} />
      <div className="grid gap-6 md:grid-cols-3">
        <StudentInfoCard student={student} />
        <StudentMetricsCard student={student} enrollments={enrollments} />
      </div>
      <StudentTabs student={student} initialEnrollments={enrollments} />
    </div>
  )
}
