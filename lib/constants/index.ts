// === CENTRALIZED CONSTANTS EXPORTS ===

// Re-export all domain-specific constants
export * from './collections'
export * from './roles'
export * from './navigation'
export * from './business'

// Maintain backward compatibility for imports that expect everything from a single file
export {
  COLLECTIONS,
  DB_COLLECCTIONS,
  COLLECTION_RELATIONSHIPS
} from './collections'

export {
  ROLES,
  ROLE_HIERARCHY,
  COLLECTION_ACCESS_PATTERNS,
  ROLE_PERMISSIONS,
  hasRouteAccess,
  ROLES_ARRAY
} from './roles'

export type { UserRole } from './roles'

export {
  ADMIN_NAVIGATION,
  getNavigationForRole,
  NAVS,
  ADMIN_NAVS
} from './navigation'

export {
  STATUS_VALS,
  HORARIO_VALS,
  DIA_VALS,
  NIVELES_NAVS,
  SUB_NIVELES_NAVS
} from './business'