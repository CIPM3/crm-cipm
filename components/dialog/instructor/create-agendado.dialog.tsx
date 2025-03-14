import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { getQueryClient } from '@/components/provider/get-query-client';
import { getAllStudents } from '@/api/Estudiantes/clase-prueba/get';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AgendadoForm } from '@/components/form/agendado-instructor-form';
import { useCreateStudent } from '@/hooks/estudiantes/clases-prueba/useCreateStudent';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    onSuccess: () => void
}

const CreateAgendadoDialog = ({ open, setIsOpen,onSuccess }: Props) => {
    const createStudentMutation = useCreateStudent()
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery({
        queryKey: ['getAllStudents'],
        queryFn: getAllStudents
    })
    const { refetch } = useSuspenseQuery({
        queryKey: ['getAllStudents'],
        queryFn: getAllStudents
    });

    const handleSubmit = async (values:any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await createStudentMutation.mutateAsync(values);
            refetch()
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
                    IsLoading={createStudentMutation.isPending}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateAgendadoDialog
