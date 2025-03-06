import { ContenidoForm, ContenidoFormValues } from '@/components/form/contenido-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { allModules } from '@/types';
import React, { Dispatch, SetStateAction } from 'react'

interface Props{
    open:boolean;
    onOpenChange:Dispatch<SetStateAction<boolean>>;
    allModules:allModules[];
    handleUpdateContent: (values: ContenidoFormValues) => void;
    setIsEditDialogOpen: (value: SetStateAction<boolean>) => void;
    selectedContent:any
}

const EditContenidoDialog = ({open,onOpenChange,allModules,handleUpdateContent,setIsEditDialogOpen,selectedContent}:Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Contenido</DialogTitle>
                </DialogHeader>
                {selectedContent && (
                    <ContenidoForm
                        modules={allModules}
                        initialValues={{
                            title: selectedContent.title,
                            type: selectedContent.type,
                            moduleId: selectedContent.moduleId,
                            url: selectedContent.url || "",
                            duration: selectedContent.duration || "",
                            questions: selectedContent.questions ? String(selectedContent.questions) : "",
                        }}
                        onSubmit={handleUpdateContent}
                        onCancel={() => setIsEditDialogOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EditContenidoDialog
