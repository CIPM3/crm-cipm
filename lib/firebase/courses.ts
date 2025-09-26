// lib/firebase/courses.ts
import { CursoType as CursoDataType } from '@/types'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from './base'

// ===== CURSOS =====
export const getAllCursos = () => fetchItems<CursoDataType>('cursos')
export const getCursoById = (id: string) => fetchItem<CursoDataType>('cursos', id)
export const createCurso = (data: Omit<CursoDataType, 'id'>) => addItem('cursos', data)
export const updateCurso = (id: string, data: Partial<CursoDataType>) => updateItem('cursos', id, data)
export const deleteCurso = (id: string) => deleteItem('cursos', id)