"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { getCourseById, getModulesByCourseId, getEnrollmentsByCourseId } from "@/lib/utils"
import { CursoHeader } from "@/components/cursos/curso-header"
import { CursoInfo } from "@/components/cursos/curso-info"
import { CursoTabs } from "@/components/cursos/curso-tabs"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get("tab")

  const course = getCourseById(params.id)

  if (!course) {
    notFound()
  }

  const modules = getModulesByCourseId(course.id)
  const enrollments = getEnrollmentsByCourseId(course.id)

  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    price: course.price.toString(),
    duration: course.duration,
    status: course.status,
  })

  // Establecer la pestaña activa basada en el parámetro de URL
  useEffect(() => {
    if (tabParam && ["overview", "modules", "content", "students"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "Activo" : "Inactivo" }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    // En una implementación real, esto actualizaría la base de datos
    setIsEditing(false)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Actualizar la URL para reflejar la pestaña activa
    router.push(`/admin/cursos/${params.id}?tab=${value}`)
  }

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
