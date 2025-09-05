import { fetchItems, fetchItem, addItem, updateItem, deleteItem, setItem, QueryOptions } from './base/firebase-base'
import { CursoType as CursoDataType } from '@/types'
import { COLLECTIONS } from '@/lib/constants'

// === COURSE DATA OPERATIONS ===

export const getAllCursos = () => 
  fetchItems<CursoDataType>(COLLECTIONS.COURSES)

export const getCursoById = (id: string) => 
  fetchItem<CursoDataType>(COLLECTIONS.COURSES, id)

export const createCurso = (data: Omit<CursoDataType, 'id'>) => 
  addItem<CursoDataType>(COLLECTIONS.COURSES, data)

export const createCursoWithId = (id: string, data: Omit<CursoDataType, 'id'>) => 
  setItem<CursoDataType>(COLLECTIONS.COURSES, id, data)

export const updateCurso = (id: string, data: Partial<CursoDataType>) => 
  updateItem<CursoDataType>(COLLECTIONS.COURSES, id, data)

export const deleteCurso = (id: string) => 
  deleteItem(COLLECTIONS.COURSES, id)

// === COURSE QUERY OPERATIONS ===

export const getCursosByCategory = (category: string) =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [{ field: 'category', operator: '==', value: category }]
  })

export const getCursosByLevel = (level: string) =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [{ field: 'level', operator: '==', value: level }]
  })

export const getActiveCursos = () =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [{ field: 'isActive', operator: '==', value: true }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

export const getPopularCursos = (limit: number = 10) =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [{ field: 'isActive', operator: '==', value: true }],
    orderBy: [{ field: 'enrollmentCount', direction: 'desc' }],
    limit
  })

export const getFeaturedCursos = () =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [
      { field: 'isActive', operator: '==', value: true },
      { field: 'isFeatured', operator: '==', value: true }
    ],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

export const searchCursos = (searchTerm: string) =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [
      { field: 'title', operator: '>=', value: searchTerm },
      { field: 'title', operator: '<=', value: searchTerm + '\uf8ff' }
    ]
  })

// === COURSE STATISTICS & ANALYTICS ===

export const getCourseStats = async (courseId: string) => {
  try {
    const course = await getCursoById(courseId)
    
    // You could add more complex stats here
    return {
      enrollmentCount: course.enrollmentCount || 0,
      rating: course.rating || 0,
      reviewCount: course.reviewCount || 0,
      completionRate: course.completionRate || 0,
      totalDuration: course.duration || 0
    }
  } catch (error) {
    console.error('Error fetching course stats:', error)
    return {
      enrollmentCount: 0,
      rating: 0,
      reviewCount: 0,
      completionRate: 0,
      totalDuration: 0
    }
  }
}

// === COURSE ENROLLMENT OPERATIONS ===

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  try {
    const course = await getCursoById(courseId)
    const currentEnrollments = course.enrolledUsers || []
    
    if (!currentEnrollments.includes(userId)) {
      await updateCurso(courseId, {
        enrolledUsers: [...currentEnrollments, userId],
        enrollmentCount: (course.enrollmentCount || 0) + 1
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error enrolling user in course:', error)
    throw error
  }
}

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  try {
    const course = await getCursoById(courseId)
    const currentEnrollments = course.enrolledUsers || []
    
    const updatedEnrollments = currentEnrollments.filter(id => id !== userId)
    await updateCurso(courseId, {
      enrolledUsers: updatedEnrollments,
      enrollmentCount: Math.max(0, (course.enrollmentCount || 0) - 1)
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error unenrolling user from course:', error)
    throw error
  }
}

export const getUserEnrolledCourses = (userId: string) =>
  fetchItems<CursoDataType>(COLLECTIONS.COURSES, {
    where: [{ field: 'enrolledUsers', operator: 'array-contains', value: userId }]
  })

// === COURSE VALIDATION & UTILITIES ===

export const validateCourseData = (courseData: Partial<CursoDataType>): string[] => {
  const errors: string[] = []
  
  if (!courseData.title?.trim()) {
    errors.push('El título del curso es requerido')
  }
  
  if (!courseData.description?.trim()) {
    errors.push('La descripción del curso es requerida')
  }
  
  if (!courseData.level) {
    errors.push('El nivel del curso es requerido')
  }
  
  if (courseData.price && courseData.price < 0) {
    errors.push('El precio no puede ser negativo')
  }
  
  if (courseData.duration && courseData.duration < 0) {
    errors.push('La duración no puede ser negativa')
  }
  
  return errors
}

export const formatCoursePrice = (price: number | undefined): string => {
  if (!price || price === 0) return 'Gratis'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

export const formatCourseDuration = (duration: number | undefined): string => {
  if (!duration) return 'Duración no especificada'
  
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  
  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}min`
}