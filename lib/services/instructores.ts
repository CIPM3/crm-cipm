import { fetchItems, fetchItem, addItem, updateItem, deleteItem, setItem } from './base/firebase-base'
import { UsersType as InstructorDataType } from '@/types'
import { COLLECTIONS } from '@/lib/constants'
import { v4 as uuidv4 } from 'uuid'

// === INSTRUCTORES OPERATIONS ===
// Note: Instructores are stored in the USERS collection with instructor role

export const getAllInstructores = () => 
  fetchItems<InstructorDataType>(COLLECTIONS.USERS, {
    where: [{ field: 'role', operator: '==', value: 'instructor' }]
  })

export const getInstructorById = (id: string) => 
  fetchItem<InstructorDataType>(COLLECTIONS.USERS, id)

export const createInstructor = (data: Omit<InstructorDataType, 'id'>) => 
  addItem<InstructorDataType>(COLLECTIONS.USERS, {
    ...data,
    role: 'instructor' // Force instructor role
  })

export const createInstructorWithId = (id: string, data: Omit<InstructorDataType, 'id'>) => 
  setItem<InstructorDataType>(COLLECTIONS.USERS, id, {
    ...data,
    role: 'instructor'
  })

export const updateInstructor = (id: string, data: Partial<InstructorDataType>) => 
  updateItem<InstructorDataType>(COLLECTIONS.USERS, id, data)

export const deleteInstructor = (id: string) => 
  deleteItem(COLLECTIONS.USERS, id)

// === INSTRUCTORES QUERY OPERATIONS ===

export const getActiveInstructores = () =>
  fetchItems<InstructorDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'role', operator: '==', value: 'instructor' },
      { field: 'status', operator: '==', value: 'Activo' }
    ]
  })

export const searchInstructores = (searchTerm: string) =>
  fetchItems<InstructorDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'role', operator: '==', value: 'instructor' },
      { field: 'name', operator: '>=', value: searchTerm },
      { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
    ]
  })

export const getInstructoresByStatus = (status: string) =>
  fetchItems<InstructorDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'role', operator: '==', value: 'instructor' },
      { field: 'status', operator: '==', value: status }
    ]
  })

// === INSTRUCTORES UTILITIES ===

export const getInstructorDisplayName = (instructor: InstructorDataType): string => {
  return instructor.name || instructor.email || 'Instructor'
}

export const getInstructorInitials = (instructor: InstructorDataType): string => {
  const name = getInstructorDisplayName(instructor)
  return name.charAt(0).toUpperCase()
}

export const isInstructorActive = (instructor: InstructorDataType): boolean => {
  return instructor.status === 'Activo'
}

export const getInstructorSpecialties = (instructor: InstructorDataType): string[] => {
  // This could be extended based on the actual instructor data structure
  // For now, return empty array as specialty info isn't in the base type
  return []
}