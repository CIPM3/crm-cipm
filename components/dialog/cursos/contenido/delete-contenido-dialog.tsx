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
import { useDeleteContent } from "@/hooks/contenidos"

interface DeleteContentDialogProps {
  contentId: string
  contentTitle: string
  moduleId: string
  courseId: string
  variant?: "outline" | "destructive" | "default" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onDelete?: () => void
}

export function DeleteContentDialog({
  contentId,
  contentTitle,
  moduleId,
  courseId,
  variant = "outline",
  size = "default",
  className,
  onDelete,
}: DeleteContentDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {remove} = useDeleteContent()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Aquí iría la lógica para eliminar el contenido de la base de datos
      await remove(contentId)

      // Llamar al callback si existe
      if (onDelete) {
        onDelete()
      } else {
        // Redirigir a la página del curso
        router.push(`/admin/cursos/${courseId}?tab=content`)
        router.refresh()
      }
    } catch (error) {
      console.error("Error al eliminar el contenido:", error)
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el contenido <strong>"{contentTitle}"</strong>. Esta acción no se
            puede deshacer.
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
