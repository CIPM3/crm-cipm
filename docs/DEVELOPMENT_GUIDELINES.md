# Development Guidelines

Comprehensive development guidelines for the Next.js 14 CRM system with Firebase, TanStack Query, and Radix UI. This document provides actionable best practices, concrete examples, and templates for consistent development across the entire system.

## Table of Contents

- [1. API Integration Best Practices](#1-api-integration-best-practices)
- [2. Hook Pattern Guidelines](#2-hook-pattern-guidelines)
- [3. TypeScript Best Practices](#3-typescript-best-practices)
- [4. Component Structure Guidelines](#4-component-structure-guidelines)
- [5. Data Fetching Guidelines](#5-data-fetching-guidelines)
- [6. Error Handling Patterns](#6-error-handling-patterns)
- [7. Performance Optimization](#7-performance-optimization)
- [8. Code Quality Standards](#8-code-quality-standards)
- [9. Testing Strategies](#9-testing-strategies)
- [10. Development Workflow](#10-development-workflow)

---

## 1. API Integration Best Practices

All Firebase operations must use the centralized service layer in `/lib/firebaseService.ts`. Never use Firebase SDK methods directly in components or hooks.

### ✅ Core Principles

1. **Centralized Service Layer**: All Firebase operations go through `firebaseService.ts`
2. **Type Safety**: Use TypeScript interfaces for all data operations
3. **Error Handling**: Leverage `FirebaseServiceError` for consistent error management
4. **Performance**: Utilize advanced querying and pagination features

### 📋 API Service Template

When creating new API modules, follow this structure:

```typescript
// api/[Feature]/index.ts
import { 
  fetchItems, 
  fetchItem, 
  addItem, 
  updateItem, 
  deleteItem,
  type QueryOptions 
} from '@/lib/firebaseService'
import { FeatureDataType } from '@/types'

// === COLLECTION NAME ===
const COLLECTION_NAME = 'FeatureName' // Use constants.ts

// === READ OPERATIONS ===
export const getAllFeatures = (options?: QueryOptions) => 
  fetchItems<FeatureDataType>(COLLECTION_NAME, options)

export const getFeatureById = (id: string) => 
  fetchItem<FeatureDataType>(COLLECTION_NAME, id)

// === WRITE OPERATIONS ===
export const createFeature = (data: Omit<FeatureDataType, 'id'>) => 
  addItem(COLLECTION_NAME, data)

export const updateFeature = (id: string, data: Partial<FeatureDataType>) => 
  updateItem(COLLECTION_NAME, id, data)

export const deleteFeature = (id: string) => 
  deleteItem(COLLECTION_NAME, id)

// === ADVANCED QUERIES ===
export const getActiveFeatures = () => 
  fetchItems<FeatureDataType>(COLLECTION_NAME, {
    where: [{ field: 'status', operator: '==', value: 'active' }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

export const getFeaturesWithPagination = (limit: number = 10, cursor?: any) =>
  fetchItems<FeatureDataType>(COLLECTION_NAME, {
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit,
    ...(cursor && { startAfter: cursor })
  })
```

### 🛠️ Advanced Querying Examples

```typescript
// Complex filtering with multiple conditions
export const getFilteredCourses = async (filters: {
  instructor?: string;
  level?: string;
  status?: string;
  minPrice?: number;
}) => {
  const whereConditions: Array<{ field: string; operator: any; value: any }> = []
  
  if (filters.instructor) {
    whereConditions.push({ field: 'instructorId', operator: '==', value: filters.instructor })
  }
  if (filters.level) {
    whereConditions.push({ field: 'level', operator: '==', value: filters.level })
  }
  if (filters.status) {
    whereConditions.push({ field: 'status', operator: '==', value: filters.status })
  }
  if (filters.minPrice) {
    whereConditions.push({ field: 'price', operator: '>=', value: filters.minPrice })
  }

  return fetchItems<CursoDataType>('cursos', {
    where: whereConditions,
    orderBy: [{ field: 'title', direction: 'asc' }],
    limit: 50
  })
}

// Pagination with metadata
export const getCoursesPage = async (pageSize: number = 10, lastDoc?: any) => {
  return fetchItemsPaginated<CursoDataType>('cursos', {
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit: pageSize,
    ...(lastDoc && { startAfter: lastDoc })
  })
}
```

### ⚠️ Common Mistakes to Avoid

```typescript
// ❌ DON'T: Direct Firebase usage
import { collection, getDocs } from 'firebase/firestore'
const coursesRef = collection(db, 'cursos')
const snapshot = await getDocs(coursesRef)

// ✅ DO: Use centralized service
import { getAllCursos } from '@/api/Cursos'
const courses = await getAllCursos()

// ❌ DON'T: Inconsistent error handling
try {
  const data = await someFirebaseCall()
} catch (error) {
  console.log(error) // Generic error handling
}

// ✅ DO: Standardized error handling
try {
  const data = await createCourse(courseData)
} catch (error) {
  if (error instanceof FirebaseServiceError) {
    // Handle specific Firebase errors
    switch (error.code) {
      case 'not-found':
        // Handle not found
        break;
      case 'permission-denied':
        // Handle permissions
        break;
    }
  }
}
```

---

## 2. Hook Pattern Guidelines

All custom hooks must follow standardized patterns for consistency, type safety, and maintainability.

### ✅ Core Principles

1. **Consistent Return Signatures**: Use `StandardMutationReturn` and `StandardQueryReturn`
2. **Error Handling**: Always return `FirebaseServiceError | null`
3. **Loading States**: Provide consistent loading indicators
4. **Reset Functionality**: Include reset methods for state cleanup

### 📋 Hook Templates

#### Mutation Hook Template

```typescript
// hooks/[feature]/useCreate[Feature].ts
import { useStandardizedMutation, StandardMutationReturn } from '@/hooks/core/useStandardizedHook'
import { create[Feature] } from '@/api/[Feature]'
import { [Feature]DataType } from '@/types'

export const useCreate[Feature] = (): StandardMutationReturn<
  { id: string }, 
  Omit<[Feature]DataType, 'id'>
> => {
  return useStandardizedMutation(async (data: Omit<[Feature]DataType, 'id'>) => {
    return await create[Feature](data)
  })
}

// Usage example:
// const createMutation = useCreate[Feature]()
// await createMutation.mutate(newData)
```

#### Query Hook Template

```typescript
// hooks/[feature]/useGet[Feature]s.ts
import { useEffect } from 'react'
import { useStandardizedQuery, StandardQueryReturn } from '@/hooks/core/useStandardizedHook'
import { getAll[Feature]s } from '@/api/[Feature]'
import { [Feature]DataType } from '@/types'

export const useGet[Feature]s = (): StandardQueryReturn<[Feature]DataType[]> => {
  const queryResult = useStandardizedQuery<[Feature]DataType[]>(
    () => getAll[Feature]s()
  )
  
  // Auto-fetch on mount
  useEffect(() => {
    queryResult.refetch()
  }, [])

  return queryResult
}

// Usage example:
// const { data, loading, error } = useGet[Feature]s()
```

#### TanStack Query Integration Hook

```typescript
// hooks/[feature]/useQuery[Feature]s.ts - For TanStack Query integration
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { getAll[Feature]s, create[Feature], update[Feature], delete[Feature] } from '@/api/[Feature]'
import { [Feature]DataType } from '@/types'

// Query hook
export const useQuery[Feature]s = (filters?: { status?: string }) => {
  return useQuery({
    queryKey: queryKeys.[feature]s(filters),
    queryFn: () => getAll[Feature]s(filters ? { 
      where: [{ field: 'status', operator: '==', value: filters.status }] 
    } : undefined),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  })
}

// Mutation hooks with cache invalidation
export const useCreate[Feature] = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: create[Feature],
    onSuccess: () => {
      getInvalidationKeys.on[Feature]Create().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}

export const useUpdate[Feature] = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<[Feature]DataType> }) => 
      update[Feature](id, data),
    onSuccess: (_, { id }) => {
      getInvalidationKeys.on[Feature]Update(id).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
```

### 🔧 Advanced Hook Patterns

#### Optimistic Updates Hook

```typescript
export const useOptimisticUpdate[Feature] = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<[Feature]DataType> }) => 
      update[Feature](id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.[feature]s() })
      
      const previousData = queryClient.getQueryData<[Feature]DataType[]>(queryKeys.[feature]s())
      
      if (previousData) {
        queryClient.setQueryData<[Feature]DataType[]>(
          queryKeys.[feature]s(),
          previousData.map(item => item.id === id ? { ...item, ...data } : item)
        )
      }
      
      return { previousData }
    },
    
    // Rollback on error
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.[feature]s(), context.previousData)
      }
    },
    
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.[feature]s() })
    },
  })
}
```

#### Infinite Query Hook

```typescript
export const useInfinite[Feature]s = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.[feature]s(filters),
    queryFn: ({ pageParam }) => getAll[Feature]s({
      ...filters,
      limit: 10,
      ...(pageParam && { startAfter: pageParam })
    }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPageCursor : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}
```

### ⚠️ Hook Anti-Patterns

```typescript
// ❌ DON'T: Inconsistent return signatures
export const useBadHook = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  // Missing error state, inconsistent naming
  return { data, loading }
}

// ✅ DO: Use standardized patterns
export const useGoodHook = (): StandardQueryReturn<DataType> => {
  return useStandardizedQuery(() => fetchData())
}

// ❌ DON'T: Mixed concerns in hooks
export const useMessyHook = () => {
  // Don't mix UI logic with data fetching
  const [modalOpen, setModalOpen] = useState(false)
  const [data, setData] = useState(null)
  // ... complex UI state management mixed with API calls
}

// ✅ DO: Separate concerns
export const useDataHook = () => {
  return useStandardizedQuery(() => fetchData())
}
export const useModalHook = () => {
  const [isOpen, setIsOpen] = useState(false)
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }
}
```

---

## 3. TypeScript Best Practices

Strict TypeScript usage with centralized type definitions and consistent patterns across the CRM system.

### ✅ Core Principles

1. **Centralized Types**: All types defined in `/types/index.ts`
2. **Strict Mode**: Use strict TypeScript configuration
3. **Generic Patterns**: Leverage generics for reusable components
4. **Utility Types**: Use built-in and custom utility types

### 📋 Type Definition Patterns

#### Entity Type Template

```typescript
// types/index.ts - Base entity interface
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Feature-specific entity
export interface FeatureDataType extends BaseEntity {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  metadata?: Record<string, any>;
}

// Form data types (without auto-generated fields)
export type CreateFeatureData = Omit<FeatureDataType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFeatureData = Partial<CreateFeatureData>;

// API response types
export interface FeatureResponse {
  data: FeatureDataType;
  message: string;
  success: boolean;
}

export interface FeatureListResponse {
  data: FeatureDataType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}
```

#### Form Validation Types

```typescript
// Form validation with Zod/Yup integration
import * as z from 'zod';

export const FeatureSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  metadata: z.record(z.any()).optional(),
});

export type FeatureFormData = z.infer<typeof FeatureSchema>;

// React Hook Form integration
export interface FeatureFormProps {
  initialData?: Partial<FeatureFormData>;
  onSubmit: (data: FeatureFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
```

#### Component Prop Types

```typescript
// Generic component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// List component props
export interface FeatureListProps extends BaseComponentProps {
  features: FeatureDataType[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (feature: FeatureDataType) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

// Detail component props
export interface FeatureDetailProps extends BaseComponentProps {
  feature: FeatureDataType;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: UpdateFeatureData) => Promise<void>;
  onCancel?: () => void;
}
```

### 🔧 Advanced TypeScript Patterns

#### Generic Hook Types

```typescript
// Generic types for standardized hooks
export interface StandardHookConfig<TData, TVariables = void> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: FirebaseServiceError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: FirebaseServiceError | null, variables: TVariables) => void;
}

export interface OptimisticUpdateConfig<TData> {
  updateFn: (previousData: TData[], variables: any) => TData[];
  revertFn: (data: TData[], variables: any) => TData[];
}
```

#### Utility Types

```typescript
// Custom utility types for the CRM system
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// API operation types
export type CreatePayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePayload<T> = Partial<CreatePayload<T>>;

// Component state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: FirebaseServiceError | null;
  state: LoadingState;
};

// Filter and pagination types
export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: { start: Date; end: Date };
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

#### Discriminated Union Types

```typescript
// For handling different content types
export type ContentType =
  | {
      type: 'video';
      url: string;
      duration: number;
      thumbnail?: string;
    }
  | {
      type: 'document';
      url: string;
      fileSize: number;
      mimeType: string;
    }
  | {
      type: 'quiz';
      questions: QuestionType[];
      timeLimit?: number;
    };

// For handling different user roles
export type UserRole =
  | {
      role: 'admin';
      permissions: AdminPermissions;
    }
  | {
      role: 'instructor';
      specialties: string[];
      schedule: ScheduleType;
    }
  | {
      role: 'student';
      enrollments: string[];
      progress: ProgressType;
    };
```

### ⚠️ TypeScript Anti-Patterns

```typescript
// ❌ DON'T: Use 'any' type
export interface BadInterface {
  data: any; // Avoid any
  config: any;
}

// ✅ DO: Use specific types or generics
export interface GoodInterface<T> {
  data: T;
  config: ConfigType;
}

// ❌ DON'T: Inline complex types
export const Component = ({ 
  user 
}: { 
  user: { 
    id: string; 
    name: string; 
    email: string; 
    permissions: { read: boolean; write: boolean } 
  } 
}) => {
  // Complex inline type
}

// ✅ DO: Define reusable interfaces
interface User {
  id: string;
  name: string;
  email: string;
  permissions: UserPermissions;
}

export const Component = ({ user }: { user: User }) => {
  // Clean, reusable type
}

// ❌ DON'T: Ignore null/undefined handling
export const processData = (data: DataType) => {
  return data.property.nestedProperty; // Potential runtime error
}

// ✅ DO: Handle optional chaining and null checks
export const processData = (data: DataType | null) => {
  return data?.property?.nestedProperty ?? 'default';
}
```

---

## 4. Component Structure Guidelines

Consistent component organization using Radix UI primitives with accessibility-first approach and shadcn/ui integration.

### ✅ Core Principles

1. **Radix UI Foundation**: Use Radix primitives for accessibility
2. **shadcn/ui Integration**: Build upon shadcn/ui components
3. **Composition Pattern**: Favor composition over inheritance
4. **Consistent File Structure**: Follow established naming conventions

### 📋 Component Architecture

#### Directory Structure

```
components/
├── ui/                     # shadcn/ui components (Radix + Tailwind)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   └── table.tsx
├── feature/                # Feature-specific components
│   ├── FeatureList.tsx
│   ├── FeatureCard.tsx
│   ├── FeatureForm.tsx
│   └── index.tsx           # Barrel exports
├── layout/                 # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── form/                   # Reusable form components
│   ├── FormField.tsx
│   ├── FormButton.tsx
│   └── FormValidation.tsx
└── common/                 # Shared utility components
    ├── Loading.tsx
    ├── ErrorBoundary.tsx
    └── EmptyState.tsx
```

#### Base Component Template

```typescript
// components/feature/FeatureCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeatureDataType } from '@/types';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  feature: FeatureDataType;
  variant?: 'default' | 'compact';
  className?: string;
  onEdit?: (feature: FeatureDataType) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  variant = 'default',
  className,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        variant === 'compact' && 'p-4',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{feature.name}</CardTitle>
          <Badge 
            variant={feature.status === 'active' ? 'default' : 'secondary'}
          >
            {feature.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {feature.description}
        </p>
        
        <div className="flex gap-2">
          {onView && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(feature.id)}
            >
              View
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(feature)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(feature.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

#### Form Component with Validation

```typescript
// components/feature/FeatureForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeatureSchema, FeatureFormData } from '@/types';

interface FeatureFormProps {
  initialData?: Partial<FeatureFormData>;
  onSubmit: (data: FeatureFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FeatureForm: React.FC<FeatureFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(FeatureSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'active',
      ...initialData,
    },
  });

  const handleSubmit = async (data: FeatureFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error handling is managed by the parent component
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter feature name" {...field} />
              </FormControl>
              <FormDescription>
                This will be displayed as the feature title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter feature description" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

#### List Component with States

```typescript
// components/feature/FeatureList.tsx
import React from 'react';
import { FeatureCard } from './FeatureCard';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { FeatureDataType } from '@/types';

interface FeatureListProps {
  features: FeatureDataType[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (feature: FeatureDataType) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onRefresh?: () => void;
  variant?: 'grid' | 'list';
}

export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  variant = 'grid',
}) => {
  if (loading) {
    return <Loading message="Loading features..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={onRefresh}
      />
    );
  }

  if (features.length === 0) {
    return (
      <EmptyState
        title="No features found"
        description="Get started by creating your first feature."
      />
    );
  }

  const containerClasses = variant === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'space-y-4';

  return (
    <div className={containerClasses}>
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          variant={variant === 'list' ? 'compact' : 'default'}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};
```

### 🔧 Advanced Component Patterns

#### Compound Component Pattern

```typescript
// components/feature/FeatureManager.tsx
import React, { createContext, useContext, useState } from 'react';

interface FeatureContextType {
  selectedFeatures: string[];
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
}

const FeatureContext = createContext<FeatureContextType | null>(null);

export const FeatureManager = ({ children }: { children: React.ReactNode }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedFeatures([]);

  return (
    <FeatureContext.Provider value={{ selectedFeatures, toggleSelection, clearSelection }}>
      {children}
    </FeatureContext.Provider>
  );
};

// Compound components
FeatureManager.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-4">
    {children}
  </div>
);

FeatureManager.Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2">
    {children}
  </div>
);

FeatureManager.List = FeatureList;

// Hook for accessing context
export const useFeatureSelection = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatureSelection must be used within FeatureManager');
  }
  return context;
};
```

#### Render Props Pattern

```typescript
// components/feature/FeatureProvider.tsx
import React from 'react';
import { useQueryFeatures } from '@/hooks/features/useQueryFeatures';
import { FeatureDataType, FirebaseServiceError } from '@/types';

interface FeatureProviderProps {
  filters?: { status?: string };
  children: (props: {
    features: FeatureDataType[];
    loading: boolean;
    error: FirebaseServiceError | null;
    refetch: () => void;
  }) => React.ReactNode;
}

export const FeatureProvider: React.FC<FeatureProviderProps> = ({
  filters,
  children,
}) => {
  const { data, isLoading, error, refetch } = useQueryFeatures(filters);

  return (
    <>
      {children({
        features: data || [],
        loading: isLoading,
        error: error as FirebaseServiceError | null,
        refetch,
      })}
    </>
  );
};
```

### ⚠️ Component Anti-Patterns

```typescript
// ❌ DON'T: Mix data fetching with UI rendering
const BadComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Direct API calls in components
    fetchData().then(setData);
  }, []);
  
  return <div>...</div>;
};

// ✅ DO: Separate concerns with custom hooks
const GoodComponent = () => {
  const { data, loading, error } = useQueryFeatures();
  
  return <FeatureList features={data} loading={loading} error={error} />;
};

// ❌ DON'T: Deeply nested conditional rendering
const BadRender = () => {
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : data.length > 0 ? (
        data.map(item => (
          <div key={item.id}>
            {item.status === 'active' ? (
              <div>Active item</div>
            ) : (
              <div>Inactive item</div>
            )}
          </div>
        ))
      ) : (
        <div>No data</div>
      )}
    </div>
  );
};

// ✅ DO: Use dedicated state components
const GoodRender = () => {
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (data.length === 0) return <EmptyState />;
  
  return <FeatureList features={data} />;
};
```

---

## 5. Data Fetching Guidelines

Comprehensive data fetching strategies using TanStack Query with intelligent caching, optimistic updates, and performance optimization.

### ✅ Core Principles

1. **TanStack Query Integration**: Use React Query for server state management
2. **Intelligent Caching**: Implement hierarchical query keys for efficient invalidation
3. **Optimistic Updates**: Provide immediate feedback for better UX
4. **Error Boundaries**: Graceful error handling and recovery

### 📋 Query Configuration

#### Base Query Client Setup

```typescript
// providers/QueryProvider.tsx - Enhanced configuration
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Smart retry logic
        if (error?.code === 'auth/unauthorized') return false;
        if (error?.code === 'permission-denied') return false;
        if (error?.code === 'not-found') return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
      // Network-aware settings
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

export { queryClient };
```

#### Query Hook Patterns

```typescript
// hooks/features/useQueryFeatures.ts - Standard query hook
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAllFeatures, getFilteredFeatures } from '@/api/Features';
import { FeatureDataType } from '@/types';

// Basic query
export const useQueryFeatures = (filters?: { status?: string; search?: string }) => {
  return useQuery({
    queryKey: queryKeys.features(filters),
    queryFn: () => filters ? getFilteredFeatures(filters) : getAllFeatures(),
    staleTime: 10 * 60 * 1000,  // 10 minutes for lists
    enabled: true, // Can be controlled by component state
  });
};

// Detail query with dependency
export const useQueryFeature = (id: string) => {
  return useQuery({
    queryKey: queryKeys.feature(id),
    queryFn: () => getFeatureById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 15 * 60 * 1000, // 15 minutes for details
  });
};

// Infinite query for pagination
export const useInfiniteFeatures = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.featuresList(filters),
    queryFn: ({ pageParam }) => getFeaturesPage({
      ...filters,
      cursor: pageParam,
      limit: 10,
    }),
    getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    staleTime: 5 * 60 * 1000,
  });
};
```

#### Mutation Patterns

```typescript
// hooks/features/useMutateFeatures.ts - Standard mutation hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { createFeature, updateFeature, deleteFeature } from '@/api/Features';

export const useCreateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeature,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      getInvalidationKeys.onFeatureCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      // Optimistic update to list
      queryClient.setQueryData<FeatureDataType[]>(
        queryKeys.featuresList(),
        (prev) => prev ? [{ ...variables, id: data.id }, ...prev] : [{ ...variables, id: data.id }]
      );
      
      toast({
        title: 'Success',
        description: 'Feature created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create feature',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeatureDataType> }) =>
      updateFeature(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.feature(id) });
      
      const previousFeature = queryClient.getQueryData<FeatureDataType>(queryKeys.feature(id));
      const previousFeaturesList = queryClient.getQueryData<FeatureDataType[]>(queryKeys.featuresList());
      
      // Optimistic updates
      if (previousFeature) {
        queryClient.setQueryData<FeatureDataType>(
          queryKeys.feature(id),
          { ...previousFeature, ...data }
        );
      }
      
      if (previousFeaturesList) {
        queryClient.setQueryData<FeatureDataType[]>(
          queryKeys.featuresList(),
          previousFeaturesList.map(feature => 
            feature.id === id ? { ...feature, ...data } : feature
          )
        );
      }
      
      return { previousFeature, previousFeaturesList };
    },
    
    onError: (error, variables, context) => {
      // Revert optimistic updates
      if (context?.previousFeature) {
        queryClient.setQueryData(queryKeys.feature(variables.id), context.previousFeature);
      }
      if (context?.previousFeaturesList) {
        queryClient.setQueryData(queryKeys.featuresList(), context.previousFeaturesList);
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to update feature',
        variant: 'destructive',
      });
    },
    
    onSuccess: (_, { id }) => {
      getInvalidationKeys.onFeatureUpdate(id).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      toast({
        title: 'Success',
        description: 'Feature updated successfully',
      });
    },
  });
};
```

### 🔧 Advanced Patterns

#### Dependent Queries

```typescript
// Sequential data loading
export const useFeatureWithDetails = (featureId: string) => {
  // First, get the feature
  const featureQuery = useQueryFeature(featureId);
  
  // Then, get related data based on feature
  const relatedQuery = useQuery({
    queryKey: queryKeys.featureRelated(featureId),
    queryFn: () => getRelatedFeatures(featureQuery.data?.category),
    enabled: !!featureQuery.data?.category, // Only run if feature is loaded
  });
  
  return {
    feature: featureQuery.data,
    related: relatedQuery.data,
    loading: featureQuery.isLoading || relatedQuery.isLoading,
    error: featureQuery.error || relatedQuery.error,
  };
};
```

#### Parallel Queries

```typescript
// Loading multiple resources simultaneously
export const useFeatureDashboard = (featureId: string) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: queryKeys.feature(featureId),
        queryFn: () => getFeatureById(featureId),
      },
      {
        queryKey: queryKeys.featureAnalytics(featureId),
        queryFn: () => getFeatureAnalytics(featureId),
      },
      {
        queryKey: queryKeys.featureComments(featureId),
        queryFn: () => getFeatureComments(featureId),
      },
    ],
  });

  return {
    feature: queries[0].data,
    analytics: queries[1].data,
    comments: queries[2].data,
    loading: queries.some(query => query.isLoading),
    error: queries.find(query => query.error)?.error,
  };
};
```

#### Background Prefetching

```typescript
// Prefetch related data for better UX
export const usePrefetchFeature = () => {
  const queryClient = useQueryClient();

  const prefetchFeature = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.feature(id),
      queryFn: () => getFeatureById(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchRelated = (featureId: string, category: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.featuresByCategory(category),
      queryFn: () => getFeaturesByCategory(category),
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchFeature, prefetchRelated };
};
```

#### Offline Support

```typescript
// Enhanced offline capabilities
export const useOfflineFeatures = () => {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Resume paused mutations
      queryClient.resumePausedMutations();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  return { isOnline };
};
```

### 🚀 Performance Optimization

#### Query Key Factory with Performance Focus

```typescript
// lib/queryKeys.ts - Performance-optimized query keys
export const createQueryKey = (base: string[], ...params: (string | number | object)[]) => {
  return [...base, ...params.map(param => 
    typeof param === 'object' ? JSON.stringify(param) : param
  )] as const;
};

// Memoized query key generators
export const queryKeys = {
  features: (filters?: FilterOptions) => 
    createQueryKey(['features'], filters ? { ...filters } : 'all'),
  
  // Hierarchical keys for efficient invalidation
  feature: (id: string) => createQueryKey(['features', 'detail'], id),
  featureAnalytics: (id: string) => createQueryKey(['features', 'detail', id], 'analytics'),
  featureComments: (id: string) => createQueryKey(['features', 'detail', id], 'comments'),
};
```

#### Smart Cache Management

```typescript
// hooks/core/useCacheManager.ts
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  const clearExpiredCache = useCallback(() => {
    queryClient.getQueryCache().findAll().forEach(query => {
      if (query.isStale()) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }, [queryClient]);

  const preloadCriticalData = useCallback(async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.currentUser(),
        queryFn: getCurrentUser,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.systemConfig(),
        queryFn: getSystemConfig,
      }),
    ]);
  }, [queryClient]);

  return { clearExpiredCache, preloadCriticalData };
};
```

### ⚠️ Data Fetching Anti-Patterns

```typescript
// ❌ DON'T: Fetch data in components directly
const BadComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetchFeatures()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  return <div>...</div>;
};

