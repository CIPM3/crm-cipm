import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"
import Link from "next/link"
import { DeleteModuloDialog } from "@/components/dialog/delete-modulo-dialog"
import { useGetContentsByModuleId } from "@/hooks/contenidos"

export function ModulesTab({ modules, params, router }: { modules: any[]; params: { id: string }; router: any }) {
  
  const courseId = params.id // ID del curso desde los parámetros
  const { content } = useGetContentsByModuleId(courseId) // Hook para obtener los contenidos del curso
  const groupedModules = modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    order: mod.order,
    content: content.filter((c) => c.moduleId === mod.id)
  }))

  const modulesSorted = modules.sort((a, b) => a.order - b.order)
  const modulesActive = modulesSorted.filter((module) => module.status === "Activo")
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Módulos del Curso</h3>
        <Button size="sm" asChild>
          <Link
            href={`/admin/cursos/${params.id}/modulos/nuevo`}
          >
            <span className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Módulo
            </span>
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {modulesActive.map((module) => (
          <Card key={module.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">{module.title}</CardTitle>
                <Badge variant={module.status === "Activo" ? "default" : "secondary"}>{module.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <p>Orden: {module.order}</p>
                  <p>Contenidos: {groupedModules.find(content=>content.id === module.id)?.content.length}</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" asChild>
                    <Link
                      href={`/admin/cursos/${params.id}/modulos/${module.id}/edit`}
                    >
                      <span className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </span>
                    </Link>
                  </Button>
                  <DeleteModuloDialog
                    moduloId={module.id}
                    moduloTitle={module.title}
                    cursoId={params.id}
                    variant="outline"
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}