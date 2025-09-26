// Centralized exports for all mock data
export * from './students'
export * from './courses'
export * from './modules'
export * from './enrollments'
export * from './tasks'
export * from './customers'

// Re-export all data arrays for convenience
export { students } from './students'
export { courses } from './courses'
export { modules } from './modules'
export { enrollments } from './enrollments'
export { tasks } from './tasks'
export { customers, deals, users } from './customers'

// Re-export all helper functions
export {
  getStudentById
} from './students'

export {
  getCourseById,
  getCourses
} from './courses'

export {
  getModuleById,
  getModulesByCourseId
} from './modules'

export {
  getEnrollmentById,
  getEnrollmentsByStudentId,
  getEnrollmentsByCourseId
} from './enrollments'

export {
  getTaskById,
  getTasksByRelatedId
} from './tasks'

export {
  getCustomerById,
  getDealsByCustomerId,
  getDealById,
  getUserById
} from './customers'