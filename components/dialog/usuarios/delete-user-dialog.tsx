import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { UsersType } from '@/types';
import { Button } from '@/components/ui/button';
import { useDeleteUsuario } from '@/hooks/usuarios/useDeleteUsuario';
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore';

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  user: UsersType
}

const DeleteUserDialog = ({ open, setIsOpen, user }: Props) => {
  const {mutate} = useDeleteUsuario()
  const {triggerRefetch} = useRefetchUsuariosStore()

  const handleSubmit = async (values: UsersType) => {
    try {
      
      // Llamar a la mutación para crear el usuario
      await mutate(values.id);
      triggerRefetch()
      setIsOpen(false)
      console.log("Usuario Eliminado con éxito");
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
          <DialogTitle>Eliminar Usuario: {user.name}</DialogTitle>
        </DialogHeader>
        <div className=' w-full  flex flex-col text-gray-400'>
          <span className='w-full truncate'>Estas seguro de eliminar  el correo: {user.email}</span>
          <span className='w-full'>los cambios son irreversibles.</span>
        </div>

        <div className='flex items-center justify-between gap-2'>
          <Button onClick={handleCancel} className='w-full border-input bg-transparent text-gray-500 border hover:bg-gray-400'>Cancelar</Button>
          <Button onClick={()=>handleSubmit(user)} className='w-full bg-red-500 hover:bg-red-300'>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUserDialog
