// lib/firebase/auth.ts
import { auth } from '../firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  UserCredential 
} from 'firebase/auth'
import { FirebaseServiceError } from './base'

// Authentication service
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Login failed: ${error.message}`,
      error.code || 'auth/unknown',
      'loginUser'
    )
  }
}

export const registerUser = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }
    
    return userCredential
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Registration failed: ${error.message}`,
      error.code || 'auth/unknown',
      'registerUser'
    )
  }
}