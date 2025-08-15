import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, X, Play, FileText, Award, CheckCircle } from "lucide-react"
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
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 border-r bg-background overflow-y-auto
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold truncate">{course.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={onToggleSidebar}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progreso del curso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedContent.length} de {totalContent} lecciones completadas
          </p>
        </div>
      </div>

      {/* Modules and Content */}
      <div className="p-4 space-y-4">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="space-y-2">
            <h3 className="font-medium text-sm">
              Módulo {moduleIndex + 1}: {module.title}
            </h3>
            <div className="space-y-1">
              {(contentsByModule[module.id] || []).map((content) => (
                <button
                  key={content.id}
                  onClick={() => onContentSelect(content, module.title)}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                    selectedContent?.id === content.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getContentIcon(content.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{content.title}</p>
                      <p className="text-xs opacity-70">
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
  )
}