import { fetchItems, fetchItem, addItem, updateItem, deleteItem, setItem } from './base/firebase-base'
import { UsersType as EstudianteDataType } from '@/types'
import { COLLECTIONS } from '@/lib/constants'
import { v4 as uuidv4 } from 'uuid'

// === ESTUDIANTES OPERATIONS ===
// Note: Estudiantes are stored in the USERS collection with student-specific roles

export const getAllEstudiantes = () => 
  fetchItems<EstudianteDataType>(COLLECTIONS.USERS, {
    where: [{ field: 'role', operator: 'in', value: ['cliente', 'base'] }]
  })

export const getEstudianteById = (id: string) => 
  fetchItem<EstudianteDataType>(COLLECTIONS.USERS, id)

export const createEstudiante = (data: Omit<EstudianteDataType, 'id'>) => 
  addItem<EstudianteDataType>(COLLECTIONS.USERS, {
    ...data,
    role: data.role || 'cliente' // Default to cliente role for students
  })

export const createEstudianteWithId = (id: string, data: Omit<EstudianteDataType, 'id'>) => 
  setItem<EstudianteDataType>(COLLECTIONS.USERS, id, {
    ...data,
    role: data.role || 'cliente'
  })

export const updateEstudiante = (id: string, data: Partial<EstudianteDataType>) => 
  updateItem<EstudianteDataType>(COLLECTIONS.USERS, id, data)

export const deleteEstudiante = (id: string) => 
  deleteItem(COLLECTIONS.USERS, id)

// === ESTUDIANTES QUERY OPERATIONS ===

export const getEstudiantesByRole = (role: string) =>
  fetchItems<EstudianteDataType>(COLLECTIONS.USERS, {
    where: [{ field: 'role', operator: '==', value: role }]
  })

export const getActiveEstudiantes = () =>
  fetchItems<EstudianteDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'role', operator: 'in', value: ['cliente', 'base'] },
      { field: 'status', operator: '==', value: 'Activo' }
    ]
  })

export const searchEstudiantes = (searchTerm: string) =>
  fetchItems<EstudianteDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'role', operator: 'in', value: ['cliente', 'base'] },
      { field: 'name', operator: '>=', value: searchTerm },
      { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
    ]
  })

export const getEstudiantesByStatus = (status: string) =>
  fetchItems<EstudianteDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'role', operator: 'in', value: ['cliente', 'base'] },
      { field: 'status', operator: '==', value: status }
    ]
  })

// === ESTUDIANTES UTILITIES ===

export const getEstudianteDisplayName = (estudiante: EstudianteDataType): string => {
  return estudiante.name || estudiante.email || 'Estudiante'
}

export const getEstudianteInitials = (estudiante: EstudianteDataType): string => {
  const name = getEstudianteDisplayName(estudiante)
  return name.charAt(0).toUpperCase()
}

export const isEstudianteActive = (estudiante: EstudianteDataType): boolean => {
  return estudiante.status === 'Activo'
}