// ✅ DO: Use TanStack Query hooks
const GoodComponent = () => {
  const { data, isLoading, error } = useQueryFeatures();
  
  return <FeatureList features={data} loading={isLoading} error={error} />;
};

// ❌ DON'T: Manual cache management
const BadMutation = () => {
  const [features, setFeatures] = useState([]);
  
  const addFeature = async (newFeature) => {
    const result = await createFeature(newFeature);
    // Manual state update
    setFeatures(prev => [...prev, result]);
  };
};

// ✅ DO: Let TanStack Query handle cache
const GoodMutation = () => {
  const { mutate } = useCreateFeature(); // Handles cache automatically
  
  return { addFeature: mutate };
};

// ❌ DON'T: Ignore loading and error states
const BadUI = () => {
  const { data } = useQueryFeatures();
  
  return (
    <div>
      {data.map(feature => <div key={feature.id}>{feature.name}</div>)}
    </div>
  );
};

// ✅ DO: Handle all states properly
const GoodUI = () => {
  const { data, isLoading, error } = useQueryFeatures();
  
  if (isLoading) return <Loading />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length) return <EmptyState />;
  
  return (
    <div>
      {data.map(feature => <div key={feature.id}>{feature.name}</div>)}
    </div>
  );
};
```

---

## 6. Error Handling Patterns

### 6.1 Global Error Boundary

```typescript
// components/providers/ErrorBoundary.tsx
import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Reload page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 6.2 Query Error Handling

```typescript
// hooks/core/useServerOptimizedQuery.ts
export function useServerOptimizedQuery<T>({
  queryKey,
  queryFn,
  ...options
}: UseQueryOptions<T>) {
  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount, error: any) => {
      // Don't retry certain error types
      const noRetryErrors = [
        'auth/unauthorized',
        'permission-denied',
        'not-found'
      ]
      
      if (noRetryErrors.some(code => error?.code === code)) {
        return false
      }
      
      return failureCount < 2
    },
    ...options,
  })
}
```

---

## 7. Performance Optimization

### 7.1 Code Splitting

```typescript
// app/admin/cursos/page.tsx
import { lazy, Suspense } from 'react'
import { CursoCardSkeleton } from '@/components/ui/loading-states'

// Lazy load heavy components
const CursoDataTable = lazy(() => import('@/components/table/curso-data-table'))
const CreateCursoDialog = lazy(() => import('@/components/dialog/create-curso-dialog'))

export default function CursosPage() {
  return (
    <div>
      <Suspense fallback={<CursoCardSkeleton />}>
        <CursoDataTable />
      </Suspense>
      
      <Suspense fallback={null}>
        <CreateCursoDialog />
      </Suspense>
    </div>
  )
}
```

### 7.2 Memoization Patterns

