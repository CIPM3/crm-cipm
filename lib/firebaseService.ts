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
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  UserCredential 
} from 'firebase/auth'
import { 
  UsersType as UserDataType, 
  ClasePrubeaType as InstructorDataType, 
  UsersType as EstudianteDataType, 
  FormacionDataType, 
  CursoType as CursoDataType, 
  VideoType as VideoDataType,
  CourseComment,
  CommentsQueryOptions
} from '@/types'

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
      q = query(q, ...constraints)
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
  } catch (error: any) {
    console.error(`Error fetching documents from collection "${collectionName}":`, error)
    throw new FirebaseServiceError(
      'Failed to fetch documents',
      error.code || 'unknown',
      'fetchItems',
      collectionName
    )
  }
}

// Paginated fetch with metadata
export const fetchItemsPaginated = async <T extends DocumentData>(
  collectionName: string,
  options?: QueryOptions
): Promise<PaginatedResult<T>> => {
  try {
    const data = await fetchItems<T>(collectionName, options)
    const hasNextPage = options?.limit ? data.length === options.limit : false
    const nextPageCursor = hasNextPage && data.length > 0 
      ? await getDoc(doc(db, collectionName, data[data.length - 1].id))
      : undefined

    return {
      data,
      hasNextPage,
      nextPageCursor
    }
  } catch (error: any) {
    throw new FirebaseServiceError(
      'Failed to fetch paginated documents',
      error.code || 'unknown',
      'fetchItemsPaginated',
      collectionName
    )
  }
}

// Enhanced method to fetch a single item by ID
export const fetchItem = async <T extends DocumentData>(
  collectionName: string, 
  id: string
): Promise<T & { id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new FirebaseServiceError(
        'Document not found',
        'not-found',
        'fetchItem',
        collectionName
      )
    }
    
    return { id: docSnap.id, ...(docSnap.data() as T) }
  } catch (error: any) {
    console.error(`Error fetching document with ID "${id}" from collection "${collectionName}":`, error)
    
    if (error instanceof FirebaseServiceError) {
      throw error
    }
    
    throw new FirebaseServiceError(
      'Failed to fetch document',
      error.code || 'unknown',
      'fetchItem',
      collectionName
    )
  }
}

// Enhanced method to add a document with validation
export const addItem = async <T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<{ id: string }> => {
  try {
    console.log(`=== ADDING DOCUMENT TO ${collectionName} ===`)
    console.log('Original data:', data)
    
    // Add timestamp fields automatically
    const enrichedData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log('Enriched data:', enrichedData)
    console.log('Collection name:', collectionName)
    console.log('Database instance:', db ? 'Connected' : 'Not connected')
    
    const docRef = await addDoc(collection(db, collectionName), enrichedData)
    console.log('✅ Document added successfully with ID:', docRef.id)
    return { id: docRef.id }
  } catch (error: any) {
    console.error(`=== ERROR ADDING DOCUMENT TO ${collectionName} ===`)
    console.error('Error object:', error)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Error details:', error.details)
    console.error('Data being added:', data)
    
    throw new FirebaseServiceError(
      `Failed to add document to ${collectionName}: ${error.message}`,
      error.code || 'unknown',
      'addItem',
      collectionName
    )
  }
}

// Enhanced method to update a document with validation
export const updateItem = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: PartialWithFieldValue<T>
): Promise<{ id: string }> => {
  try {
    // Add updatedAt timestamp automatically
    const enrichedData = {
      ...data,
      updatedAt: serverTimestamp()
    }
    
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, enrichedData)
    return { id }
  } catch (error: any) {
    console.error(`Error updating document with ID "${id}" in collection "${collectionName}":`, error)
    throw new FirebaseServiceError(
      'Failed to update document',
      error.code || 'unknown',
      'updateItem',
      collectionName
    )
  }
}

// Enhanced method to delete a document with existence check
export const deleteItem = async (collectionName: string, id: string): Promise<{ id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    
    // Check if document exists before deleting
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new FirebaseServiceError(
        'Document not found',
        'not-found',
        'deleteItem',
        collectionName
      )
    }
    
    await deleteDoc(docRef)
    return { id }
  } catch (error: any) {
    console.error(`Error deleting document with ID "${id}" from collection "${collectionName}":`, error)
    
    if (error instanceof FirebaseServiceError) {
      throw error
    }
    
    throw new FirebaseServiceError(
      'Failed to delete document',
      error.code || 'unknown',
      'deleteItem',
      collectionName
    )
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

// ===== COURSE COMMENTS =====

// Simplified comments fetching that avoids complex composite indexes
export const getCommentsByCourse = async (options: CommentsQueryOptions): Promise<CourseComment[]> => {
  try {
    // Use the simplest possible query to avoid index requirements
    const queryOptions = {
      where: [] as any[],
      orderBy: [{ field: 'createdAt', direction: 'desc' }] as any[],
      limit: options.limit
    }

    // Only add the most basic filters
    if (options.courseId) {
      queryOptions.where.push({ field: 'courseId', operator: '==', value: options.courseId })
    }

    // Note: parentId filtering is now done client-side for better compatibility
    // This avoids issues with null/undefined values in Firestore queries

    // Fetch all comments with basic query
    let comments = await fetchItems<CourseComment>('CourseComments', queryOptions)

    // Apply additional filters client-side to avoid complex indexes
    if (options.userId) {
      comments = comments.filter(comment => comment.userId === options.userId)
    }

    if (options.isPinned !== undefined) {
      comments = comments.filter(comment => comment.isPinned === options.isPinned)
    }

    // Handle parentId filtering client-side for better compatibility
    if (options.parentId !== undefined) {
      if (options.parentId === null) {
        // Filter for top-level comments (null, undefined, or empty string)
        comments = comments.filter(comment => 
          !comment.parentId || comment.parentId === null || comment.parentId === ''
        )
      } else {
        // Filter for specific parent
        comments = comments.filter(comment => comment.parentId === options.parentId)
      }
    }

    // Sort client-side: pinned first, then by creation date
    comments.sort((a, b) => {
      // Pinned comments first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then by creation date (newest first) - handle missing timestamps
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })

    // Apply limit after sorting
    if (options.limit) {
      comments = comments.slice(0, options.limit)
    }

    return comments
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    throw new FirebaseServiceError(
      'Failed to fetch comments',
      error.code || 'unknown',
      'getCommentsByCourse',
      'CourseComments'
    )
  }
}


// Get all comments for a course (including replies)
export const getAllCourseComments = (courseId: string) => 
  getCommentsByCourse({ courseId })

// Get top-level comments for a course
export const getTopLevelComments = (courseId: string, limit?: number) => 
  getCommentsByCourse({ courseId, parentId: null, limit })

// Get replies for a specific comment
export const getCommentReplies = (parentId: string, limit?: number) => 
  getCommentsByCourse({ parentId, limit })

// Get comments by user
export const getUserComments = (userId: string, courseId?: string) => 
  getCommentsByCourse({ userId, courseId })

// Get pinned comments for a course
export const getPinnedComments = (courseId: string) => 
  getCommentsByCourse({ courseId, isPinned: true })

// Standard CRUD operations
export const getCommentById = (id: string) => 
  fetchItem<CourseComment>('CourseComments', id)

export const createComment = (data: Omit<CourseComment, 'id' | 'createdAt' | 'updatedAt'>) => 
  addItem<CourseComment>('CourseComments', data)

export const updateComment = (id: string, data: Partial<CourseComment>) => 
  updateItem<CourseComment>('CourseComments', id, data)

export const deleteComment = (id: string) => 
  deleteItem('CourseComments', id)

// Advanced comment operations
export const likeComment = async (commentId: string, userId: string): Promise<{ id: string }> => {
  try {
    const comment = await getCommentById(commentId)
    const likedBy = comment.likedBy || []
    
    if (likedBy.includes(userId)) {
      // Unlike: remove user from likedBy array and decrease likes count
      const updatedLikedBy = likedBy.filter(id => id !== userId)
      const updatedData = {
        likedBy: updatedLikedBy,
        likes: Math.max(0, comment.likes - 1)
      }
      return await updateComment(commentId, updatedData)
    } else {
      // Like: add user to likedBy array and increase likes count
      const updatedLikedBy = [...likedBy, userId]
      const updatedData = {
        likedBy: updatedLikedBy,
        likes: comment.likes + 1
      }
      return await updateComment(commentId, updatedData)
    }
  } catch (error: any) {
    console.error(`Error toggling like for comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to toggle like on comment',
      error.code || 'unknown',
      'likeComment',
      'CourseComments'
    )
  }
}

export const pinComment = async (commentId: string, isPinned: boolean): Promise<{ id: string }> => {
  try {
    return await updateComment(commentId, { isPinned })
  } catch (error: any) {
    console.error(`Error pinning comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to pin comment',
      error.code || 'unknown',
      'pinComment',
      'CourseComments'
    )
  }
}

export const moderateComment = async (commentId: string, isModerated: boolean): Promise<{ id: string }> => {
  try {
    return await updateComment(commentId, { isModerated })
  } catch (error: any) {
    console.error(`Error moderating comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to moderate comment',
      error.code || 'unknown',
      'moderateComment',
      'CourseComments'
    )
  }
}

// === ADVANCED QUERY FUNCTIONS ===

/**
 * Query items with Firestore constraints (where, orderBy, limit, etc.)
 */
export const queryItems = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    const snapshot = await getDocs(q)

    const items: T[] = []
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as T)
    })

    return items
  } catch (error: any) {
    console.error(`Error querying collection "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to query ${collectionName}`,
      error.code || 'unknown',
      'queryItems',
      collectionName
    )
  }
}

/**
 * Batch update multiple items
 */
export const batchUpdateItems = async (
  collectionName: string,
  updates: Array<{ id: string; data: any }>
): Promise<void> => {
  try {
    const batch = writeBatch(db)
    
    updates.forEach(({ id, data }) => {
      const docRef = doc(db, collectionName, id)
      batch.update(docRef, data)
    })
    
    await batch.commit()
  } catch (error: any) {
    console.error(`Error batch updating collection "${collectionName}":`, error)
    throw new FirebaseServiceError(
      `Failed to batch update ${collectionName}`,
      error.code || 'unknown',
      'batchUpdateItems',
      collectionName
    )
  }
}

/**
 * Increment a numeric field in a document
 */
export const incrementField = async (
  collectionName: string,
  id: string,
  fieldName: string,
  incrementValue: number = 1
): Promise<{ id: string }> => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      [fieldName]: incrementValue
    })
    
    return { id }
  } catch (error: any) {
    console.error(`Error incrementing field "${fieldName}" in document "${id}":`, error)
    throw new FirebaseServiceError(
      `Failed to increment field ${fieldName}`,
      error.code || 'unknown',
      'incrementField',
      collectionName
    )
  }
}