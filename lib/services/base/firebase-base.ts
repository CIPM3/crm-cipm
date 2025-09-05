import { db as getDb, auth as getAuth } from '../../firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  WithFieldValue,
  PartialWithFieldValue,
  QueryConstraint,
  DocumentSnapshot,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore'

// Enhanced error types for better error handling
export class FirebaseServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public operation: string,
    public collection?: string
  ) {
    super(message)
    this.name = 'FirebaseServiceError'
  }
}

// Query options for enhanced data fetching
export interface QueryOptions {
  where?: { field: string; operator: any; value: any }[]
  orderBy?: { field: string; direction?: 'asc' | 'desc' }[]
  limit?: number
  startAfter?: DocumentSnapshot
}

// Pagination result interface
export interface PaginatedResult<T> {
  data: (T & { id: string })[]
  hasNextPage: boolean
  nextPageCursor?: DocumentSnapshot
  totalCount?: number
}

// Enhanced method to fetch items with advanced querying and pagination
export const fetchItems = async <T extends DocumentData>(
  collectionName: string,
  options?: QueryOptions
): Promise<(T & { id: string })[]> => {
  try {
    const db = getDb()
    let q = collection(db, collectionName)
    const constraints: QueryConstraint[] = []

    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })
    }

    if (options?.orderBy) {
      options.orderBy.forEach(({ field, direction = 'asc' }) => {
        constraints.push(orderBy(field, direction))
      })
    }

    if (options?.limit) {
      constraints.push(limit(options.limit))
    }

    if (options?.startAfter) {
      constraints.push(startAfter(options.startAfter))
    }

    if (constraints.length > 0) {
      q = query(collection(db, collectionName), ...constraints) as any
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T & { id: string }))
  } catch (error: any) {
    console.error(`Error fetching items from "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to fetch items from ${collectionName}`,
      error.code || 'unknown',
      'fetchItems',
      collectionName
    )
  }
}

// Enhanced method to fetch items with pagination
export const fetchItemsPaginated = async <T extends DocumentData>(
  collectionName: string,
  options?: QueryOptions
): Promise<PaginatedResult<T>> => {
  try {
    const db = getDb()
    let q = collection(db, collectionName)
    const constraints: QueryConstraint[] = []

    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })
    }

    if (options?.orderBy) {
      options.orderBy.forEach(({ field, direction = 'asc' }) => {
        constraints.push(orderBy(field, direction))
      })
    }

    const pageSize = options?.limit || 20
    constraints.push(limit(pageSize + 1)) // Fetch one extra to check if there's a next page

    if (options?.startAfter) {
      constraints.push(startAfter(options.startAfter))
    }

    if (constraints.length > 0) {
      q = query(collection(db, collectionName), ...constraints) as any
    }

    const querySnapshot = await getDocs(q)
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T & { id: string }))

    // Check if there's a next page
    const hasNextPage = docs.length > pageSize
    if (hasNextPage) {
      docs.pop() // Remove the extra document
    }

    return {
      data: docs,
      hasNextPage,
      nextPageCursor: hasNextPage ? querySnapshot.docs[docs.length - 1] : undefined
    }
  } catch (error: any) {
    console.error(`Error fetching paginated items from "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to fetch paginated items from ${collectionName}`,
      error.code || 'unknown',
      'fetchItemsPaginated',
      collectionName
    )
  }
}

// Fetch a single item by ID
export const fetchItem = async <T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<T & { id: string }> => {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T & { id: string }
    } else {
      throw new FirebaseServiceError(
        `Document with ID "${id}" not found in collection "${collectionName}"`,
        'not-found',
        'fetchItem',
        collectionName
      )
    }
  } catch (error: any) {
    console.error(`Error fetching item "${id}" from "${collectionName}":`, error)
    throw error instanceof FirebaseServiceError ? error : new FirebaseServiceError(
      `Failed to fetch item from ${collectionName}`,
      error.code || 'unknown',
      'fetchItem',
      collectionName
    )
  }
}

// Add a new item to a collection with auto-generated ID
export const addItem = async <T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<Omit<T, 'id'>>
): Promise<T & { id: string }> => {
  try {
    const db = getDb()
    const collectionRef = collection(db, collectionName)
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collectionRef, docData)
    
    return {
      id: docRef.id,
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    } as T & { id: string }
  } catch (error: any) {
    console.error(`Error adding item to "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to add item to ${collectionName}`,
      error.code || 'unknown',
      'addItem',
      collectionName
    )
  }
}

// Add a new item to a collection with custom ID
export const setItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: WithFieldValue<Omit<T, 'id'>>
): Promise<T & { id: string }> => {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, id)
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    await setDoc(docRef, docData)
    
    return {
      id,
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    } as T & { id: string }
  } catch (error: any) {
    console.error(`Error setting item "${id}" in "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to set item in ${collectionName}`,
      error.code || 'unknown',
      'setItem',
      collectionName
    )
  }
}

// Update an existing item
export const updateItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: PartialWithFieldValue<T>
): Promise<{ id: string }> => {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, id)
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    }
    
    await updateDoc(docRef, updateData)
    return { id }
  } catch (error: any) {
    console.error(`Error updating item "${id}" in "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to update item in ${collectionName}`,
      error.code || 'unknown',
      'updateItem',
      collectionName
    )
  }
}

// Delete an item
export const deleteItem = async (collectionName: string, id: string): Promise<{ id: string }> => {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
    return { id }
  } catch (error: any) {
    console.error(`Error deleting item "${id}" from "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to delete item from ${collectionName}`,
      error.code || 'unknown',
      'deleteItem',
      collectionName
    )
  }
}

// Batch operations for better performance
export const batchWrite = async (operations: Array<{
  type: 'add' | 'update' | 'delete' | 'set'
  collection: string
  id?: string
  data?: any
}>) => {
  try {
    const db = getDb()
    const batch = writeBatch(db)
    
    operations.forEach(({ type, collection: collectionName, id, data }) => {
      const collectionRef = collection(db, collectionName)
      
      switch (type) {
        case 'add':
          const newDocRef = doc(collectionRef)
          batch.set(newDocRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          break
        case 'update':
          if (!id) throw new Error('ID required for update operation')
          const updateDocRef = doc(collectionRef, id)
          batch.update(updateDocRef, {
            ...data,
            updatedAt: serverTimestamp()
          })
          break
        case 'delete':
          if (!id) throw new Error('ID required for delete operation')
          const deleteDocRef = doc(collectionRef, id)
          batch.delete(deleteDocRef)
          break
        case 'set':
          if (!id) throw new Error('ID required for set operation')
          const setDocRef = doc(collectionRef, id)
          batch.set(setDocRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          break
      }
    })
    
    await batch.commit()
  } catch (error: any) {
    console.error('Error in batch write operation:', error)
    throw new FirebaseServiceError(
      'Failed to execute batch write',
      error.code || 'unknown',
      'batchWrite'
    )
  }
}