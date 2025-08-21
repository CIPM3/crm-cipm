import { UserForm } from '@/components/form/user-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { UsersType, UpdateUserData } from '@/types';
import { useUpdateUsuarios } from '@/hooks/usuarios/useUpdateUsuarios';
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    user:UsersType
}

const EditUserDialog = ({ open, setIsOpen,user }: Props) => {
    const {mutate} = useUpdateUsuarios()
    const {triggerRefetch} = useRefetchUsuariosStore()

    const handleSubmit = async (values: UsersType) => {
        try {
            // Validar que todos los campos requeridos estén presentes
            if (!values.id || !values.name || !values.email || !values.role) {
                throw new Error('Campos requeridos faltantes');
            }

            // Crear objeto UpdateUserData con solo los campos necesarios
            const updateData: UpdateUserData = {
                id: values.id,
                name: values.name.trim(),
                email: values.email.trim().toLowerCase(),
                role: values.role,
                avatar: values.avatar?.trim() || ''
            }
            
            // Llamar a la mutación para actualizar el usuario
            const result = await mutate(updateData);
            
            if (result) {
                triggerRefetch()
                setIsOpen(false)
                console.log("Usuario actualizado con éxito");
            } else {
                throw new Error('La actualización no retornó datos válidos');
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            // Aquí podrías agregar un toast notification o modal de error
            alert(`Error al actualizar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    const handleCancel = () => {
        // Lógica para cancelar el formulario
        console.log("Formulario cancelado");
        setIsOpen(false)
    };

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario {user.name}</DialogTitle>
                </DialogHeader>
                <UserForm
                    initialValues={user}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditUserDialog
