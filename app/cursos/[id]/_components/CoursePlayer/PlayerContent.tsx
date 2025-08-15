import { Button } from "@/components/ui/button"
import { Content, Course, UsersType } from "@/types"
import { Play, FileText, Award, Menu, X, Loader2, Undo2, ThumbsUp, Share2, Heart } from "lucide-react"


interface PlayerContentProps {
  course: Course
  selectedContent?: Content & { moduleTitle?: string }
  completedContent: string[]
  user?: UsersType
  updatingEnrollment: boolean
  onToggleCompleted: () => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

const renderContentPlayer = (content: Content & { moduleTitle?: string }, course: Course) => {
  if (content.type === "video") {
    return (
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
        {content.url ? (
          <video
            src={content.url}
            poster={content.thumbnail || course.thumbnail}
            controls
            controlsList="nodownload noremoteplayback"
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a2236] to-[#232b3e]">
            <div className="text-center text-white">
              <img
                src={content.thumbnail || course.thumbnail}
                alt={content.title}
                className="mx-auto mb-4 rounded max-h-60 object-contain"
              />
              <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
              <p className="text-lg font-medium">{content.title}</p>
              <p className="text-sm opacity-70">{content.duration}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (content.type === "document") {
    return (
      <div className="p-8 text-center">
        <FileText className="h-16 w-16 text-white opacity-70 mb-4 mx-auto" />
        <h3 className="text-2xl text-white font-semibold mb-2">{content.title}</h3>
        <p className="text-white/80">Documento de lectura</p>
      </div>
    )
  }

  if (content.type === "quiz") {
    return (
      <div className="p-8 text-center">
        <Award className="h-16 w-16 text-white opacity-70 mb-4 mx-auto" />
        <h3 className="text-2xl text-white font-semibold mb-2">{content.title}</h3>
        <p className="text-white/80">{content.questions} preguntas</p>
      </div>
    )
  }

  return null
}

export default function PlayerContent({
  course,
  selectedContent,
  completedContent,
  user,
  updatingEnrollment,
  onToggleCompleted,
  sidebarOpen,
  onToggleSidebar
}: PlayerContentProps) {
  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        onClick={onToggleSidebar}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {selectedContent ? (
        <>
          {/* Video/Content Player */}
          <div className="bg-gradient-to-b from-[#1a2236] to-[#232b3e] rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[350px]">
            {renderContentPlayer(selectedContent, course)}
          </div>

          {/* Content Info and Actions */}
          <div className="flex mt-6 py-4 flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold">{selectedContent.title}</h3>
              <p className="text-muted-foreground">{selectedContent.moduleTitle}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedContent.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={onToggleCompleted}
                disabled={!user || updatingEnrollment}
                variant={
                  completedContent.includes(selectedContent.id)
                    ? "secondary"
                    : "default"
                }
                className="flex-shrink-0"
              >
                {updatingEnrollment ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : completedContent.includes(selectedContent.id) ? (
                  <>
                    <Undo2 className="h-4 w-4 mr-2" />
                    Deshacer completado
                  </>
                ) : (
                  "Marcar como completado"
                )}
              </Button>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-4 py-4 border-y">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Me gusta
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Selecciona una lección para comenzar</p>
        </div>
      )}
    </>
  )
}