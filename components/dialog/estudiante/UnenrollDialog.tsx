import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

export default function UnenrollDialog({
  open,
  onOpenChange,
  courseTitle,
  onConfirm,
  loading = false,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  courseTitle: string
  onConfirm: () => void,
  loading?: boolean
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Dar de baja del curso?</AlertDialogTitle>
          <AlertDialogDescription>
            Se dará de baja al estudiante del curso <strong>{courseTitle}</strong> y se perderá el progreso asociado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={onConfirm} className="bg-destructive text-destructive-foreground">
            {
              loading ? <div className="flex items-center gap-2"><Loader2 className="size-5 animate-spin"/><p>Dando de baja..</p></div> : "Dar de Baja"
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
