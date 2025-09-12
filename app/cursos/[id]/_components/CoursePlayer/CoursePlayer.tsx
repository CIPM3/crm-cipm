import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGetEnrollmentsByStudentId, useUpdateEnrollmentByStudentAndCourse } from "@/hooks/enrollments"
import PlayerSidebar from "./PlayerSidebar"
import PlayerContent from "./PlayerContent"
import CommentsSection from "./CommentsSection"
import { PlayerSkeleton } from "../LoadingStates"
import { Button } from "@/components/ui/button"
import { Content, ContentsByModule, Course } from "@/types"
import Module from "module"

interface CoursePlayerProps {
  course: Course
  modules: Module[]
  contentsByModule: ContentsByModule
  onBack: () => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function CoursePlayer({
  course,
  modules,
  contentsByModule,
  onBack,
  sidebarOpen,
  onToggleSidebar
}: CoursePlayerProps) {
  // Estados
  const [completedContent, setCompletedContent] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  // Usuario actual
  const user = useAuthStore(state => state.user)

  // Datos de inscripción
  const { enrollments, loading: loadingEnrollment } = useGetEnrollmentsByStudentId(user?.id || "")
  const courseEnrollment = enrollments?.find(e => e.courseId === course.id)

  // Hook para actualizar inscripción
  const { updateEnrollment, loading: updatingEnrollment } = useUpdateEnrollmentByStudentAndCourse()

  // Calcular contenido total y selección inicial
  const allContents = modules.flatMap(m => contentsByModule[m.id] || [])
  const totalContent = allContents.length

  const firstModule = modules[0]
  const firstContent = (contentsByModule[firstModule?.id] || [])[0]
  const [selectedContent, setSelectedContent] = useState<Content & { moduleTitle?: string }>(firstContent)

  // Calcular progreso
  const progressPercentage = totalContent ? (completedContent.length / totalContent) * 100 : 0

  // Inicializar desde datos de inscripción
  useEffect(() => {
    if (!loadingEnrollment && courseEnrollment && !initialized) {
      setCompletedContent(courseEnrollment.completedContentIds || [])
      setInitialized(true)

      // Seleccionar primer contenido no completado si existe
      if (courseEnrollment.completedContentIds) {
        const firstIncomplete = allContents.find(
          content => !courseEnrollment.completedContentIds.includes(content.id)
        )
        if (firstIncomplete) {
          const module = modules.find(m =>
            contentsByModule[m.id]?.some(c => c.id === firstIncomplete.id)
          )
          setSelectedContent({
            ...firstIncomplete,
            moduleTitle: module?.title || ""
          })
        }
      }
    }
  }, [loadingEnrollment, courseEnrollment, initialized, allContents, modules, contentsByModule])

  const handleContentSelect = (content: Content, moduleTitle: string) => {
    setSelectedContent({ ...content, moduleTitle })
  }

  const handleToggleCompleted = async () => {
    if (!selectedContent || !user?.id) return

    try {
      let newCompleted: string[]
      let newProgress: number
      let action: 'completed' | 'uncompleted'

      if (completedContent.includes(selectedContent.id)) {
        // Deshacer completado
        newCompleted = completedContent.filter(id => id !== selectedContent.id)
        action = 'uncompleted'
      } else {
        // Marcar como completado
        newCompleted = [...completedContent, selectedContent.id]
        action = 'completed'
      }

      newProgress = Math.round((newCompleted.length / totalContent) * 100)
      setCompletedContent(newCompleted)

      await updateEnrollment(user.id, course.id, {
        progress: newProgress,
        completedContentIds: newCompleted,
        lastAccessed: new Date().toISOString(),
        ...(action === 'completed' && {
          lastContentCompleted: selectedContent.id
        }),
      })

      // Auto-avanzar al siguiente contenido cuando se marca como completado
      if (action === 'completed' && newCompleted.length < totalContent) {
        const currentIndex = allContents.findIndex(c => c.id === selectedContent.id)
        if (currentIndex < allContents.length - 1) {
          const nextContent = allContents[currentIndex + 1]
          const module = modules.find(m =>
            contentsByModule[m.id]?.some(c => c.id === nextContent.id)
          )
          setSelectedContent({
            ...nextContent,
            moduleTitle: module?.title || ""
          })
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error)
      setCompletedContent(completedContent)
    }
  }

  if (loadingEnrollment || !initialized) {
    return <PlayerSkeleton />
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-8 relative min-h-[calc(100vh-8rem)]">
      <PlayerSidebar
        course={course}
        modules={modules}
        contentsByModule={contentsByModule}
        selectedContent={selectedContent}
        completedContent={completedContent}
        progressPercentage={progressPercentage}
        totalContent={totalContent}
        sidebarOpen={sidebarOpen}
        onContentSelect={handleContentSelect}
        onToggleSidebar={onToggleSidebar}
        onBack={onBack}
      />

      <div className="flex-1 min-w-0 order-1 xl:order-2">
        <PlayerContent
          course={course}
          selectedContent={selectedContent}
          completedContent={completedContent}
          user={user!!}
          updatingEnrollment={updatingEnrollment}
          onToggleCompleted={handleToggleCompleted}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={onToggleSidebar}
        />
        
        {/* Comments Section with Error Boundary */}
        {course?.id ? (
          <CommentsSection 
            courseId={course.id} 
            contentId={selectedContent?.id}
            contentTitle={selectedContent?.title}
          />
        ) : (
          <div className="mt-8 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Comentarios</h3>
            <p className="text-sm text-gray-500">Cargando curso...</p>
          </div>
        )}
      </div>
    </div>
  )
}