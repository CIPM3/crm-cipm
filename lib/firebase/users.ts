// lib/firebase/users.ts
import { UsersType as UserDataType } from '@/types'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from './base'

// ===== USUARIOS =====
export const getAllUsuarios = () => fetchItems<UserDataType>('Usuarios')
export const getUsuarioById = (id: string) => fetchItem<UserDataType>('Usuarios', id)
export const createUsuario = (data: Omit<UserDataType, 'id'>) => addItem('Usuarios', data)
export const updateUsuario = (id: string, data: Partial<UserDataType>) => updateItem('Usuarios', id, data)
export const deleteUsuario = (id: string) => deleteItem('Usuarios', id)

// ===== ESTUDIANTES (Uses same collection as usuarios) =====
export const getAllEstudiantes = () => fetchItems<UserDataType>('Usuarios')
export const getEstudianteById = (id: string) => fetchItem<UserDataType>('Usuarios', id)
export const createEstudiante = (data: Omit<UserDataType, 'id'>) => addItem('Usuarios', data)
export const updateEstudiante = (id: string, data: Partial<UserDataType>) => updateItem('Usuarios', id, data)
export const deleteEstudiante = (id: string) => deleteItem('Usuarios', id)