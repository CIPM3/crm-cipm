"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import EditStudentDialog from "@/components/dialog/estudiante/EditStudentDialog"
import DeleteStudentDialog from "@/components//dialog/estudiante/DeleteStudentDialog"
import { useDeleteCliente } from "@/hooks/estudiantes/clientes"

export default function StudentHeader({ student }: { student: any }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { remove } = useDeleteCliente()

  let StudentData = {
    ...student,
    status: student.status || "Activo",
    phone: student.phone || "No disponible",
    createdAt: student.createdAt || new Date().toISOString(),
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/estudiantes">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Atrás</span>
          </Link>
        </Button>
        <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{StudentData.name}</h1>
              <Badge variant={StudentData.status === "Activo" ? "default" : "secondary"}>{StudentData.status ? "Activo" : "Inactivo"}</Badge>
            </div>
            <p className="text-muted-foreground">Detalles del estudiante e información relacionada</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Estudiante
            </Button>
          </div>
        </div>

      </div>

      {/* OPC BUTTONS */}
      <EditStudentDialog student={StudentData} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <DeleteStudentDialog
        student={StudentData}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={async () => {
          setIsDeleteDialogOpen(false)
          await remove(StudentData.id)
        }}
      />
    </>
  )
}
