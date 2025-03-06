import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    open:boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    selectedContent:any;
    handleDeleteContent: () => void
}

const DeleteContenidoDialog = ({handleDeleteContent,onOpenChange,open,selectedContent}:Props) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el contenido
                        <span className="font-semibold"> {selectedContent?.title}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteContent} className="bg-destructive text-destructive-foreground">
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteContenidoDialog
