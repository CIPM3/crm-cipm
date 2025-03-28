import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { AgendadorFormValues } from '@/types';
import { useUpdateStudent } from '@/hooks/estudiantes/clases-prueba/useUpdateStudent';
import { useDeleteStudent } from '@/hooks/estudiantes/clases-prueba/useDeleteStudent';
import { useDeleteUsuario } from '@/hooks/agendador/useDeleteAgendado';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    estudiante: AgendadorFormValues,
    onSuccess: () => void
}

const DeleteAgendadoDialog = ({ open, setIsOpen, estudiante, onSuccess }: Props) => {
    const {remove,loading} = useDeleteUsuario();

    const handleSubmit = async (values: any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await remove(values.id);
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
                    <DialogTitle>Estas seguro?</DialogTitle>
                </DialogHeader>
                <p>Los cambios son irreversibles</p>

                <div className='flex items-center justify-end gap-3'>
                    <button onClick={handleCancel} className='px-4 py-2 border-input border rounded-lg text-gray-500 hover:bg-gray-500 hover:text-white transition-colors'>Cancelar</button>
                    <button className='px-4 py-2 border-input border rounded-lg text-gray-500 hover:bg-red-500 hover:text-white transition-colors' onClick={()=> handleSubmit(estudiante)}>
                        {loading ? 'Eliminando...' : (<>Eliminar a: {estudiante.nombreAlumno}</>)}
                        
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAgendadoDialog
