"use client"
import React, { useMemo, useState } from "react"
import HeaderCliente from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"
import { useFetchCourses, useGetCourseById } from "@/hooks/cursos"
import { useGetModulesByCourseId } from "@/hooks/modulos"
import { useGetContentsByModuleId } from "@/hooks/contenidos"
import { useGetEnrollmentsByCourseId, useGetEnrollmentsByStudentId } from "@/hooks/enrollments"
import { useAuthStore } from "@/store/useAuthStore"

// Componentes
import BreadcrumbNav from "./_components/BreadcrumbNav"
import CourseHeader from "./_components/CourseHeader"
import CourseTabsSection from "./_components/CourseTabsSection"
import RelatedCourses from "./_components/RelatedCourses"
import CoursePlayer from "./_components/CoursePlayer"
import { CourseDetailSkeleton, ErrorState } from "./_components/LoadingStates"
import { ContentsByModule } from "@/types"

// Types

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  // Hooks
  const { course, loading, error } = useGetCourseById(params.id)
  const { courses, loading: loadingCourses, error: errorCourses } = useFetchCourses()
  const { modules, loading: loadingModules, error: errorModules } = useGetModulesByCourseId(params.id)
  const { content, loading: loadingContent, error: errorContent } = useGetContentsByModuleId(params.id)
  const { enrollments: courseEnrollments, loading: loadingEnrollments } = useGetEnrollmentsByCourseId(params.id)
  const { user } = useAuthStore()
  
  // User enrollments
  const userId = user?.id ?? ""
  const { enrollments: userEnrollments = [] } = useGetEnrollmentsByStudentId(userId)

  // Estados locales
  const [showPlayer, setShowPlayer] = useState(false)

  // Memoized values
  const contentsByModule: ContentsByModule = useMemo(() => {
    return modules.reduce((acc, module) => {
      acc[module.id] = content.filter((c) => c.moduleId === module.id)
      return acc
    }, {} as ContentsByModule)
  }, [modules, content])

  const isBuyed = useMemo(
    () => userEnrollments.some((enrollment) => enrollment.courseId === course?.id),
    [userEnrollments, course?.id]
  )

  // Loading state
  const isLoading = loading || loadingCourses || loadingModules || loadingContent || loadingEnrollments
  
  // Error state
  const hasError = error || errorCourses || errorModules || errorContent

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (hasError) {
    return <ErrorState />
  }

  if (!course) {
    return <ErrorState message="El curso no existe o ha sido eliminado." />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <BreadcrumbNav title={course.title} />
          
          {!showPlayer ? (
            <>
              <CourseHeader
                course={course}
                modules={modules}
                content={content}
                enrollments={courseEnrollments}
                isBuyed={isBuyed}
                onShowPlayer={() => setShowPlayer(true)}
              />
              
              <CourseTabsSection
                modules={modules}
                course={course}
                contentsByModule={contentsByModule}
              />
              
              <RelatedCourses courses={courses} course={course} />
            </>
          ) : (
            <CoursePlayer
              course={course}
              modules={modules}
              contentsByModule={contentsByModule}
              onBack={() => setShowPlayer(false)}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}