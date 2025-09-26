// lib/firebase/formacion.ts
import { FormacionDataType } from '@/types'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from './base'

// ===== FORMACION =====
export const getAllStudentsFormacion = () => fetchItems<FormacionDataType>('FORMACIONClasePrueba')
export const getStudentFormacionById = (id: string) => fetchItem<FormacionDataType>('FORMACIONClasePrueba', id)
export const createStudentFormacion = (data: Omit<FormacionDataType, 'id'>) => addItem('FORMACIONClasePrueba', data)
export const updateStudentFormacion = (id: string, data: Partial<FormacionDataType>) => updateItem('FORMACIONClasePrueba', id, data)
export const deleteStudentFormacion = (id: string) => deleteItem('FORMACIONClasePrueba', id)