```typescript
// Memoize expensive computations
export const useCursoStats = (cursos: CursoDataType[]) => {
  return useMemo(() => {
    return {
      totalCursos: cursos.length,
      publishedCursos: cursos.filter(c => c.published).length,
      averageRating: cursos.reduce((acc, c) => acc + (c.rating || 0), 0) / cursos.length,
      totalEnrollments: cursos.reduce((acc, c) => acc + (c.enrollments || 0), 0),
    }
  }, [cursos])
}

// Memoize callback functions
const [selectedCursos, setSelectedCursos] = useState<string[]>([])

const handleCursoSelect = useCallback((cursoId: string, selected: boolean) => {
  setSelectedCursos(prev => 
    selected 
      ? [...prev, cursoId]
      : prev.filter(id => id !== cursoId)
  )
}, [])
```

---

## 8. Code Quality Standards

### 8.1 Naming Conventions

```typescript
// Files: kebab-case
// curso-data-table.tsx
// create-curso-dialog.tsx

// Components: PascalCase
export function CursoDataTable() {}
export function CreateCursoDialog() {}

// Hooks: camelCase with "use" prefix
export function useCursoMutations() {}
export function useCreateCurso() {}

// Types: PascalCase with descriptive suffix
export interface CursoDataType {}
export interface CreateCursoFormProps {}

// Constants: SCREAMING_SNAKE_CASE
export const FIREBASE_COLLECTIONS = {}
export const QUERY_STALE_TIME = {}
```

### 8.2 Import Organization

```typescript
// 1. React imports
import React, { useState, useCallback, useMemo } from 'react'

// 2. Third-party libraries
import { useQuery, useMutation } from '@tanstack/react-query'
import { z } from 'zod'

// 3. UI components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// 4. Internal components
import { CursoForm } from '@/components/form/curso-form'
import { ErrorState } from '@/components/ui/loading-states'

// 5. Hooks and utilities
import { useCreateCurso } from '@/hooks/queries/useCursos'
import { cn } from '@/lib/utils'

// 6. Types and constants
import { CursoDataType, CreateCursoFormData } from '@/types'
import { queryKeys } from '@/lib/queryKeys'
```

---

## 9. Testing Strategies

### 9.1 Component Testing

```typescript
// __tests__/components/curso-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CursoCard } from '@/components/curso/curso-card'
import { mockCursoData } from '@/test-utils/mocks'

describe('CursoCard', () => {
  const defaultProps = {
    curso: mockCursoData,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders course information correctly', () => {
    render(<CursoCard {...defaultProps} />)
    
    expect(screen.getByText(mockCursoData.titulo)).toBeInTheDocument()
    expect(screen.getByText(mockCursoData.descripcion)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<CursoCard {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Edit'))
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockCursoData.id)
  })
})
```

