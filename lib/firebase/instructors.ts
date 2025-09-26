// lib/firebase/instructors.ts
import { ClasePrubeaType as InstructorDataType } from '@/types'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from './base'

// ===== INSTRUCTORES =====
export const getAllInstructores = () => fetchItems<InstructorDataType>('InstructorClasePrueba')
export const getInstructorById = (id: string) => fetchItem<InstructorDataType>('InstructorClasePrueba', id)
export const createInstructor = (data: Omit<InstructorDataType, 'id'>) => addItem('InstructorClasePrueba', data)
export const updateInstructor = (id: string, data: Partial<InstructorDataType>) => updateItem('InstructorClasePrueba', id, data)
export const deleteInstructor = (id: string) => deleteItem('InstructorClasePrueba', id)