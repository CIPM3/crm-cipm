import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare } from "lucide-react"

export default function TasksTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <h3 className="text-lg font-medium">Tareas Relacionadas</h3>
        <Button size="sm">
          <CheckSquare className="mr-2 h-4 w-4" />
          Asignar Nueva Tarea
        </Button>
      </div>
      <Card>
        <CardContent className="p-6 flex items-center flex-col text-center">
          <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No hay tareas asignadas</p>
          <p className="text-sm text-muted-foreground">
            Este estudiante no tiene tareas asignadas actualmente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
