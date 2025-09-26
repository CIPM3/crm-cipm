// Centralized exports for all constants
export * from './collections'
export * from './roles'
export * from './navigation'
export * from './form-values'

// Re-export most commonly used constants for convenience
export { COLLECTIONS, DB_COLLECCTIONS } from './collections'
export { ROLES, ROLES_ARRAY, type UserRole } from './roles'
export { ADMIN_NAVIGATION, ADMIN_NAVS, NAVS } from './navigation'
export { 
  STATUS_VALS, 
  HORARIO_VALS, 
  DIA_VALS, 
  NIVELES_NAVS, 
  SUB_NIVELES_NAVS 
} from './form-values'

// Legacy compatibility exports
export {
  COLLECTION_RELATIONSHIPS,
  COLLECTION_ACCESS_PATTERNS
} from './collections'

export {
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  hasRolePermission,
  getSubordinateRoles
} from './roles'

export {
  getNavigationForRole,
  hasRouteAccess
} from './navigation'