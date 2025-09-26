import { COLLECTION_ACCESS_PATTERNS } from './collections'

// === USER ROLES & PERMISSIONS SYSTEM ===

/**
 * System roles with hierarchical permissions
 * Each role inherits permissions from lower-level roles
 */
export const ROLES = {
  ADMIN: "admin",
  DEVELOP: "develop",
  INSTRUCTOR: "instructor", 
  FORMACION: "formacion de grupo",
  AGENDADOR: "agendador",
  BASE: "base",
  CLIENTE: "cliente"
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

/**
 * Role hierarchy - higher roles inherit lower role permissions
 */
export const ROLE_HIERARCHY = {
  [ROLES.DEVELOP]: 110,      // Developer - above admin for debugging/maintenance
  [ROLES.ADMIN]: 100,        // Full system access
  [ROLES.INSTRUCTOR]: 80,    // Course delivery and student management
  [ROLES.FORMACION]: 60,     // Group formation and management
  [ROLES.AGENDADOR]: 40,     // Scheduling and trial classes
  [ROLES.BASE]: 20,          // Basic authenticated user
  [ROLES.CLIENTE]: 10        // Course consumption only
} as const

/**
 * Role-based permissions matrix
 */
export const ROLE_PERMISSIONS = {
  [ROLES.DEVELOP]: {
    collections: COLLECTION_ACCESS_PATTERNS.ADMIN,
    routes: ['/admin/**'],
    features: [
      'user-management',
      'course-management', 
      'video-management',
      'system-configuration',
      'analytics',
      'reports',
      'audit-logs'
    ],
    description: 'Developer role with full system administration'
  },
  [ROLES.ADMIN]: {
    collections: COLLECTION_ACCESS_PATTERNS.ADMIN,
    routes: ['/admin/**'],
    features: [
      'user-management',
      'course-management', 
      'video-management',
      'system-configuration',
      'analytics',
      'reports',
      'audit-logs'
    ],
    description: 'Full system administration'
  },
  [ROLES.INSTRUCTOR]: {
    collections: COLLECTION_ACCESS_PATTERNS.INSTRUCTOR,
    routes: ['/admin/clases/**', '/admin/estudiantes/**', '/admin/cursos/**'],
    features: [
      'course-delivery',
      'student-progress',
      'class-scheduling',
      'feedback-management',
      'comment-management',
      'comment-moderation'
    ],
    description: 'Teaching and student management'
  },
  [ROLES.FORMACION]: {
    collections: COLLECTION_ACCESS_PATTERNS.FORMACION || { read: [], write: [], description: 'Group formation' },
    routes: ['/admin/clases/prueba/formacion/**'],
    features: [
      'group-formation',
      'student-classification',
      'group-management'
    ],
    description: 'Student grouping and classification'
  },
  [ROLES.AGENDADOR]: {
    collections: COLLECTION_ACCESS_PATTERNS.AGENDADOR || { read: [], write: [], description: 'Scheduling' },
    routes: ['/admin/clases/prueba/agendador/**'],
    features: [
      'trial-scheduling',
      'calendar-management',
      'instructor-assignment'
    ],
    description: 'Scheduling and calendar management'
  },
  [ROLES.BASE]: {
    collections: { read: [], write: [], description: 'Basic user profile' },
    routes: ['/profile/**'],
    features: ['profile-management'],
    description: 'Authenticated user with basic access'
  },
  [ROLES.CLIENTE]: {
    collections: COLLECTION_ACCESS_PATTERNS.STUDENT,
    routes: ['/cursos/**', '/videos/**'],
    features: [
      'course-consumption',
      'video-viewing',
      'progress-tracking',
      'feedback-submission',
      'comment-creation',
      'comment-interaction'
    ],
    description: 'Course consumption and learning'
  }
} as const

/**
 * Legacy roles array for backward compatibility
 * @deprecated Use ROLES object instead
 */
export const ROLES_ARRAY = ["admin", "instructor", "formacion de grupo", "agendador", "base", "cliente"] as const

/**
 * Check if a role has higher or equal hierarchy than another
 */
export const hasRolePermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Get all roles that have lower hierarchy than the given role
 */
export const getSubordinateRoles = (role: UserRole): UserRole[] => {
  const roleLevel = ROLE_HIERARCHY[role]
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level < roleLevel)
    .map(([roleName]) => roleName as UserRole)
}