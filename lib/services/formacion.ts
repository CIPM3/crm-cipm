import { fetchItems, fetchItem, addItem, updateItem, deleteItem, setItem } from './base/firebase-base'
import { FormacionDataType } from '@/types'
import { COLLECTIONS } from '@/lib/constants'
import { v4 as uuidv4 } from 'uuid'

// === FORMACION STUDENT OPERATIONS ===

export const getAllStudentsFormacion = () => 
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES)

export const getStudentFormacionById = (id: string) => 
  fetchItem<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, id)

export const createStudentFormacion = async (data: Omit<FormacionDataType, 'id'>): Promise<FormacionDataType> => {
  const id = uuidv4()
  const studentData = { ...data, id }
  await setItem<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, id, studentData)
  return studentData
}

export const createFormacionStudent = async (estudiante: FormacionDataType): Promise<FormacionDataType> => {
  const id = estudiante.id || uuidv4()
  const studentData = { ...estudiante, id }
  await setItem<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, id, studentData)
  return studentData
}

export const updateStudentFormacion = (id: string, data: Partial<FormacionDataType>) => 
  updateItem<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, id, data)

export const updateFormacionStudent = (id: string, estudiante: Partial<FormacionDataType>) => 
  updateItem<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, id, estudiante)

export const deleteStudentFormacion = (id: string) => 
  deleteItem(COLLECTIONS.FORMACION_CLASSES, id)

export const deleteFormacionStudent = (id: string) => 
  deleteItem(COLLECTIONS.FORMACION_CLASSES, id)

// === FORMACION QUERY OPERATIONS ===

export const getFormacionStudentsByStatus = (status: string) =>
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, {
    where: [{ field: 'status', operator: '==', value: status }]
  })

export const getFormacionStudentsByWeek = (week: string) =>
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, {
    where: [{ field: 'week', operator: '==', value: week }]
  })

export const getFormacionStudentsByTeacher = (maestro: string) =>
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, {
    where: [{ field: 'maestro', operator: '==', value: maestro }]
  })

export const getFormacionStudentsByNivel = (nivel: string) =>
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, {
    where: [{ field: 'nivel', operator: '==', value: nivel }]
  })

// === FORMACION UTILITIES ===

export const searchFormacionStudents = (searchTerm: string) =>
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, {
    where: [
      { field: 'nombre', operator: '>=', value: searchTerm },
      { field: 'nombre', operator: '<=', value: searchTerm + '\uf8ff' }
    ]
  })

export const getActiveFormacionStudents = () =>
  fetchItems<FormacionDataType>(COLLECTIONS.FORMACION_CLASSES, {
    where: [{ field: 'status', operator: '==', value: 'Activo' }]
  })