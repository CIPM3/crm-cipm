import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteFormacion } from '@/hooks/formacion/useDeleteAgendado';
import { FormacionDataType } from '@/types';
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    onSuccess: () => void,
    selected: FormacionDataType
}

const DeleteStudentDialog = ({ open, setIsOpen, onSuccess, selected }: Props) => {
    const { mutate, loading } = useDeleteFormacion();

    const handleSubmit = async (values: any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await mutate(values.id);
            onSuccess();
            setIsOpen(false)
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    const handleCancel = () => {
        // Lógica para cancelar el formulario
        setIsOpen(false)
    };
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] px-4">
                <DialogHeader>
                    <DialogTitle>Eliminar</DialogTitle>
                </DialogHeader>
                <div>
                    <p>Estas seguro de eliminar al estudiante?: {selected?.nombre}</p>
                    <p className='font-bold'>Datos del estudiante:</p>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-x-1 mt-1'>
                        <p className='col-span-1'>Horario: <span className='font-bold text-sm'>{selected?.horario}</span></p>
                        <p className='col-span-1'>Codigo: <span className='font-bold text-sm'>{selected?.week}</span></p>
                        <p className='col-span-1'>Modalidad: <span className='font-bold text-sm'>{selected?.modalidad}</span></p>
                        <p className='col-span-1'>Nivel: <span className='font-bold text-sm'>{selected?.nivel}</span></p>
                    </div>
                </div>

                <div className='flex justify-end items-end gap-2'>
                    <button onClick={handleCancel} className='px-4 py-2 border-input border rounded-lg text-gray-500 hover:bg-gray-500 hover:text-white transition-colors'>Cancelar</button>
                    <button className='px-4 py-2 border-input border rounded-lg text-gray-500 hover:bg-red-500 hover:text-white transition-colors' onClick={() => handleSubmit(selected)}>
                        {loading ? 'Eliminando...' : (<>Eliminar a: {selected?.nombre}</>)}

                    </button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default DeleteStudentDialog
