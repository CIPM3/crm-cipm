"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import EnrollStudentDialog from "../dialog/estudiante/EnrollStudentDialog"
import { useState } from "react"
import { useGetUsuarioById } from "@/hooks/usuarios/useGetUsuariosById"
import { useDeleteEnrollment } from "@/hooks/enrollments"
import { useEnrollmentsStore } from "@/store/useEnrollmentStore"

export function StudentsTab({ enrollments }: { enrollments: any[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-between">
        <h3 className="text-lg font-medium">Estudiantes Inscritos</h3>
        <Button onClick={() => setOpen(true)} size="sm" className="max-w-fit  ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Inscribir Estudiante
        </Button>
      </div>

      <EnrollStudentDialog
        open={open}
        onOpenChange={setOpen}
      />

      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
        ))}
      </div>
    </div>
  )
}

const EnrollmentCard = ({ enrollment }: { enrollment: any }) => {
  const { remove, loading } = useDeleteEnrollment()
  const { usuario } = useGetUsuarioById(enrollment.studentId)
  const { setCanRefetch } = useEnrollmentsStore()
  const handleRemove = async () => {
    try {
      await remove(enrollment.id)
      setCanRefetch(true)
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error)
    }
  }

  return (
    <Card key={enrollment.id}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">Estudiante: {usuario?.name}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
              <span>Inscrito: {enrollment.enrollmentDate}</span>
              <span>Último acceso: {enrollment.lastAccess}</span>
            </div>
          </div>

          <div className="my-2 flex flex-col lg:flex-row gap-4">
            <div className="w-full sm:w-auto">
              <Badge variant={enrollment.status === "Completado" ? "default" : "secondary"}>
                {enrollment.status}
              </Badge>
              <div className="mt-1 w-full sm:w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex">
              <Button variant="ghost" asChild className="w-full sm:w-auto">
                <Link
                  href={`/admin/estudiantes/${enrollment.studentId}`}
                >
                  <span className="flex items-center">Ver Estudiante</span>
                </Link>
              </Button>
              <Button variant="ghost" disabled={loading} asChild className="w-full sm:w-auto">
                <span onClick={handleRemove} className="cursor-pointer flex items-center">
                  {
                    loading
                      ? <span className="flex items-center gap-2 text-red-500"><Loader2 className="size-4 animate-spin" /> Eliminado</span>
                      : <Trash2 className="size-5 text-red-500" />
                  }
                </span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}