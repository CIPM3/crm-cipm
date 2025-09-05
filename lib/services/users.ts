import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  UserCredential 
} from 'firebase/auth'
import { auth } from '../firebase'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem, setItem } from './base/firebase-base'
import { UsersType as UserDataType } from '@/types'
import { COLLECTIONS } from '@/lib/constants'

// === USER AUTHENTICATION OPERATIONS ===

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('User logged in successfully:', userCredential.user.uid)
    return userCredential
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(`Login failed: ${error.message}`)
  }
}

export const registerUser = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }
    
    console.log('User registered successfully:', userCredential.user.uid)
    return userCredential
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(`Registration failed: ${error.message}`)
  }
}

// === USER DATA OPERATIONS ===

export const getAllUsuarios = () => 
  fetchItems<UserDataType>(COLLECTIONS.USERS)

export const getUsuarioById = (id: string) => 
  fetchItem<UserDataType>(COLLECTIONS.USERS, id)

export const createUsuario = (data: Omit<UserDataType, 'id'>) => 
  addItem<UserDataType>(COLLECTIONS.USERS, data)

export const createUsuarioWithId = (id: string, data: Omit<UserDataType, 'id'>) => 
  setItem<UserDataType>(COLLECTIONS.USERS, id, data)

export const updateUsuario = (id: string, data: Partial<UserDataType>) => 
  updateItem<UserDataType>(COLLECTIONS.USERS, id, data)

export const deleteUsuario = (id: string) => 
  deleteItem(COLLECTIONS.USERS, id)

// === USER QUERY OPERATIONS ===

export const getUsuariosByRole = (role: string) =>
  fetchItems<UserDataType>(COLLECTIONS.USERS, {
    where: [{ field: 'role', operator: '==', value: role }]
  })

export const getActiveUsuarios = () =>
  fetchItems<UserDataType>(COLLECTIONS.USERS, {
    where: [{ field: 'isActive', operator: '==', value: true }]
  })

export const searchUsuarios = (searchTerm: string) =>
  fetchItems<UserDataType>(COLLECTIONS.USERS, {
    where: [
      { field: 'name', operator: '>=', value: searchTerm },
      { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
    ]
  })

// === USER VALIDATION & UTILITIES ===

export const validateUserPermissions = async (userId: string, requiredRole: string): Promise<boolean> => {
  try {
    const user = await getUsuarioById(userId)
    return user.role === requiredRole
  } catch (error) {
    console.error('Error validating user permissions:', error)
    return false
  }
}

export const getUserDisplayName = (user: UserDataType): string => {
  return user.name || user.email || 'Usuario'
}

export const getUserInitials = (user: UserDataType): string => {
  const name = getUserDisplayName(user)
  return name.charAt(0).toUpperCase()
}