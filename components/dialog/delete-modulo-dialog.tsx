"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface DeleteModuloDialogProps {
  moduloId: string
  moduloTitle: string
  cursoId: string
  variant?: "outline" | "destructive" | "default"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function DeleteModuloDialog({
  moduloId,
  moduloTitle,
  cursoId,
  variant = "outline",
  size = "default",
  className,
}: DeleteModuloDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Aquí iría la lógica para eliminar el módulo de la base de datos
      console.log("Eliminando módulo:", moduloId)

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la página del curso
      router.push(`/admin/cursos/${cursoId}`)
      router.refresh()
    } catch (error) {
      console.error("Error al eliminar el módulo:", error)
      setIsOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el módulo <strong>"{moduloTitle}"</strong> y todo su contenido
            asociado. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

