
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"

export interface Usuario {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

const collectionName = "Usuarios"

export const getAllUsuarios = () => fetchItems<Usuario>(collectionName)
export const getUsuarioById = (id: string) => fetchItem<Usuario>(collectionName, id)
export const createUsuario = (data: Omit<Usuario, 'id'>) => addItem<Usuario>(collectionName, data)
export const updateUsuario = (id: string, data: Partial<Usuario>) => updateItem<Usuario>(collectionName, id, data)
export const deleteUsuario = (id: string) => deleteItem(collectionName, id)