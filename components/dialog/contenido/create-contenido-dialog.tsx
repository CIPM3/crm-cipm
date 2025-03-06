import { ContenidoForm, ContenidoFormValues } from '@/components/form/contenido-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { allModules } from '../../../types/index';

interface Props {
    isCreateDialogOpen:boolean;
    setIsCreateDialogOpen:Dispatch<SetStateAction<boolean>>
    allModules:allModules[];
    handleCreateContent:(values: ContenidoFormValues) => void
}

const CreateContenidoDialog = ({isCreateDialogOpen,setIsCreateDialogOpen,allModules,handleCreateContent}:Props) => {
    return (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Contenido</DialogTitle>
                </DialogHeader>
                <ContenidoForm
                    modules={allModules}
                    onSubmit={handleCreateContent}
                    onCancel={() => setIsCreateDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateContenidoDialog
