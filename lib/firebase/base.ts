// lib/firebase/base.ts
import { db } from '../firebase'
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
  QueryConstraint,
  DocumentSnapshot,
  serverTimestamp,
  writeBatch,
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
    })) as (T & { id: string })[]
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error fetching items from ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'fetchItems',
      collectionName
    )
  }
}

// Paginated fetch for better performance with large datasets
export const fetchItemsPaginated = async <T extends DocumentData>(
  collectionName: string,
  pageSize: number = 20,
  options?: Omit<QueryOptions, 'limit'> & { startAfter?: DocumentSnapshot }
): Promise<PaginatedResult<T>> => {
  const queryOptions = {
    ...options,
    limit: pageSize + 1 // Fetch one extra to check if there's a next page
  }

  const items = await fetchItems<T>(collectionName, queryOptions)
  const hasNextPage = items.length > pageSize
  
  if (hasNextPage) {
    items.pop() // Remove the extra item
  }

  return {
    data: items,
    hasNextPage,
    nextPageCursor: hasNextPage && items.length > 0 ? 
      await getDoc(doc(db, collectionName, items[items.length - 1].id)) : undefined
  }
}

// Fetch a single item by ID with enhanced error handling
export const fetchItem = async <T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> => {
  try {
    if (!id) {
      throw new Error('Document ID is required')
    }

    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.warn(`Document with ID ${id} not found in ${collectionName}`)
      return null
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as T & { id: string }
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error fetching item ${id} from ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'fetchItem',
      collectionName
    )
  }
}

// Add a new item with enhanced validation and error handling
export const addItem = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<{ id: string }> => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided')
    }

    // Add server timestamp for creation
    const dataWithTimestamp = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp)
    
    console.log(`✅ Added item to ${collectionName} with ID: ${docRef.id}`)
    
    return { id: docRef.id }
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error adding item to ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'addItem',
      collectionName
    )
  }
}

// Update an existing item with enhanced validation
export const updateItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<{ id: string }> => {
  try {
    if (!id) {
      throw new Error('Document ID is required for update')
    }
    
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('Update data is required and cannot be empty')
    }

    // Add server timestamp for updates
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp()
    }

    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, dataWithTimestamp)
    
    console.log(`✅ Updated item ${id} in ${collectionName}`)
    
    return { id }
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error updating item ${id} in ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'updateItem',
      collectionName
    )
  }
}

// Delete an item with confirmation
export const deleteItem = async (collectionName: string, id: string): Promise<{ id: string }> => {
  try {
    if (!id) {
      throw new Error('Document ID is required for deletion')
    }

    const docRef = doc(db, collectionName, id)
    
    // Check if document exists before deletion
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Document with ID ${id} not found in ${collectionName}`)
    }

    await deleteDoc(docRef)
    
    console.log(`✅ Deleted item ${id} from ${collectionName}`)
    
    return { id }
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error deleting item ${id} from ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'deleteItem',
      collectionName
    )
  }
}

// Set an item with a specific ID (create or overwrite)
export const setItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<{ id: string }> => {
  try {
    const dataWithTimestamp = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = doc(db, collectionName, id)
    await setDoc(docRef, dataWithTimestamp)
    
    return { id }
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error setting item ${id} in ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'setItem',
      collectionName
    )
  }
}

// Advanced query function
export const queryItems = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints)
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (T & { id: string })[]
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error querying items from ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'queryItems',
      collectionName
    )
  }
}

// Batch update multiple items
export const batchUpdateItems = async (
  updates: Array<{
    collection: string
    id: string
    data: Partial<DocumentData>
  }>
): Promise<void> => {
  try {
    const batch = writeBatch(db)
    
    updates.forEach(({ collection: collectionName, id, data }) => {
      const docRef = doc(db, collectionName, id)
      batch.update(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
    })
    
    await batch.commit()
    console.log(`✅ Batch updated ${updates.length} items`)
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error in batch update: ${error.message}`,
      error.code || 'unknown',
      'batchUpdateItems'
    )
  }
}

// Increment a numeric field
export const incrementField = async (
  collectionName: string,
  id: string,
  field: string,
  incrementValue: number = 1
): Promise<{ id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      [field]: incrementValue,
      updatedAt: serverTimestamp()
    })
    
    return { id }
  } catch (error: any) {
    throw new FirebaseServiceError(
      `Error incrementing field ${field} in ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'incrementField',
      collectionName
    )
  }
}