import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Video, FileText, CheckSquare, Clock } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteContentDialog } from "@/components/dialog/cursos/contenido/delete-contenido-dialog"
import { useState } from "react"
import { useDeleteContent, useGetContentsByModuleId } from "@/hooks/contenidos"
import { Module } from "@/types"

export function ContentTab({ modules, courseId }: { modules: Module[]; courseId: string }) {
  const { content, loading, error } = useGetContentsByModuleId(courseId) // Hook para obtener los contenidos del curso
  const {remove} = useDeleteContent()
  const groupedModules = modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    order: mod.order,
    content: content.filter((c) => c.moduleId === mod.id)
  }))


  if (loading) {
    return (
      <Content
        courseId={courseId}
      >
        <div className="flex items-center justify-center h-full">
          <p>Cargando...</p>
        </div>
      </Content>
    )
  }
  if (error) {
    return (
      <Content
        courseId={courseId}
      >
        <div className="flex items-center justify-center h-full">
          <p>Error al cargar los contenidos</p>
        </div>
      </Content>
    )
  }
  if (content.length === 0) {
    return (
      <Content
        courseId={courseId}
      >
        <div className="flex items-center justify-center h-full">
          <p>No hay contenidos disponibles para este curso</p>
        </div>
      </Content>
    )
  }


  return (
    <Content
      courseId={courseId}
    >
      <div className="space-y-4">
        {
          groupedModules.slice(0,3).map((module, index) => (
            <div key={module.id} className="space-y-2">
              <h4 className="font-medium">{module.title}</h4>

              {
                module.content.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {content.type === "video" && (
                            <div className="rounded-full bg-red-100 p-2">
                              <Video className="h-4 w-4 text-red-600" />
                            </div>
                          )}
                          {content.type === "document" && (
                            <div className="rounded-full bg-blue-100 p-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          {content.type === "quiz" && (
                            <div className="rounded-full bg-green-100 p-2">
                              <CheckSquare className="h-4 w-4 text-green-600" />
                            </div>
                          )}

                          <div>
                            <p className="font-medium">{content.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {content.type === "video" && content.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {content.duration}
                                </span>
                              )}
                              {content.type === "quiz" && content.questions && (
                                <span>{content.questions} preguntas</span>
                              )}
                              {content.type === "document" && <span>Documento</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center justify-center">
                          {content.type === "video" &&
                            <Button variant="outline" asChild>
                              <Link
                                //TERMINAR ESTO
                                href={`/cursos/${courseId}`}
                              >Ver</Link>
                            </Button>}
                          {content.type === "document" && (
                            <Button variant="outline" asChild>
                              <Link
                                href={`/admin/cursos/${courseId}`}
                                //href={content.url || "#"} 
                                target="_blank">
                                Ver
                              </Link>
                            </Button>

                          )}
                          {content.type === "quiz" &&
                            <Button variant="outline" asChild>
                              <Link
                                //href={`/admin/quizzes/${content.id}`}
                                href={`/admin/cursos/${courseId}`}
                              >Ver</Link>
                            </Button>
                          }
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/admin/cursos/${courseId}/contenido/${module.id}/${content.id}/edit`}
                            //href={`/admin/cursos/${courseId}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteContentDialog
                            contentId={content.id}
                            contentTitle={content.title}
                            moduleId={module.id}
                            courseId={courseId}
                            onDelete={() => {
                              remove(content.id)
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }

            </div>
          ))
        }
      </div>
    </Content>
  )
}

const Content = ({ children, courseId }) => {
  const [filter, setFilter] = useState("all") // Estado para el filtro seleccionado

  return (
    <section id="cursos" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-between">
        <h3 className="text-lg font-medium">Contenido del Curso</h3>
        <div className="flex justify-end gap-2">
          {/* Select para filtrar por tipo */}
          <Select defaultValue="all" onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documentos</SelectItem>
              <SelectItem value="quiz">Evaluaciones</SelectItem>
            </SelectContent>
          </Select>

          <Button size="sm" asChild>
            <Link href={`/admin/cursos/${courseId}/contenido/nuevo`}>
              <span className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Contenido
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {children}
    </section>
  )
}