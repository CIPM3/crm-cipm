import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, FileText, Award, CheckCircle, X } from "lucide-react"
import { Content, ContentsByModule, Course, Module } from "@/types"

interface PlayerSidebarProps {
  course: Course
  modules: Module[]
  contentsByModule: ContentsByModule
  selectedContent?: Content & { moduleTitle?: string }
  completedContent: string[]
  progressPercentage: number
  totalContent: number
  sidebarOpen: boolean
  onContentSelect: (content: Content, moduleTitle: string) => void
  onToggleSidebar: () => void
  onBack: () => void
}

const getContentIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Play className="h-4 w-4 flex-shrink-0" />
    case "document":
      return <FileText className="h-4 w-4 flex-shrink-0" />
    case "quiz":
      return <Award className="h-4 w-4 flex-shrink-0" />
    default:
      return <FileText className="h-4 w-4 flex-shrink-0" />
  }
}

const getContentDuration = (content: Content) => {
  if (content.type === "video" || content.type === "document") {
    return content.duration
  }
  if (content.type === "quiz") {
    return `${content.questions} preguntas`
  }
  return ""
}

export default function PlayerSidebar({
  course,
  modules,
  contentsByModule,
  selectedContent,
  completedContent,
  progressPercentage,
  totalContent,
  sidebarOpen,
  onContentSelect,
  onToggleSidebar,
  onBack
}: PlayerSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 xl:hidden"
          onClick={onToggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
          fixed xl:static inset-y-0 left-0 pt-16 md:pt-0 z-20 w-72 sm:w-80 xl:w-80 
          border-r bg-background overflow-y-auto order-2 xl:order-1
          transform transition-transform duration-300 ease-in-out xl:transform-none xl:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="flex-shrink-0 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold truncate text-sm sm:text-base">{course.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="xl:hidden flex-shrink-0 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium">Progreso del curso</span>
              <span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedContent.length} de {totalContent} lecciones completadas
            </p>
          </div>
        </div>

        {/* Modules and Content */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-2">
              <h3 className="font-medium text-xs sm:text-sm px-2 py-1 bg-muted/50 rounded">
                Módulo {moduleIndex + 1}: {module.title}
              </h3>
              <div className="space-y-1">
                {(contentsByModule[module.id] || []).map((content) => (
                  <button
                    key={content.id}
                    onClick={() => onContentSelect(content, module.title)}
                    className={`w-full text-left p-2 sm:p-3 rounded-md text-xs sm:text-sm transition-colors group ${
                      selectedContent?.id === content.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/80"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">{getContentIcon(content.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate leading-tight">{content.title}</p>
                        <p className="text-xs opacity-70 mt-0.5">
                          {getContentDuration(content)}
                        </p>
                      </div>
                      {completedContent.includes(content.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}