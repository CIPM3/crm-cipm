// lib/firebaseService.ts
import { db, auth } from './firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  DocumentData,
  WithFieldValue,
  PartialWithFieldValue,
} from 'firebase/firestore'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  UserCredential 
} from 'firebase/auth'
import { 
  UserDataType, 
  InstructorDataType, 
  EstudianteDataType, 
  FormacionDataType, 
  CursoDataType, 
  VideoDataType 
} from '@/types'

// Obtener todos los documentos
export const fetchItems = async <T extends DocumentData>(collectionName: string): Promise<(T & { id: string })[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
  } catch (error) {
    console.error(`Error al obtener documentos de la colección "${collectionName}":`, error)
    throw new Error('No se pudieron obtener los documentos.')
  }
}

// Obtener un documento por ID
export const fetchItem = async <T extends DocumentData>(collectionName: string, id: string): Promise<T & { id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) throw new Error('El documento no existe.')
    return { id: docSnap.id, ...(docSnap.data() as T) }
  } catch (error) {
    console.error(`Error al obtener el documento con ID "${id}" de la colección "${collectionName}":`, error)
    throw new Error('No se pudo obtener el documento.')
  }
}

// Agregar un documento
export const addItem = async <T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<{ id: string }> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data)
    return { id: docRef.id }
  } catch (error) {
    console.error(`Error al agregar un documento a la colección "${collectionName}":`, error)
    throw new Error('No se pudo agregar el documento.')
  }
}

// Actualizar un documento
export const updateItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: PartialWithFieldValue<T>
): Promise<{ id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)  
    await updateDoc(docRef, data)
    return { id }
  } catch (error) {
    console.error(`Error al actualizar el documento con ID "${id}" en la colección "${collectionName}":`, error)
    throw new Error('No se pudo actualizar el documento.')
  }
}

// Eliminar un documento
export const deleteItem = async (collectionName: string, id: string): Promise<{ id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
    return { id }
  } catch (error) {
    console.error(`Error al eliminar el documento con ID "${id}" de la colección "${collectionName}":`, error)
    throw new Error('No se pudo eliminar el documento.')
  }
}

// Auth services
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw new Error('No se pudo iniciar sesión.')
  }
}

export const registerUser = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }
    return userCredential
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    throw new Error('No se pudo registrar el usuario.')
  }
}

// Set document with custom ID
export const setItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: WithFieldValue<T>
): Promise<{ id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    await setDoc(docRef, data)
    return { id }
  } catch (error) {
    console.error(`Error al crear el documento con ID "${id}" en la colección "${collectionName}":`, error)
    throw new Error('No se pudo crear el documento.')
  }
}

// ===== USUARIOS =====
export const getAllUsuarios = () => fetchItems<UserDataType>('Usuarios')
export const getUsuarioById = (id: string) => fetchItem<UserDataType>('Usuarios', id)
export const createUsuario = (data: Omit<UserDataType, 'id'>) => addItem('Usuarios', data)
export const updateUsuario = (id: string, data: Partial<UserDataType>) => updateItem('Usuarios', id, data)
export const deleteUsuario = (id: string) => deleteItem('Usuarios', id)

// ===== INSTRUCTORES =====
export const getAllInstructores = () => fetchItems<InstructorDataType>('InstructorClasePrueba')
export const getInstructorById = (id: string) => fetchItem<InstructorDataType>('InstructorClasePrueba', id)
export const createInstructor = (data: Omit<InstructorDataType, 'id'>) => addItem('InstructorClasePrueba', data)
export const updateInstructor = (id: string, data: Partial<InstructorDataType>) => updateItem('InstructorClasePrueba', id, data)
export const deleteInstructor = (id: string) => deleteItem('InstructorClasePrueba', id)

// ===== ESTUDIANTES =====
export const getAllEstudiantes = () => fetchItems<EstudianteDataType>('Usuarios')
export const getEstudianteById = (id: string) => fetchItem<EstudianteDataType>('Usuarios', id)
export const createEstudiante = (data: Omit<EstudianteDataType, 'id'>) => addItem('Usuarios', data)
export const updateEstudiante = (id: string, data: Partial<EstudianteDataType>) => updateItem('Usuarios', id, data)
export const deleteEstudiante = (id: string) => deleteItem('Usuarios', id)

// ===== FORMACION =====
export const getAllStudentsFormacion = () => fetchItems<FormacionDataType>('FORMACIONClasePrueba')
export const getStudentFormacionById = (id: string) => fetchItem<FormacionDataType>('FORMACIONClasePrueba', id)
export const createStudentFormacion = (data: Omit<FormacionDataType, 'id'>) => addItem('FORMACIONClasePrueba', data)
export const updateStudentFormacion = (id: string, data: Partial<FormacionDataType>) => updateItem('FORMACIONClasePrueba', id, data)
export const deleteStudentFormacion = (id: string) => deleteItem('FORMACIONClasePrueba', id)

// ===== CURSOS =====
export const getAllCursos = () => fetchItems<CursoDataType>('cursos')
export const getCursoById = (id: string) => fetchItem<CursoDataType>('cursos', id)
export const createCurso = (data: Omit<CursoDataType, 'id'>) => addItem('cursos', data)
export const updateCurso = (id: string, data: Partial<CursoDataType>) => updateItem('cursos', id, data)
export const deleteCurso = (id: string) => deleteItem('cursos', id)

// ===== VIDEOS =====
export const getAllVideos = () => fetchItems<VideoDataType>('videos')
export const getVideoById = (id: string) => fetchItem<VideoDataType>('videos', id)
export const createVideo = (data: Omit<VideoDataType, 'id'>) => addItem('videos', data)
export const updateVideo = (id: string, data: Partial<VideoDataType>) => updateItem('videos', id, data)
export const deleteVideo = (id: string) => deleteItem('videos', id)