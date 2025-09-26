// lib/utils.ts
// This file has been refactored and modularized for better maintainability
// Functionality has been split into separate focused modules:
// - UI utilities: /lib/ui-utils.ts
// - Navigation: /lib/navigation.ts
// - Mock data: /lib/mock-data/

// Re-export UI utilities (most commonly used)
export { cn } from './ui-utils'

// Re-export navigation data
export { NavClient } from './navigation'

// Re-export all mock data for backward compatibility
export * from './mock-data'

// Legacy compatibility - ensure all original exports are available
export {
  students,
  courses,
  modules,
  enrollments,
  tasks,
  customers,
  deals,
  users,
  getStudentById,
  getCourseById,
  getModuleById,
  getModulesByCourseId,
  getEnrollmentById,
  getEnrollmentsByStudentId,
  getEnrollmentsByCourseId,
  getTaskById,
  getUserById,
  getTasksByRelatedId,
  getCustomerById,
  getDealsByCustomerId,
  getDealById,
  getCourses
} from './mock-data'