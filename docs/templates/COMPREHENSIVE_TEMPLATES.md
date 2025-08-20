# Comprehensive Development Templates

Ready-to-use templates for consistent development across the CRM system.

## Table of Contents

- [1. API Module Template](#1-api-module-template)
- [2. Hook Templates](#2-hook-templates)
- [3. Component Templates](#3-component-templates)
- [4. Form Templates](#4-form-templates)
- [5. Page Templates](#5-page-templates)
- [6. Testing Templates](#6-testing-templates)

---

## 1. API Module Template

### Basic API Module

```typescript
// api/[FeatureName]/index.ts
import { 
  fetchItems, 
  fetchItem, 
  addItem, 
  updateItem, 
  deleteItem,
  type QueryOptions 
} from '@/lib/firebaseService'
import { [FeatureName]DataType } from '@/types'

// === COLLECTION NAME ===
const COLLECTION_NAME = '[featurename]' // from lib/constants.ts

// === READ OPERATIONS ===
export const getAll[FeatureName]s = (options?: QueryOptions) => 
  fetchItems<[FeatureName]DataType>(COLLECTION_NAME, options)

export const get[FeatureName]ById = (id: string) => 
  fetchItem<[FeatureName]DataType>(COLLECTION_NAME, id)

// === WRITE OPERATIONS ===
export const create[FeatureName] = (data: Omit<[FeatureName]DataType, 'id'>) => 
  addItem(COLLECTION_NAME, data)

export const update[FeatureName] = (id: string, data: Partial<[FeatureName]DataType>) => 
  updateItem(COLLECTION_NAME, id, data)

export const delete[FeatureName] = (id: string) => 
  deleteItem(COLLECTION_NAME, id)

// === ADVANCED QUERIES ===
export const getActive[FeatureName]s = () => 
  fetchItems<[FeatureName]DataType>(COLLECTION_NAME, {
    where: [{ field: 'status', operator: '==', value: 'active' }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

export const get[FeatureName]sByCategory = (category: string) =>
  fetchItems<[FeatureName]DataType>(COLLECTION_NAME, {
    where: [{ field: 'category', operator: '==', value: category }],
    orderBy: [{ field: 'name', direction: 'asc' }]
  })

// === PAGINATION ===
export const get[FeatureName]sWithPagination = (limit: number = 10, cursor?: any) =>
  fetchItems<[FeatureName]DataType>(COLLECTION_NAME, {
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit,
    ...(cursor && { startAfter: cursor })
  })
```

---

## 2. Hook Templates

### Query Hook Template

```typescript
// hooks/queries/use[FeatureName]s.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { 
  getAll[FeatureName]s, 
  get[FeatureName]ById,
  create[FeatureName], 
  update[FeatureName], 
  delete[FeatureName] 
} from '@/api/[FeatureName]'
import { [FeatureName]DataType } from '@/types'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback } from 'react'

// === QUERY HOOKS ===

// Get all items with filtering
export const useGet[FeatureName]s = (filters?: { 
  status?: string 
  category?: string 
  search?: string 
}) => {
  const memoizedFilters = useMemo(() => filters, [
    filters?.status, 
    filters?.category, 
    filters?.search
  ])

  return useServerOptimizedQuery({
    queryKey: queryKeys.[featurename]sList(memoizedFilters),
    queryFn: async () => {
      const data = await getAll[FeatureName]s()
      
      // Apply client-side filtering if needed
      if (!memoizedFilters) return data
      
      return data.filter(item => {
        if (memoizedFilters.status && item.status !== memoizedFilters.status) return false
        if (memoizedFilters.category && item.category !== memoizedFilters.category) return false
        if (memoizedFilters.search && !item.name.toLowerCase().includes(memoizedFilters.search.toLowerCase())) return false
        return true
      })
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    select: useCallback((data: ([FeatureName]DataType & { id: string })[]) => {
      return data
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(item => ({
          ...item,
          // Add computed properties
          isActive: item.status === 'active',
          displayName: item.name || 'Unnamed',
        }))
    }, [])
  })
}

// Get single item by ID
export const useGet[FeatureName] = (id: string) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.[featurename](id),
    queryFn: () => get[FeatureName]ById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
    retry: 2,
    select: useCallback((data: [FeatureName]DataType & { id: string }) => ({
      ...data,
      // Add computed properties
      isActive: data.status === 'active',
      canEdit: true, // This would be based on user permissions
      lastUpdated: new Date(data.updatedAt || data.createdAt).toLocaleDateString()
    }), [])
  })
}

// Infinite query for pagination
export const useInfinite[FeatureName]s = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.[featurename]sList(filters),
    queryFn: ({ pageParam }) => get[FeatureName]sWithPagination(10, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPageCursor : undefined
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

// === MUTATION HOOKS ===

// Create mutation with optimistic updates
export const useCreate[FeatureName] = () => {
  return useServerOptimizedMutation<
    { id: string },
    Omit<[FeatureName]DataType, 'id'>
  >({
    mutationFn: async (data) => {
      // Validate data before sending
      if (!data.name?.trim()) {
        throw new Error('Name is required')
      }
      
      return await create[FeatureName](data)
    },
    invalidateQueries: getInvalidationKeys.on[FeatureName]Create(),
    optimisticUpdate: {
      queryKey: queryKeys.[featurename]sList(),
      updater: (oldData: ([FeatureName]DataType & { id: string })[] | undefined, variables) => {
        if (!oldData) return []
        
        const optimisticItem: [FeatureName]DataType & { id: string } = {
          ...variables,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        }
        
        return [optimisticItem, ...oldData]
      }
    },
    onSuccess: async (data, variables) => {
      console.log('[FeatureName] created successfully:', data.id)
    },
    onError: (error, variables) => {
      console.error('Error creating [featurename]:', error, variables)
    }
  })
}

// Update mutation
export const useUpdate[FeatureName] = () => {
  return useServerOptimizedMutation<
    { id: string },
    { id: string; data: Partial<[FeatureName]DataType> }
  >({
    mutationFn: async ({ id, data }) => {
      // Validate updates
      if (data.name !== undefined && !data.name?.trim()) {
        throw new Error('Name cannot be empty')
      }
      
      return await update[FeatureName](id, data)
    },
    optimisticUpdate: {
      queryKey: queryKeys.[featurename]sList(),
      updater: (oldData: ([FeatureName]DataType & { id: string })[] | undefined, { id, data }) => {
        if (!oldData) return []
        
        return oldData.map(item => 
          item.id === id 
            ? { ...item, ...data, updatedAt: new Date().toISOString() }
            : item
        )
      }
    },
    onSuccess: async (result, { id, data }) => {
      // Invalidate related queries
      const invalidationKeys = getInvalidationKeys.on[FeatureName]Update(id)
      
      console.log('[FeatureName] updated successfully:', id)
      
      // Update specific item in cache
      const queryClient = useQueryClient()
      queryClient.setQueryData(queryKeys.[featurename](id), (oldData: any) => {
        if (!oldData) return oldData
        return { ...oldData, ...data, updatedAt: new Date().toISOString() }
      })
    },
    onError: (error, { id }) => {
      console.error('Error updating [featurename]:', error, id)
    }
  })
}

// Delete mutation
export const useDelete[FeatureName] = () => {
  return useServerOptimizedMutation<
    { id: string },
    string
  >({
    mutationFn: async (id) => {
      await delete[FeatureName](id)
      return { id }
    },
    optimisticUpdate: {
      queryKey: queryKeys.[featurename]sList(),
      updater: (oldData: ([FeatureName]DataType & { id: string })[] | undefined, id) => {
        if (!oldData) return []
        return oldData.filter(item => item.id !== id)
      }
    },
    onSuccess: async (data, id) => {
      // Invalidate related queries
      const invalidationKeys = getInvalidationKeys.on[FeatureName]Delete(id)
      
      console.log('[FeatureName] deleted successfully:', id)
      
      // Clean up related cache entries
      const queryClient = useQueryClient()
      queryClient.removeQueries({ queryKey: queryKeys.[featurename](id) })
    },
    onError: (error, id) => {
      console.error('Error deleting [featurename]:', error, id)
    }
  })
}

// === UTILITY HOOKS ===

// Bulk operations hook
export const useBulk[FeatureName]Operations = () => {
  const queryClient = useQueryClient()
  
  const bulkUpdate = useCallback(async (updates: Array<{ id: string; data: Partial<[FeatureName]DataType> }>) => {
    const promises = updates.map(({ id, data }) => update[FeatureName](id, data))
    const results = await Promise.allSettled(promises)
    
    // Invalidate all affected queries
    queryClient.invalidateQueries({ queryKey: queryKeys.[featurename]sList() })
    
    return results
  }, [queryClient])
  
  const bulkDelete = useCallback(async (ids: string[]) => {
    const promises = ids.map(id => delete[FeatureName](id))
    const results = await Promise.allSettled(promises)
    
    // Clean up cache
    ids.forEach(id => {
      queryClient.removeQueries({ queryKey: queryKeys.[featurename](id) })
    })
    queryClient.invalidateQueries({ queryKey: queryKeys.[featurename]sList() })
    
    return results
  }, [queryClient])
  
  return { bulkUpdate, bulkDelete }
}
```

---

## 3. Component Templates

### Base Component Template

```typescript
// components/[featurename]/[FeatureName]Card.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { [FeatureName]DataType } from '@/types'
import { cn } from '@/lib/utils'

interface [FeatureName]CardProps {
  [featurename]: [FeatureName]DataType & { id: string }
  className?: string
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  variant?: 'default' | 'compact'
  showActions?: boolean
}

export function [FeatureName]Card({ 
  [featurename], 
  className,
  onView,
  onEdit,
  onDelete,
  variant = 'default',
  showActions = true
}: [FeatureName]CardProps) {
  const isCompact = variant === 'compact'

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md cursor-pointer',
      isCompact && 'p-4',
      className
    )}>
      <CardHeader className={isCompact ? 'pb-2' : undefined}>
        <div className=\"flex items-center justify-between\">
          <CardTitle className={cn(
            'line-clamp-1',
            isCompact ? 'text-base' : 'text-lg'
          )}>
            {[featurename].name}
          </CardTitle>
          <div className=\"flex items-center gap-2\">
            <Badge 
              variant={[featurename].status === 'active' ? 'default' : 'secondary'}
            >
              {[featurename].status}
            </Badge>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant=\"ghost\" className=\"h-8 w-8 p-0\">
                    <MoreHorizontal className=\"h-4 w-4\" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align=\"end\">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView([featurename].id)}>
                      <Eye className=\"mr-2 h-4 w-4\" />
                      View
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit([featurename].id)}>
                      <Edit className=\"mr-2 h-4 w-4\" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete([featurename].id)}
                      className=\"text-destructive\"
                    >
                      <Trash2 className=\"mr-2 h-4 w-4\" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={isCompact ? 'pt-0' : undefined}>
        <p className=\"text-sm text-muted-foreground line-clamp-2 mb-4\">
          {[featurename].description || 'No description available'}
        </p>
        
        <div className=\"flex items-center justify-between text-xs text-muted-foreground\">
          <span>
            Created: {new Date([featurename].createdAt).toLocaleDateString()}
          </span>
          {[featurename].updatedAt && (
            <span>
              Updated: {new Date([featurename].updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### List Component Template

```typescript
// components/[featurename]/[FeatureName]List.tsx
import React from 'react'
import { [FeatureName]Card } from './[FeatureName]Card'
import { Button } from '@/components/ui/button'
import { Plus, Grid3X3, List } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { [FeatureName]DataType } from '@/types'
import { cn } from '@/lib/utils'

interface [FeatureName]ListProps {
  [featurename]s: ([FeatureName]DataType & { id: string })[]
  loading?: boolean
  error?: string | null
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onCreate?: () => void
  onRefresh?: () => void
  variant?: 'grid' | 'list'
  onVariantChange?: (variant: 'grid' | 'list') => void
  className?: string
}

export function [FeatureName]List({
  [featurename]s,
  loading = false,
  error = null,
  onView,
  onEdit,
  onDelete,
  onCreate,
  onRefresh,
  variant = 'grid',
  onVariantChange,
  className,
}: [FeatureName]ListProps) {
  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className=\"flex items-center justify-between\">
          <div className=\"flex items-center gap-2\">
            <Skeleton className=\"h-4 w-32\" />
            <Skeleton className=\"h-4 w-16\" />
          </div>
          <div className=\"flex gap-2\">
            <Skeleton className=\"h-10 w-20\" />
            <Skeleton className=\"h-10 w-32\" />
          </div>
        </div>
        <div className={cn(
          variant === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        )}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className=\"border rounded-lg p-4 space-y-3\">
              <div className=\"flex items-center justify-between\">
                <Skeleton className=\"h-5 w-32\" />
                <Skeleton className=\"h-5 w-16\" />
              </div>
              <Skeleton className=\"h-4 w-full\" />
              <Skeleton className=\"h-4 w-2/3\" />
              <div className=\"flex justify-between\">
                <Skeleton className=\"h-3 w-20\" />
                <Skeleton className=\"h-3 w-20\" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <Alert variant=\"destructive\">
          <AlertDescription>
            {error}
            {onRefresh && (
              <Button
                variant=\"outline\"
                size=\"sm\"
                className=\"ml-2\"
                onClick={onRefresh}
              >
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Empty state
  if ([featurename]s.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className=\"flex items-center justify-between\">
          <h3 className=\"text-lg font-medium\">No [featurename]s found</h3>
          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className=\"mr-2 h-4 w-4\" />
              Create [FeatureName]
            </Button>
          )}
        </div>
        <div className=\"text-center py-12\">
          <p className=\"text-muted-foreground mb-4\">
            Get started by creating your first [featurename].
          </p>
          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className=\"mr-2 h-4 w-4\" />
              Create [FeatureName]
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className=\"flex items-center justify-between\">
        <div className=\"flex items-center gap-2\">
          <h3 className=\"text-lg font-medium\">[FeatureName]s</h3>
          <span className=\"text-sm text-muted-foreground\">
            ({[featurename]s.length} total)
          </span>
        </div>
        
        <div className=\"flex items-center gap-2\">
          {/* View toggle */}
          {onVariantChange && (
            <div className=\"flex items-center border rounded-md\">
              <Button
                variant={variant === 'grid' ? 'default' : 'ghost'}
                size=\"sm\"
                onClick={() => onVariantChange('grid')}
                className=\"rounded-r-none\"
              >
                <Grid3X3 className=\"h-4 w-4\" />
              </Button>
              <Button
                variant={variant === 'list' ? 'default' : 'ghost'}
                size=\"sm\"
                onClick={() => onVariantChange('list')}
                className=\"rounded-l-none\"
              >
                <List className=\"h-4 w-4\" />
              </Button>
            </div>
          )}
          
          {/* Create button */}
          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className=\"mr-2 h-4 w-4\" />
              Create [FeatureName]
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        variant === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      )}>
        {[featurename]s.map(([featurename]) => (
          <[FeatureName]Card
            key={[featurename].id}
            [featurename]={[featurename]}
            variant={variant === 'list' ? 'compact' : 'default'}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 4. Form Templates

### Form Component Template

```typescript
// components/[featurename]/[FeatureName]Form.tsx
import React from 'react'
import { useForm } from 'react-hook-form'\nimport { zodResolver } from '@hookform/resolvers/zod'\nimport { z } from 'zod'\nimport {\n  Form,\n  FormControl,\n  FormDescription,\n  FormField,\n  FormItem,\n  FormLabel,\n  FormMessage,\n} from '@/components/ui/form'\nimport { Input } from '@/components/ui/input'\nimport { Textarea } from '@/components/ui/textarea'\nimport { Button } from '@/components/ui/button'\nimport {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from '@/components/ui/select'\nimport { Switch } from '@/components/ui/switch'\nimport { [FeatureName]DataType } from '@/types'\n\n// Form schema\nconst [featureName]Schema = z.object({\n  name: z.string().min(2, 'Name must be at least 2 characters'),\n  description: z.string().optional(),\n  category: z.string().min(1, 'Please select a category'),\n  status: z.enum(['active', 'inactive']),\n  isPublic: z.boolean().default(false),\n  metadata: z.record(z.any()).optional(),\n})\n\ntype [FeatureName]FormData = z.infer<typeof [featureName]Schema>\n\ninterface [FeatureName]FormProps {\n  initialData?: Partial<[FeatureName]FormData>\n  onSubmit: (data: [FeatureName]FormData) => Promise<void>\n  onCancel: () => void\n  isLoading?: boolean\n  mode?: 'create' | 'edit'\n}\n\nexport function [FeatureName]Form({\n  initialData,\n  onSubmit,\n  onCancel,\n  isLoading = false,\n  mode = 'create',\n}: [FeatureName]FormProps) {\n  const form = useForm<[FeatureName]FormData>({\n    resolver: zodResolver([featureName]Schema),\n    defaultValues: {\n      name: initialData?.name ?? '',\n      description: initialData?.description ?? '',\n      category: initialData?.category ?? '',\n      status: initialData?.status ?? 'active',\n      isPublic: initialData?.isPublic ?? false,\n      metadata: initialData?.metadata ?? {},\n    },\n  })\n\n  const handleSubmit = async (data: [FeatureName]FormData) => {\n    try {\n      await onSubmit(data)\n      if (mode === 'create') {\n        form.reset()\n      }\n    } catch (error) {\n      // Error handling is managed by the parent component\n      console.error('Form submission error:', error)\n    }\n  }\n\n  return (\n    <Form {...form}>\n      <form onSubmit={form.handleSubmit(handleSubmit)} className=\"space-y-6\">\n        {/* Name Field */}\n        <FormField\n          control={form.control}\n          name=\"name\"\n          render={({ field }) => (\n            <FormItem>\n              <FormLabel>Name *</FormLabel>\n              <FormControl>\n                <Input \n                  placeholder=\"Enter [featurename] name\" \n                  {...field} \n                  disabled={isLoading}\n                />\n              </FormControl>\n              <FormDescription>\n                This will be displayed as the [featurename] title.\n              </FormDescription>\n              <FormMessage />\n            </FormItem>\n          )}\n        />\n\n        {/* Description Field */}\n        <FormField\n          control={form.control}\n          name=\"description\"\n          render={({ field }) => (\n            <FormItem>\n              <FormLabel>Description</FormLabel>\n              <FormControl>\n                <Textarea \n                  placeholder=\"Enter [featurename] description\" \n                  className=\"resize-none\" \n                  rows={3}\n                  {...field} \n                  disabled={isLoading}\n                />\n              </FormControl>\n              <FormDescription>\n                Provide additional details about this [featurename].\n              </FormDescription>\n              <FormMessage />\n            </FormItem>\n          )}\n        />\n\n        {/* Category Field */}\n        <FormField\n          control={form.control}\n          name=\"category\"\n          render={({ field }) => (\n            <FormItem>\n              <FormLabel>Category *</FormLabel>\n              <Select \n                onValueChange={field.onChange} \n                defaultValue={field.value}\n                disabled={isLoading}\n              >\n                <FormControl>\n                  <SelectTrigger>\n                    <SelectValue placeholder=\"Select a category\" />\n                  </SelectTrigger>\n                </FormControl>\n                <SelectContent>\n                  <SelectItem value=\"general\">General</SelectItem>\n                  <SelectItem value=\"education\">Education</SelectItem>\n                  <SelectItem value=\"business\">Business</SelectItem>\n                  <SelectItem value=\"technology\">Technology</SelectItem>\n                </SelectContent>\n              </Select>\n              <FormMessage />\n            </FormItem>\n          )}\n        />\n\n        {/* Status Field */}\n        <FormField\n          control={form.control}\n          name=\"status\"\n          render={({ field }) => (\n            <FormItem>\n              <FormLabel>Status *</FormLabel>\n              <Select \n                onValueChange={field.onChange} \n                defaultValue={field.value}\n                disabled={isLoading}\n              >\n                <FormControl>\n                  <SelectTrigger>\n                    <SelectValue placeholder=\"Select status\" />\n                  </SelectTrigger>\n                </FormControl>\n                <SelectContent>\n                  <SelectItem value=\"active\">Active</SelectItem>\n                  <SelectItem value=\"inactive\">Inactive</SelectItem>\n                </SelectContent>\n              </Select>\n              <FormDescription>\n                Active items are visible to users.\n              </FormDescription>\n              <FormMessage />\n            </FormItem>\n          )}\n        />\n\n        {/* Public Switch */}\n        <FormField\n          control={form.control}\n          name=\"isPublic\"\n          render={({ field }) => (\n            <FormItem className=\"flex flex-row items-center justify-between rounded-lg border p-3\">\n              <div className=\"space-y-0.5\">\n                <FormLabel>Public [FeatureName]</FormLabel>\n                <FormDescription>\n                  Make this [featurename] publicly accessible.\n                </FormDescription>\n              </div>\n              <FormControl>\n                <Switch\n                  checked={field.value}\n                  onCheckedChange={field.onChange}\n                  disabled={isLoading}\n                />\n              </FormControl>\n            </FormItem>\n          )}\n        />\n\n        {/* Form Actions */}\n        <div className=\"flex justify-end gap-3\">\n          <Button \n            type=\"button\" \n            variant=\"outline\" \n            onClick={onCancel}\n            disabled={isLoading}\n          >\n            Cancel\n          </Button>\n          <Button \n            type=\"submit\" \n            disabled={isLoading || !form.formState.isDirty}\n          >\n            {isLoading ? (\n              mode === 'create' ? 'Creating...' : 'Updating...'\n            ) : (\n              mode === 'create' ? 'Create [FeatureName]' : 'Update [FeatureName]'\n            )}\n          </Button>\n        </div>\n      </form>\n    </Form>\n  )\n}\n```\n\n### Dialog Form Template\n\n```typescript\n// components/[featurename]/Create[FeatureName]Dialog.tsx\nimport React, { useState } from 'react'\nimport {\n  Dialog,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from '@/components/ui/dialog'\nimport { Button } from '@/components/ui/button'\nimport { Plus } from 'lucide-react'\nimport { [FeatureName]Form } from './[FeatureName]Form'\nimport { useCreate[FeatureName] } from '@/hooks/queries/use[FeatureName]s'\nimport { toast } from '@/components/ui/use-toast'\nimport { [FeatureName]DataType } from '@/types'\n\ninterface Create[FeatureName]DialogProps {\n  trigger?: React.ReactNode\n  open?: boolean\n  onOpenChange?: (open: boolean) => void\n}\n\nexport function Create[FeatureName]Dialog({ \n  trigger, \n  open: controlledOpen, \n  onOpenChange: controlledOnOpenChange \n}: Create[FeatureName]DialogProps) {\n  const [internalOpen, setInternalOpen] = useState(false)\n  const { mutate: create[FeatureName], isPending } = useCreate[FeatureName]()\n\n  // Use controlled or internal state\n  const isOpen = controlledOpen ?? internalOpen\n  const setIsOpen = controlledOnOpenChange ?? setInternalOpen\n\n  const handleSubmit = async (data: Omit<[FeatureName]DataType, 'id'>) => {\n    try {\n      await create[FeatureName](data)\n      setIsOpen(false)\n      toast({\n        title: 'Success',\n        description: '[FeatureName] created successfully',\n      })\n    } catch (error: any) {\n      toast({\n        title: 'Error',\n        description: error.message || 'Failed to create [featurename]',\n        variant: 'destructive',\n      })\n    }\n  }\n\n  const handleCancel = () => {\n    setIsOpen(false)\n  }\n\n  const defaultTrigger = (\n    <Button>\n      <Plus className=\"mr-2 h-4 w-4\" />\n      Create [FeatureName]\n    </Button>\n  )\n\n  return (\n    <Dialog open={isOpen} onOpenChange={setIsOpen}>\n      {!controlledOpen && (\n        <DialogTrigger asChild>\n          {trigger || defaultTrigger}\n        </DialogTrigger>\n      )}\n      <DialogContent className=\"sm:max-w-[500px] max-h-[80vh] overflow-y-auto\">\n        <DialogHeader>\n          <DialogTitle>Create New [FeatureName]</DialogTitle>\n          <DialogDescription>\n            Add a new [featurename] to the system. Fill in the required information below.\n          </DialogDescription>\n        </DialogHeader>\n        \n        <[FeatureName]Form\n          mode=\"create\"\n          onSubmit={handleSubmit}\n          onCancel={handleCancel}\n          isLoading={isPending}\n        />\n      </DialogContent>\n    </Dialog>\n  )\n}\n```\n\n---\n\n## 5. Page Templates\n\n### Admin Page Template\n\n```typescript\n// app/admin/[featurename]s/page.tsx\nimport React from 'react'\nimport { Metadata } from 'next'\nimport { [FeatureName]Manager } from '@/components/[featurename]/[FeatureName]Manager'\n\nexport const metadata: Metadata = {\n  title: '[FeatureName] Management | CRM System',\n  description: 'Manage [featurename]s in the CRM system',\n}\n\nexport default function [FeatureName]sPage() {\n  return (\n    <div className=\"container mx-auto py-6 space-y-6\">\n      <div className=\"flex items-center justify-between\">\n        <div>\n          <h1 className=\"text-3xl font-bold tracking-tight\">[FeatureName] Management</h1>\n          <p className=\"text-muted-foreground\">\n            Create, edit, and manage [featurename]s in your system.\n          </p>\n        </div>\n      </div>\n      \n      <[FeatureName]Manager />\n    </div>\n  )\n}\n```\n\n### Manager Component Template\n\n```typescript\n// components/[featurename]/[FeatureName]Manager.tsx\nimport React, { useState, useMemo } from 'react'\nimport { [FeatureName]List } from './[FeatureName]List'\nimport { [FeatureName]Filters } from './[FeatureName]Filters'\nimport { Create[FeatureName]Dialog } from './Create[FeatureName]Dialog'\nimport { Edit[FeatureName]Dialog } from './Edit[FeatureName]Dialog'\nimport { Delete[FeatureName]Dialog } from './Delete[FeatureName]Dialog'\nimport { useGet[FeatureName]s } from '@/hooks/queries/use[FeatureName]s'\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'\nimport { [FeatureName]DataType } from '@/types'\n\ntype ViewVariant = 'grid' | 'list'\ntype FilterState = {\n  status?: string\n  category?: string\n  search?: string\n}\n\nexport function [FeatureName]Manager() {\n  // State management\n  const [viewVariant, setViewVariant] = useState<ViewVariant>('grid')\n  const [filters, setFilters] = useState<FilterState>({})\n  const [selected[FeatureName], setSelected[FeatureName]] = useState<([FeatureName]DataType & { id: string }) | null>(null)\n  const [editDialogOpen, setEditDialogOpen] = useState(false)\n  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)\n\n  // Data fetching\n  const { data: [featurename]s = [], isLoading, error, refetch } = useGet[FeatureName]s(filters)\n\n  // Computed values\n  const stats = useMemo(() => {\n    const total = [featurename]s.length\n    const active = [featurename]s.filter(item => item.status === 'active').length\n    const inactive = total - active\n    \n    return { total, active, inactive }\n  }, [[featurename]s])\n\n  // Event handlers\n  const handleView = (id: string) => {\n    // Navigate to detail view or open modal\n    console.log('View [featurename]:', id)\n  }\n\n  const handleEdit = (id: string) => {\n    const [featurename] = [featurename]s.find(item => item.id === id)\n    if ([featurename]) {\n      setSelected[FeatureName]([featurename])\n      setEditDialogOpen(true)\n    }\n  }\n\n  const handleDelete = (id: string) => {\n    const [featurename] = [featurename]s.find(item => item.id === id)\n    if ([featurename]) {\n      setSelected[FeatureName]([featurename])\n      setDeleteDialogOpen(true)\n    }\n  }\n\n  const handleRefresh = () => {\n    refetch()\n  }\n\n  const closeDialogs = () => {\n    setEditDialogOpen(false)\n    setDeleteDialogOpen(false)\n    setSelected[FeatureName](null)\n  }\n\n  return (\n    <div className=\"space-y-6\">\n      {/* Stats Cards */}\n      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n        <Card>\n          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">\n            <CardTitle className=\"text-sm font-medium\">Total [FeatureName]s</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"text-2xl font-bold\">{stats.total}</div>\n            <p className=\"text-xs text-muted-foreground\">\n              All [featurename]s in the system\n            </p>\n          </CardContent>\n        </Card>\n        \n        <Card>\n          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">\n            <CardTitle className=\"text-sm font-medium\">Active</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"text-2xl font-bold text-green-600\">{stats.active}</div>\n            <p className=\"text-xs text-muted-foreground\">\n              Currently active [featurename]s\n            </p>\n          </CardContent>\n        </Card>\n        \n        <Card>\n          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">\n            <CardTitle className=\"text-sm font-medium\">Inactive</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"text-2xl font-bold text-orange-600\">{stats.inactive}</div>\n            <p className=\"text-xs text-muted-foreground\">\n              Currently inactive [featurename]s\n            </p>\n          </CardContent>\n        </Card>\n      </div>\n\n      {/* Main Content */}\n      <Card>\n        <CardHeader>\n          <CardTitle>[FeatureName] Management</CardTitle>\n          <CardDescription>\n            Manage your [featurename]s with filters, search, and bulk operations.\n          </CardDescription>\n        </CardHeader>\n        <CardContent>\n          <Tabs defaultValue=\"all\" className=\"w-full\">\n            <TabsList className=\"grid w-full grid-cols-4\">\n              <TabsTrigger value=\"all\">All ({stats.total})</TabsTrigger>\n              <TabsTrigger value=\"active\">Active ({stats.active})</TabsTrigger>\n              <TabsTrigger value=\"inactive\">Inactive ({stats.inactive})</TabsTrigger>\n              <TabsTrigger value=\"archived\">Archived</TabsTrigger>\n            </TabsList>\n            \n            <TabsContent value=\"all\" className=\"space-y-4\">\n              {/* Filters */}\n              <[FeatureName]Filters\n                filters={filters}\n                onFiltersChange={setFilters}\n                onReset={() => setFilters({})}\n              />\n              \n              {/* List */}\n              <[FeatureName]List\n                [featurename]s={[featurename]s}\n                loading={isLoading}\n                error={error?.message || null}\n                onView={handleView}\n                onEdit={handleEdit}\n                onDelete={handleDelete}\n                onCreate={() => {}} // Handled by dialog trigger\n                onRefresh={handleRefresh}\n                variant={viewVariant}\n                onVariantChange={setViewVariant}\n              />\n            </TabsContent>\n            \n            <TabsContent value=\"active\" className=\"space-y-4\">\n              <[FeatureName]List\n                [featurename]s={[featurename]s.filter(item => item.status === 'active')}\n                loading={isLoading}\n                error={error?.message || null}\n                onView={handleView}\n                onEdit={handleEdit}\n                onDelete={handleDelete}\n                variant={viewVariant}\n                onVariantChange={setViewVariant}\n              />\n            </TabsContent>\n            \n            <TabsContent value=\"inactive\" className=\"space-y-4\">\n              <[FeatureName]List\n                [featurename]s={[featurename]s.filter(item => item.status === 'inactive')}\n                loading={isLoading}\n                error={error?.message || null}\n                onView={handleView}\n                onEdit={handleEdit}\n                onDelete={handleDelete}\n                variant={viewVariant}\n                onVariantChange={setViewVariant}\n              />\n            </TabsContent>\n            \n            <TabsContent value=\"archived\">\n              <div className=\"text-center py-8 text-muted-foreground\">\n                Archived [featurename]s feature coming soon.\n              </div>\n            </TabsContent>\n          </Tabs>\n        </CardContent>\n      </Card>\n\n      {/* Dialogs */}\n      <Create[FeatureName]Dialog />\n      \n      {selected[FeatureName] && (\n        <>\n          <Edit[FeatureName]Dialog\n            [featurename]={selected[FeatureName]}\n            open={editDialogOpen}\n            onOpenChange={setEditDialogOpen}\n            onClose={closeDialogs}\n          />\n          \n          <Delete[FeatureName]Dialog\n            [featurename]={selected[FeatureName]}\n            open={deleteDialogOpen}\n            onOpenChange={setDeleteDialogOpen}\n            onClose={closeDialogs}\n          />\n        </>\n      )}\n    </div>\n  )\n}\n```\n\n---\n\n## 6. Testing Templates\n\n### Component Test Template\n\n```typescript\n// __tests__/components/[featurename]/[FeatureName]Card.test.tsx\nimport { render, screen, fireEvent, waitFor } from '@testing-library/react'\nimport { [FeatureName]Card } from '@/components/[featurename]/[FeatureName]Card'\nimport { [FeatureName]DataType } from '@/types'\n\nconst mock[FeatureName]: [FeatureName]DataType & { id: string } = {\n  id: 'test-id',\n  name: 'Test [FeatureName]',\n  description: 'Test description',\n  status: 'active',\n  category: 'general',\n  createdAt: '2023-01-01T00:00:00.000Z',\n  updatedAt: '2023-01-01T00:00:00.000Z',\n}\n\ndescribe('[FeatureName]Card', () => {\n  const defaultProps = {\n    [featurename]: mock[FeatureName],\n    onView: jest.fn(),\n    onEdit: jest.fn(),\n    onDelete: jest.fn(),\n  }\n\n  beforeEach(() => {\n    jest.clearAllMocks()\n  })\n\n  describe('Rendering', () => {\n    it('renders [featurename] information correctly', () => {\n      render(<[FeatureName]Card {...defaultProps} />)\n      \n      expect(screen.getByText(mock[FeatureName].name)).toBeInTheDocument()\n      expect(screen.getByText(mock[FeatureName].description)).toBeInTheDocument()\n      expect(screen.getByText(mock[FeatureName].status)).toBeInTheDocument()\n    })\n\n    it('renders with compact variant', () => {\n      render(<[FeatureName]Card {...defaultProps} variant=\"compact\" />)\n      \n      expect(screen.getByText(mock[FeatureName].name)).toBeInTheDocument()\n    })\n\n    it('hides actions when showActions is false', () => {\n      render(<[FeatureName]Card {...defaultProps} showActions={false} />)\n      \n      expect(screen.queryByRole('button')).not.toBeInTheDocument()\n    })\n  })\n\n  describe('Interactions', () => {\n    it('calls onView when view action is clicked', async () => {\n      render(<[FeatureName]Card {...defaultProps} />)\n      \n      // Open dropdown menu\n      const menuButton = screen.getByRole('button')\n      fireEvent.click(menuButton)\n      \n      // Click view option\n      await waitFor(() => {\n        const viewButton = screen.getByText('View')\n        fireEvent.click(viewButton)\n      })\n      \n      expect(defaultProps.onView).toHaveBeenCalledWith(mock[FeatureName].id)\n    })\n\n    it('calls onEdit when edit action is clicked', async () => {\n      render(<[FeatureName]Card {...defaultProps} />)\n      \n      const menuButton = screen.getByRole('button')\n      fireEvent.click(menuButton)\n      \n      await waitFor(() => {\n        const editButton = screen.getByText('Edit')\n        fireEvent.click(editButton)\n      })\n      \n      expect(defaultProps.onEdit).toHaveBeenCalledWith(mock[FeatureName].id)\n    })\n\n    it('calls onDelete when delete action is clicked', async () => {\n      render(<[FeatureName]Card {...defaultProps} />)\n      \n      const menuButton = screen.getByRole('button')\n      fireEvent.click(menuButton)\n      \n      await waitFor(() => {\n        const deleteButton = screen.getByText('Delete')\n        fireEvent.click(deleteButton)\n      })\n      \n      expect(defaultProps.onDelete).toHaveBeenCalledWith(mock[FeatureName].id)\n    })\n  })\n\n  describe('Accessibility', () => {\n    it('has proper ARIA labels', () => {\n      render(<[FeatureName]Card {...defaultProps} />)\n      \n      const menuButton = screen.getByRole('button')\n      expect(menuButton).toHaveAttribute('aria-haspopup')\n    })\n  })\n})\n```\n\n### Hook Test Template\n\n```typescript\n// __tests__/hooks/use[FeatureName]s.test.ts\nimport { renderHook, waitFor } from '@testing-library/react'\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query'\nimport { useGet[FeatureName]s, useCreate[FeatureName] } from '@/hooks/queries/use[FeatureName]s'\nimport { getAll[FeatureName]s, create[FeatureName] } from '@/lib/firebaseService'\nimport { [FeatureName]DataType } from '@/types'\n\n// Mock the Firebase service\njest.mock('@/lib/firebaseService', () => ({\n  getAll[FeatureName]s: jest.fn(),\n  create[FeatureName]: jest.fn(),\n}))\n\nconst mock[FeatureName]s: ([FeatureName]DataType & { id: string })[] = [\n  {\n    id: '1',\n    name: 'Test [FeatureName] 1',\n    description: 'Description 1',\n    status: 'active',\n    category: 'general',\n    createdAt: '2023-01-01T00:00:00.000Z',\n    updatedAt: '2023-01-01T00:00:00.000Z',\n  },\n  {\n    id: '2',\n    name: 'Test [FeatureName] 2',\n    description: 'Description 2',\n    status: 'inactive',\n    category: 'business',\n    createdAt: '2023-01-02T00:00:00.000Z',\n    updatedAt: '2023-01-02T00:00:00.000Z',\n  },\n]\n\nconst createWrapper = () => {\n  const queryClient = new QueryClient({\n    defaultOptions: {\n      queries: { retry: false },\n      mutations: { retry: false },\n    },\n  })\n  return ({ children }: { children: React.ReactNode }) => (\n    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>\n  )\n}\n\ndescribe('use[FeatureName]s hooks', () => {\n  beforeEach(() => {\n    jest.clearAllMocks()\n  })\n\n  describe('useGet[FeatureName]s', () => {\n    it('fetches [featurename]s successfully', async () => {\n      const mockGetAll = getAll[FeatureName]s as jest.MockedFunction<typeof getAll[FeatureName]s>\n      mockGetAll.mockResolvedValue(mock[FeatureName]s)\n\n      const { result } = renderHook(() => useGet[FeatureName]s(), {\n        wrapper: createWrapper(),\n      })\n\n      await waitFor(() => {\n        expect(result.current.isSuccess).toBe(true)\n      })\n\n      expect(result.current.data).toEqual(\n        expect.arrayContaining([\n          expect.objectContaining({\n            id: '1',\n            name: 'Test [FeatureName] 1',\n          }),\n        ])\n      )\n      expect(mockGetAll).toHaveBeenCalledTimes(1)\n    })\n\n    it('applies filters correctly', async () => {\n      const mockGetAll = getAll[FeatureName]s as jest.MockedFunction<typeof getAll[FeatureName]s>\n      mockGetAll.mockResolvedValue(mock[FeatureName]s)\n\n      const { result } = renderHook(\n        () => useGet[FeatureName]s({ status: 'active' }),\n        { wrapper: createWrapper() }\n      )\n\n      await waitFor(() => {\n        expect(result.current.isSuccess).toBe(true)\n      })\n\n      // Should only return active items\n      expect(result.current.data).toHaveLength(1)\n      expect(result.current.data?.[0].status).toBe('active')\n    })\n\n    it('handles errors gracefully', async () => {\n      const mockGetAll = getAll[FeatureName]s as jest.MockedFunction<typeof getAll[FeatureName]s>\n      mockGetAll.mockRejectedValue(new Error('Network error'))\n\n      const { result } = renderHook(() => useGet[FeatureName]s(), {\n        wrapper: createWrapper(),\n      })\n\n      await waitFor(() => {\n        expect(result.current.isError).toBe(true)\n      })\n\n      expect(result.current.error).toEqual(\n        expect.objectContaining({\n          message: 'Network error',\n        })\n      )\n    })\n  })\n\n  describe('useCreate[FeatureName]', () => {\n    it('creates [featurename] successfully', async () => {\n      const mockCreate = create[FeatureName] as jest.MockedFunction<typeof create[FeatureName]>\n      mockCreate.mockResolvedValue({ id: 'new-id' })\n\n      const { result } = renderHook(() => useCreate[FeatureName](), {\n        wrapper: createWrapper(),\n      })\n\n      const newData = {\n        name: 'New [FeatureName]',\n        description: 'New description',\n        status: 'active' as const,\n        category: 'general',\n      }\n\n      result.current.mutate(newData)\n\n      await waitFor(() => {\n        expect(result.current.isSuccess).toBe(true)\n      })\n\n      expect(mockCreate).toHaveBeenCalledWith(newData)\n      expect(result.current.data).toEqual({ id: 'new-id' })\n    })\n\n    it('validates input data', async () => {\n      const { result } = renderHook(() => useCreate[FeatureName](), {\n        wrapper: createWrapper(),\n      })\n\n      const invalidData = {\n        name: '', // Invalid: empty name\n        description: 'Description',\n        status: 'active' as const,\n        category: 'general',\n      }\n\n      result.current.mutate(invalidData)\n\n      await waitFor(() => {\n        expect(result.current.isError).toBe(true)\n      })\n\n      expect(result.current.error?.message).toContain('Name is required')\n    })\n\n    it('handles creation errors', async () => {\n      const mockCreate = create[FeatureName] as jest.MockedFunction<typeof create[FeatureName]>\n      mockCreate.mockRejectedValue(new Error('Creation failed'))\n\n      const { result } = renderHook(() => useCreate[FeatureName](), {\n        wrapper: createWrapper(),\n      })\n\n      const newData = {\n        name: 'New [FeatureName]',\n        description: 'Description',\n        status: 'active' as const,\n        category: 'general',\n      }\n\n      result.current.mutate(newData)\n\n      await waitFor(() => {\n        expect(result.current.isError).toBe(true)\n      })\n\n      expect(result.current.error?.message).toBe('Creation failed')\n    })\n  })\n})\n```\n\n---\n\n## Usage Instructions\n\n### How to Use These Templates\n\n1. **Find and Replace**: Replace all instances of `[FeatureName]`, `[featureName]`, `[featurename]` with your actual feature names\n2. **Customize Fields**: Modify the form fields, data types, and validation rules according to your specific requirements\n3. **Update Collections**: Ensure the collection names match your Firebase configuration\n4. **Adapt Styling**: Modify the Tailwind classes to match your design system\n5. **Add Business Logic**: Insert your specific business rules and validation logic\n\n### Template Variables\n\n- `[FeatureName]` → PascalCase (e.g., `Course`, `Video`, `User`)\n- `[featureName]` → camelCase (e.g., `course`, `video`, `user`)\n- `[featurename]` → lowercase (e.g., `course`, `video`, `user`)\n- `[FEATURENAME]` → UPPERCASE (e.g., `COURSE`, `VIDEO`, `USER`)\n\n### Quick Start Checklist\n\n- [ ] Define types in `/types/index.ts`\n- [ ] Create API module in `/api/[FeatureName]/`\n- [ ] Add query keys to `/lib/queryKeys.ts`\n- [ ] Implement hooks in `/hooks/queries/`\n- [ ] Create components in `/components/[featurename]/`\n- [ ] Add pages in `/app/admin/[featurename]s/`\n- [ ] Write tests in `__tests__/`\n- [ ] Update navigation and routes\n\nThese templates provide a solid foundation for consistent development across the CRM system. Customize them based on your specific requirements while maintaining the established patterns and best practices.