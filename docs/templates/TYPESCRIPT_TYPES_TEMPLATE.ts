// Template for creating TypeScript type definitions
// Copy this file and replace [Feature] placeholders with your feature name

import { Timestamp } from 'firebase/firestore'

// === BASE INTERFACES ===

// Base entity interface that all entities should extend
interface BaseEntity {
  id: string
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

// Base metadata interface for additional properties
interface BaseMetadata {
  [key: string]: any
}

// === FEATURE ENTITY DEFINITION ===

// Main entity interface
export interface [Feature]DataType extends BaseEntity {
  // Required fields
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft' | 'archived'
  
  // Optional fields
  category?: string
  tags?: string[]
  priority?: 'low' | 'medium' | 'high' | 'critical'
  assignedTo?: string // User ID
  dueDate?: Date | Timestamp
  completedAt?: Date | Timestamp
  
  // Metadata
  metadata?: BaseMetadata
  settings?: [Feature]Settings
  
  // Relations (as IDs)
  parentId?: string
  childrenIds?: string[]
  relatedIds?: string[]
}

// Settings interface for feature-specific configuration
export interface [Feature]Settings {
  isPublic: boolean
  allowComments: boolean
  requireApproval: boolean
  autoArchive?: boolean
  archiveAfterDays?: number
  notifications: {
    onCreate: boolean
    onUpdate: boolean
    onComplete: boolean
  }
}

// === FORM DATA TYPES ===

// For creating new items (excludes auto-generated fields)
export type Create[Feature]Data = Omit<[Feature]DataType, 'id' | 'createdAt' | 'updatedAt'>

// For updating existing items (all fields optional except critical ones)
export type Update[Feature]Data = Partial<Omit<[Feature]DataType, 'id' | 'createdAt'>> & {
  updatedAt?: Date | Timestamp
}

// For form validation (includes only user-editable fields)
export type [Feature]FormData = {
  name: string
  description: string
  status: [Feature]DataType['status']
  category?: string
  tags?: string[]
  priority?: [Feature]DataType['priority']
  assignedTo?: string
  dueDate?: Date
  settings?: Partial<[Feature]Settings>
}

// === API RESPONSE TYPES ===

// Single item response
export interface [Feature]Response {
  data: [Feature]DataType
  message: string
  success: boolean
  timestamp: Date
}

// List response with pagination
export interface [Feature]ListResponse {
  data: [Feature]DataType[]
  pagination: PaginationMetadata
  filters?: FilterMetadata
  message: string
  success: boolean
  timestamp: Date
}

// Error response
export interface [Feature]ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
  success: false
  timestamp: Date
}

// === UTILITY TYPES ===

// Pagination metadata
export interface PaginationMetadata {
  total: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor?: string
  previousCursor?: string
}

// Filter metadata
export interface FilterMetadata {
  appliedFilters: Record<string, any>
  availableFilters: FilterOption[]
  resultCount: number
}

export interface FilterOption {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'select'
  options?: { value: string; label: string }[]
}

// === COMPONENT PROP TYPES ===

// Base component props
export interface Base[Feature]Props {
  className?: string
  'data-testid'?: string
}

// List component props
export interface [Feature]ListProps extends Base[Feature]Props {
  items: [Feature]DataType[]
  loading?: boolean
  error?: string | null
  variant?: 'grid' | 'list' | 'table'
  
  // Event handlers
  onEdit?: (item: [Feature]DataType) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onSelect?: (ids: string[]) => void
  onRefresh?: () => void
  
  // Configuration
  showActions?: boolean
  selectable?: boolean
  sortable?: boolean
  filterable?: boolean
}

// Card component props
export interface [Feature]CardProps extends Base[Feature]Props {
  item: [Feature]DataType
  variant?: 'default' | 'compact' | 'detailed'
  showStatus?: boolean
  showMetadata?: boolean
  
  // Event handlers
  onEdit?: (item: [Feature]DataType) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onClick?: (item: [Feature]DataType) => void
}

// Form component props
export interface [Feature]FormProps extends Base[Feature]Props {
  initialData?: Partial<[Feature]FormData>
  mode: 'create' | 'edit' | 'view'
  
  // Event handlers
  onSubmit: (data: [Feature]FormData) => Promise<void>
  onCancel: () => void
  onChange?: (data: Partial<[Feature]FormData>) => void
  
  // State
  isLoading?: boolean
  isDisabled?: boolean
  
  // Configuration
  showAdvanced?: boolean
  requiredFields?: (keyof [Feature]FormData)[]
}

// Detail/View component props
export interface [Feature]DetailProps extends Base[Feature]Props {
  item: [Feature]DataType
  isEditing?: boolean
  showRelated?: boolean
  
  // Event handlers
  onEdit?: () => void
  onSave?: (data: Update[Feature]Data) => Promise<void>
  onCancel?: () => void
  onDelete?: (id: string) => void
  
  // State
  isLoading?: boolean
}

// === HOOK RETURN TYPES ===

// Query hook return type
export interface [Feature]QueryResult {
  data: [Feature]DataType[] | null
  item: [Feature]DataType | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isStale: boolean
}

// Mutation hook return type
export interface [Feature]MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>
  data: TData | null
  loading: boolean
  error: Error | null
  reset: () => void
  isSuccess: boolean
  isError: boolean
}

// === FILTER AND SEARCH TYPES ===

// Filter options for queries
export interface [Feature]FilterOptions {
  status?: [Feature]DataType['status'] | [Feature]DataType['status'][]
  category?: string | string[]
  priority?: [Feature]DataType['priority'] | [Feature]DataType['priority'][]
  assignedTo?: string | string[]
  tags?: string | string[]
  
  // Date filters
  createdAfter?: Date
  createdBefore?: Date
  dueAfter?: Date
  dueBefore?: Date
  
  // Text search
  search?: string
  searchFields?: (keyof [Feature]DataType)[]
  
  // Advanced filters
  hasParent?: boolean
  hasChildren?: boolean
  isCompleted?: boolean
}

// Sort options
export interface [Feature]SortOptions {
  field: keyof [Feature]DataType
  direction: 'asc' | 'desc'
}

// Search configuration
export interface [Feature]SearchConfig {
  query: string
  fields: (keyof [Feature]DataType)[]
  fuzzy: boolean
  caseSensitive: boolean
  limit?: number
}

// === VALIDATION SCHEMAS ===
// These would typically be used with Zod or similar validation library

export interface [Feature]ValidationRules {
  name: {
    required: true
    minLength: 2
    maxLength: 100
  }
  description: {
    required: false
    maxLength: 1000
  }
  status: {
    required: true
    enum: ['active', 'inactive', 'draft', 'archived']
  }
  category: {
    required: false
    maxLength: 50
  }
  tags: {
    required: false
    maxItems: 10
    itemMaxLength: 30
  }
  priority: {
    required: false
    enum: ['low', 'medium', 'high', 'critical']
  }
  dueDate: {
    required: false
    futureDate: true
  }
}

// === ANALYTICS AND REPORTING TYPES ===

// Analytics data
export interface [Feature]Analytics {
  totalCount: number
  statusDistribution: Record<[Feature]DataType['status'], number>
  categoryDistribution: Record<string, number>
  priorityDistribution: Record<string, number>
  completionRate: number
  averageCompletionTime: number
  trendsOverTime: {
    date: string
    created: number
    completed: number
    active: number
  }[]
}

// Report configuration
export interface [Feature]ReportConfig {
  dateRange: {
    start: Date
    end: Date
  }
  groupBy: 'day' | 'week' | 'month' | 'year'
  includeMetrics: ('count' | 'completion' | 'performance')[]
  filters?: [Feature]FilterOptions
  format: 'json' | 'csv' | 'pdf'
}

