// Unified Components Export
// This file exports all optimized, consolidated components

// Comments System - Unified comment components reducing ~2,900 lines to ~400 lines
export { default as UnifiedComments } from '../comments/unified'
export { default as CommentsProvider } from '../comments/unified/CommentsProviderImpl'
export { default as CommentsList } from '../comments/unified/CommentsList'
export { default as CommentItem } from '../comments/unified/CommentItem'
export { default as CommentForm } from '../comments/unified/CommentForm'

// Form System - Unified form components reducing ~1,500 lines to ~300 lines  
export { default as BaseForm } from '../form/unified/BaseForm'
export { default as AgendadoUnifiedForm } from '../form/unified/AgendadoUnifiedForm'
export { 
  InputField, 
  SelectField, 
  DateField, 
  TextareaField, 
  CustomField 
} from '../form/unified/FormField'

// Table System - Unified data table reducing ~500 lines to ~150 lines
export { default as DataTable } from '../table/unified/DataTable'

// Optimized Animations - Lazy loaded motion components
export { default as OptimizedMotion } from '../optimized/OptimizedMotion'

// Type definitions for unified components
export type { CommentsProviderProps } from '../comments/unified/CommentsProvider'
export type { BaseFormProps } from '../form/unified/BaseForm'
export type { TableColumn, TableAction } from '../table/unified/DataTable'