"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getModulesByCourseId, getEnrollmentsByCourseId } from "@/lib/utils"
import { CursoHeader } from "@/components/cursos/curso-header"
import { CursoInfo } from "@/components/cursos/curso-info"
import { CursoTabs } from "@/components/cursos/curso-tabs"
import { useGetCourseById } from "@/hooks/cursos"
import { useGetModulesByCourseId } from "@/hooks/modulos"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get("tab")

  const { course, loading, error } = useGetCourseById(params.id)
  const { modules } = useGetModulesByCourseId(params.id)

  // Hooks de estado
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    status: "",
  })

  // Establecer la pestaña activa basada en el parámetro de URL
  useEffect(() => {
    if (tabParam && ["overview", "modules", "content", "students"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // Actualizar formData cuando el curso esté disponible
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price?.toString() || "",
        duration: course.duration || "",
        status: course.status || "",
      })
    }
  }, [course])

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    setIsEditing(false)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Actualizar la URL para reflejar la pestaña activa
    router.push(`/admin/cursos/${params.id}?tab=${value}`)
  }

  // Renderizar contenido basado en el estado
  if (loading) {
    return <div className="text-center py-10">Cargando curso...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error al cargar el curso: {error.message}</div>
  }

  if (!course) {
    return <div className="text-center py-10 text-gray-500">El curso no existe o no está disponible.</div>
  }
  // Obtener módulos y estudiantes solo si el curso existe
  const enrollments = getEnrollmentsByCourseId(course.id)

  return (
    <div className="space-y-6">
      <CursoHeader
        course={course}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        router={router}
      />

      <CursoInfo
        course={course}
        modules={modules}
        enrollments={enrollments}
      />

      <CursoTabs
        activeTab={activeTab}
        course={course}
        modules={modules}
        enrollments={enrollments}
        handleTabChange={handleTabChange}
      />
    </div>
  )
}