// === ADVANCED UTILITY TYPES ===

// Make specific fields required
export type Require[Feature]Fields<T extends keyof [Feature]DataType> = [Feature]DataType & Required<Pick<[Feature]DataType, T>>

// Make specific fields optional
export type Optional[Feature]Fields<T extends keyof [Feature]DataType> = Omit<[Feature]DataType, T> & Partial<Pick<[Feature]DataType, T>>

// Pick only specific fields
export type [Feature]Summary = Pick<[Feature]DataType, 'id' | 'name' | 'status' | 'createdAt'>

// Omit sensitive fields for public API
export type Public[Feature]Data = Omit<[Feature]DataType, 'metadata' | 'settings'>

// For audit logs
export type [Feature]AuditLog = {
  id: string
  entityId: string
  entityType: '[feature]'
  action: 'create' | 'update' | 'delete' | 'view'
  userId: string
  timestamp: Date
  changes?: {
    field: keyof [Feature]DataType
    oldValue: any
    newValue: any
  }[]
  metadata?: Record<string, any>
}

// === DISCRIMINATED UNION TYPES ===

// For handling different states
export type [Feature]State =
  | { state: 'loading'; data: null; error: null }
  | { state: 'success'; data: [Feature]DataType[]; error: null }
  | { state: 'error'; data: null; error: string }
  | { state: 'empty'; data: []; error: null }

// For handling different operations
export type [Feature]Operation =
  | { type: 'create'; payload: Create[Feature]Data }
  | { type: 'update'; payload: { id: string; data: Update[Feature]Data } }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'bulk_update'; payload: { ids: string[]; data: Update[Feature]Data } }
  | { type: 'bulk_delete'; payload: { ids: string[] } }

// === EXPORT ALL TYPES ===
export type {
  // Main entity
  [Feature]DataType as default,
  
  // CRUD types
  Create[Feature]Data,
  Update[Feature]Data,
  [Feature]FormData,
  
  // API types
  [Feature]Response,
  [Feature]ListResponse,
  [Feature]ErrorResponse,
  
  // Component types
  [Feature]ListProps,
  [Feature]CardProps,
  [Feature]FormProps,
  [Feature]DetailProps,
  
  // Hook types
  [Feature]QueryResult,
  [Feature]MutationResult,
  
  // Filter and search
  [Feature]FilterOptions,
  [Feature]SortOptions,
  [Feature]SearchConfig,
  
  // Analytics
  [Feature]Analytics,
  [Feature]ReportConfig,
  
  // Utility types
  [Feature]Summary,
  Public[Feature]Data,
  [Feature]AuditLog,
  [Feature]State,
  [Feature]Operation,
}

/* 
USAGE EXAMPLES:

// Entity definition
const [feature]: [Feature]DataType = {
  id: 'feature-1',
  name: 'Sample Feature',
  description: 'A sample feature for demonstration',
  status: 'active',
  category: 'development',
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    isPublic: true,
    allowComments: true,
    requireApproval: false,
    notifications: {
      onCreate: true,
      onUpdate: false,
      onComplete: true,
    }
  }
}

// Form data
const formData: [Feature]FormData = {
  name: 'New Feature',
  description: 'Description here',
  status: 'draft',
  priority: 'medium'
}

// Component props
const listProps: [Feature]ListProps = {
  items: [[feature]],
  loading: false,
  variant: 'grid',
  onEdit: (item) => console.log('Edit:', item.id),
  onDelete: (id) => console.log('Delete:', id),
}

// Filter options
const filters: [Feature]FilterOptions = {
  status: ['active', 'draft'],
  priority: 'high',
  createdAfter: new Date('2024-01-01'),
  search: 'typescript'
}

// Utility types
const summary: [Feature]Summary = {
  id: [feature].id,
  name: [feature].name,
  status: [feature].status,
  createdAt: [feature].createdAt
}

*/