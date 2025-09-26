// lib/constants.ts
// This file has been refactored and modularized for better maintainability
// All functionality has been moved to the /lib/constants/ directory

// Re-export all constants for backward compatibility
export * from './constants/index'

// Legacy exports - these are the original exports from this file
// All functionality is now properly categorized and modularized

// Firebase Collections
export {
  COLLECTIONS,
  DB_COLLECCTIONS,
  COLLECTION_RELATIONSHIPS,
  COLLECTION_ACCESS_PATTERNS
} from './constants/index'

// User Roles & Permissions
export {
  ROLES,
  ROLES_ARRAY,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  hasRolePermission,
  getSubordinateRoles,
  type UserRole
} from './constants/index'

// Navigation
export {
  ADMIN_NAVIGATION,
  ADMIN_NAVS,
  NAVS,
  getNavigationForRole,
  hasRouteAccess
} from './constants/index'

// Form Values and Options
export {
  STATUS_VALS,
  HORARIO_VALS,
  DIA_VALS,
  NIVELES_NAVS,
  SUB_NIVELES_NAVS
} from './constants/index'