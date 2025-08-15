import { UserForm } from '@/components/form/user-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { UsersType } from '@/types';
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
            let newUser = {
                ...values,
                avatar: ''
            }
            // Llamar a la mutación para crear el usuario
            await mutate(newUser);
            triggerRefetch()
            setIsOpen(false)
            console.log("Usuario Actualizado con éxito");
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
