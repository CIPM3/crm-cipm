import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { AgendadoForm } from '@/components/form/agendado-instructor-form';
import { AgendadoFormValues } from '@/types';
import { useUpdateStudent } from '@/hooks/estudiantes/clases-prueba/useUpdateStudent';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    estudiante: AgendadoFormValues,
    onSuccess: () => void
}

const UpdateAgendadoDialog = ({ open, setIsOpen, estudiante, onSuccess }: Props) => {
    const {update,loading} = useUpdateStudent();

    const handleSubmit = async (values: any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await update( values.id, values);
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
                    initialValues={estudiante}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    IsLoading={loading}
                />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAgendadoDialog
