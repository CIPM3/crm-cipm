import { UserForm } from '@/components/form/user-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { useRegisterUser } from "@/hooks/registro";
import { getQueryClient } from '@/components/provider/get-query-client';
import { Get } from '@/api/Usuarios/get';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const CreateUserDialog = ({ open, setIsOpen }: Props) => {
    const createUserMutation = useRegisterUser();
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(Get)
    const { refetch } = useSuspenseQuery(Get);

    const handleSubmit = async (values:any) => {
        try {
            let newUser = {
                ...values,
                avatar: ''
            }
            // Llamar a la mutación para crear el usuario
            await createUserMutation.mutateAsync(newUser);
            refetch()
            setIsOpen(false)
            console.log("Usuario creado con éxito");
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
                    <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <UserForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateUserDialog
