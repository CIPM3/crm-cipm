import { FormacionForm } from '@/components/form/agendado-formacion-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateUsuariosFormacion } from '@/hooks/formacion/useUpdateStudentFormacion';
import { FormacionDataType } from '@/types';
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    onSuccess: () => void;
    selected: FormacionDataType
}

const UpdateStudentDialog = ({ open, setIsOpen, onSuccess, selected }: Props) => {

    const { update, loading } = useUpdateUsuariosFormacion()
    const handleSubmit = async (values: any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await update(values);
            onSuccess();
            setIsOpen(false)
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    }
    const handleCancel = () => {
        setIsOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] px-4">
                <DialogHeader>
                    <DialogTitle>Editar</DialogTitle>
                </DialogHeader>
                <FormacionForm
                    IsLoading={loading}
                    onSubmit={handleSubmit}
                    initialValues={selected}
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateStudentDialog
