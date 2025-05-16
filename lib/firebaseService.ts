// lib/firebaseService.ts
import { db } from './firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  WithFieldValue,
  PartialWithFieldValue,
} from 'firebase/firestore'

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