### 9.2 Hook Testing

```typescript
// __tests__/hooks/useCursos.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateCurso } from '@/hooks/queries/useCursos'
import { createCurso } from '@/lib/firebaseService'

jest.mock('@/lib/firebaseService')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCreateCurso', () => {
  it('creates curso successfully', async () => {
    const mockCreateCurso = createCurso as jest.MockedFunction<typeof createCurso>
    mockCreateCurso.mockResolvedValue({ id: 'new-id' })

    const { result } = renderHook(() => useCreateCurso(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      titulo: 'Test Course',
      descripcion: 'Test Description',
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockCreateCurso).toHaveBeenCalledWith({
      titulo: 'Test Course',
      descripcion: 'Test Description',
    })
  })
})
```

---

## 10. Development Workflow

### 10.1 Git Workflow

```bash
# Feature development workflow
git checkout -b feature/new-feature-name

# Make changes and commit frequently
git add .
git commit -m "feat: add new feature functionality"

# Before pushing, run quality checks
npm run lint
npm run type-check
npm run test

# Push and create PR
git push origin feature/new-feature-name
```

### 10.2 Code Review Checklist

- [ ] **API Integration**: Using centralized Firebase service
- [ ] **Hook Patterns**: Following standard return signature
- [ ] **TypeScript**: All types defined in `/types/index.ts`
- [ ] **Components**: Using Radix UI primitives with shadcn/ui
- [ ] **Data Fetching**: Using TanStack Query with proper cache configuration
- [ ] **Error Handling**: Proper error boundaries and user feedback
- [ ] **Performance**: Memoization and code splitting where appropriate
- [ ] **Code Quality**: Following naming conventions and documentation standards
- [ ] **Testing**: Unit tests for critical functionality

### 10.3 Pre-commit Hooks

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:fix
npm run type-check
npm run test:changed
```

---

## Summary Checklist

Before submitting code, ensure:

- [ ] **API Integration**: Using centralized Firebase service
- [ ] **Hook Patterns**: Following standard return signature
- [ ] **TypeScript**: All types defined in `/types/index.ts`
- [ ] **Components**: Using Radix UI primitives with shadcn/ui
- [ ] **Data Fetching**: Using TanStack Query with proper cache configuration
- [ ] **Error Handling**: Proper error boundaries and user feedback
- [ ] **Performance**: Memoization and code splitting where appropriate
- [ ] **Code Quality**: Following naming conventions and documentation standards
- [ ] **Testing**: Unit tests for critical functionality

These guidelines ensure consistency, maintainability, and performance across the entire CRM system. For additional examples and templates, refer to the `/docs/templates/` directory.