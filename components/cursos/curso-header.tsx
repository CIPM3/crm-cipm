import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save } from "lucide-react"
import { DeleteCursoDialog } from "@/components/dialog/delete-curso-dialog"
import Link from "next/link"

export function CursoHeader({
  course,
  isEditing,
  setIsEditing,
  handleSave,
  router,
}: {
  course: any
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  handleSave: () => void
  router: any
}) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Fila superior: Botón de volver y botones de acción */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Botón de volver */}
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/cursos")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href={`/admin/cursos/${course.id}/edit`}>
                  <span className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </span>
                </Link>
              </Button>
              <DeleteCursoDialog cursoId={course.id} cursoTitle={course.title} variant="outline" />
            </>
          )}
        </div>
      </div>

      {/* Título y descripción */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Curso" : course.title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {isEditing ? "Modifica la información del curso" : "Visualiza y gestiona el contenido del curso"}
        </p>
      </div>
    </div>
  )
}