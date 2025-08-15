import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { AgendadoForm } from '@/components/form/agendado-instructor-form';
import { useCreateStudent } from '@/hooks/estudiantes/clases-prueba/useCreateStudent';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    onSuccess: () => void
}

const CreateAgendadoDialog = ({ open, setIsOpen,onSuccess }: Props) => {
    const {mutate,loading} = useCreateStudent()
    

    const handleSubmit = async (values:any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await mutate(values);
            
            onSuccess();
            setIsOpen(false)
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    const handleCancel = () => {
        // Lógica para cancelar el formulario
        console.log("Formulario cancelado");
        setIsOpen(false)
    };

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] px-4">
                <DialogHeader>
                    <DialogTitle>Nuevo estudiante clase prueba</DialogTitle>
                </DialogHeader>
                <AgendadoForm
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    IsLoading={loading}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateAgendadoDialog
