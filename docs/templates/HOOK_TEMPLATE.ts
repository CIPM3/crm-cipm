// Template for creating standardized hooks
// Copy this file and replace [Feature] placeholders with your feature name

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { 
  useStandardizedMutation, 
  useStandardizedQuery,
  StandardMutationReturn,
  StandardQueryReturn 
} from '@/hooks/core/useStandardizedHook'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { 
  getAll[Feature]s, 
  get[Feature]ById, 
  create[Feature], 
  update[Feature], 
  delete[Feature],
  getFiltered[Feature]s,
  get[Feature]sPage
} from '@/api/[Feature]'
import { [Feature]DataType } from '@/types'

// === MUTATION HOOKS (Write Operations) ===

// Create hook
export const useCreate[Feature] = (): StandardMutationReturn<{ id: string }, Omit<[Feature]DataType, 'id'>> => {
  return useStandardizedMutation(async (data: Omit<[Feature]DataType, 'id'>) => {
    return await create[Feature](data)
  })
}

// Update hook  
export const useUpdate[Feature] = (): StandardMutationReturn<{ id: string }, { id: string; data: Partial<[Feature]DataType> }> => {
  return useStandardizedMutation(async ({ id, data }: { id: string; data: Partial<[Feature]DataType> }) => {
    return await update[Feature](id, data)
  })
}

// Delete hook
export const useDelete[Feature] = (): StandardMutationReturn<{ id: string }, string> => {
  return useStandardizedMutation(async (id: string) => {
    return await delete[Feature](id)
  })
}

// === QUERY HOOKS (Read Operations) ===

// Get all hook with auto-fetch
export const useFetch[Feature]s = (filters?: { status?: string }): StandardQueryReturn<[Feature]DataType[]> & { [feature]s: [Feature]DataType[] } => {
  const queryResult = useStandardizedQuery<[Feature]DataType[]>(
    () => filters ? getFiltered[Feature]s(filters) : getAll[Feature]s(),
    [filters] // Dependencies for refetch logic
  )
  
  // Auto-fetch on mount and when filters change
  useEffect(() => {
    queryResult.refetch()
  }, [filters])

  return {
    ...queryResult,
    [feature]s: queryResult.data || [] // Legacy compatibility
  }
}

// Get by ID hook with dependency management
export const useGet[Feature]ById = (id: string): StandardQueryReturn<[Feature]DataType> & { [feature]: [Feature]DataType | null } => {
  const queryResult = useStandardizedQuery<[Feature]DataType>(
    () => get[Feature]ById(id),
    [id] // Dependencies for refetch logic
  )
  
  // Auto-fetch when id changes
  useEffect(() => {
    if (id) {
      queryResult.refetch()
    }
  }, [id, queryResult.refetch])

  return {
    ...queryResult,
    [feature]: queryResult.data // Legacy compatibility
  }
}

// === TANSTACK QUERY INTEGRATION HOOKS ===

// Query hook with TanStack Query
export const useQuery[Feature]s = (filters?: { status?: string; search?: string }) => {
  return useQuery({
    queryKey: queryKeys.[feature]s(filters),
    queryFn: () => filters ? getFiltered[Feature]s(filters) : getAll[Feature]s(),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    enabled: true,
  })
}

// Detail query hook
export const useQuery[Feature] = (id: string) => {
  return useQuery({
    queryKey: queryKeys.[feature](id),
    queryFn: () => get[Feature]ById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 10 * 60 * 1000, // 10 minutes for details
  })
}

// Infinite query for pagination
export const useInfinite[Feature]s = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.[feature]sList(filters),
    queryFn: ({ pageParam }) => get[Feature]sPage(10, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    staleTime: 5 * 60 * 1000,
  })
}

// === MUTATION HOOKS WITH CACHE MANAGEMENT ===

// Create with optimistic updates
export const useCreate[Feature]WithCache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: create[Feature],
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      getInvalidationKeys.on[Feature]Create().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      
      // Optimistic update to list
      queryClient.setQueryData<[Feature]DataType[]>(
        queryKeys.[feature]sList(),
        (prev) => prev ? [{ ...variables, id: data.id, createdAt: new Date(), updatedAt: new Date() }, ...prev] : [{ ...variables, id: data.id, createdAt: new Date(), updatedAt: new Date() }]
      )
      
      toast({
        title: 'Success',
        description: '[Feature] created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create [feature]',
        variant: 'destructive',
      })
    },
  })
}

// Update with optimistic updates
export const useUpdate[Feature]WithCache = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<[Feature]DataType> }) =>
      update[Feature](id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.[feature](id) })
      
      const previous[Feature] = queryClient.getQueryData<[Feature]DataType>(queryKeys.[feature](id))
      const previous[Feature]sList = queryClient.getQueryData<[Feature]DataType[]>(queryKeys.[feature]sList())
      
      // Optimistic updates
      if (previous[Feature]) {
        queryClient.setQueryData<[Feature]DataType>(
          queryKeys.[feature](id),
          { ...previous[Feature], ...data, updatedAt: new Date() }
        )
      }
      
      if (previous[Feature]sList) {
        queryClient.setQueryData<[Feature]DataType[]>(
          queryKeys.[feature]sList(),
          previous[Feature]sList.map([feature] => 
            [feature].id === id ? { ...[feature], ...data, updatedAt: new Date() } : [feature]
          )
        )
      }
      
      return { previous[Feature], previous[Feature]sList }
    },
    
    onError: (error, variables, context) => {
      // Revert optimistic updates
      if (context?.previous[Feature]) {
        queryClient.setQueryData(queryKeys.[feature](variables.id), context.previous[Feature])
      }
      if (context?.previous[Feature]sList) {
        queryClient.setQueryData(queryKeys.[feature]sList(), context.previous[Feature]sList)
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to update [feature]',
        variant: 'destructive',
      })
    },
    
    onSuccess: (_, { id }) => {
      getInvalidationKeys.on[Feature]Update(id).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      
      toast({
        title: 'Success',
        description: '[Feature] updated successfully',
      })
    },
  })
}

// Delete with cache management
export const useDelete[Feature]WithCache = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: delete[Feature],
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.[feature](id) })
      
      // Update list cache
      queryClient.setQueryData<[Feature]DataType[]>(
        queryKeys.[feature]sList(),
        (prev) => prev ? prev.filter([feature] => [feature].id !== id) : []
      )
      
      // Invalidate related queries
      getInvalidationKeys.on[Feature]Delete(id).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      
      toast({
        title: 'Success',
        description: '[Feature] deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete [feature]',
        variant: 'destructive',
      })
    },
  })
}

// === BATCH OPERATIONS ===

export const useBatch[Feature]Operations = () => {
  const createMutation = useCreate[Feature]()
  const updateMutation = useUpdate[Feature]()
  const deleteMutation = useDelete[Feature]()

  const batchCreate = async ([feature]s: Omit<[Feature]DataType, 'id'>[]): Promise<{ id: string }[]> => {
    const results = await Promise.all(
      [feature]s.map([feature] => createMutation.mutate([feature]))
    )
    return results
  }

  const batchUpdate = async (updates: { id: string; data: Partial<[Feature]DataType> }[]): Promise<{ id: string }[]> => {
    const results = await Promise.all(
      updates.map(update => updateMutation.mutate(update))
    )
    return results
  }

  const batchDelete = async (ids: string[]): Promise<{ id: string }[]> => {
    const results = await Promise.all(
      ids.map(id => deleteMutation.mutate(id))
    )
    return results
  }

  return {
    batchCreate,
    batchUpdate,
    batchDelete,
    loading: createMutation.loading || updateMutation.loading || deleteMutation.loading,
    error: createMutation.error || updateMutation.error || deleteMutation.error
  }
}

// === LEGACY COMPATIBILITY EXPORTS ===
// Maintain backward compatibility with existing code

export const useCreate[Feature]V1 = () => {
  const mutation = useCreate[Feature]()
  return {
    mutate: ([feature]: Omit<[Feature]DataType, 'id'>) => mutation.mutate([feature]),
    data: mutation.data,
    loading: mutation.loading,
    error: mutation.error
  }
}

export const useFetch[Feature]sV1 = () => {
  const query = useFetch[Feature]s()
  return {
    [feature]s: query.[feature]s,
    loading: query.loading,
    error: query.error
  }
}

export const useGet[Feature]ByIdV1 = (id: string) => {
  const query = useGet[Feature]ById(id)
  return {
    [feature]: query.[feature],
    loading: query.loading,
    error: query.error
  }
}

/* 
USAGE EXAMPLES:

// Basic standardized hooks
const createMutation = useCreate[Feature]()
await createMutation.mutate({ name: 'New [Feature]', status: 'active' })

const { data: [feature]s, loading, error } = useFetch[Feature]s()
const { [feature], loading: detailLoading } = useGet[Feature]ById('feature-id')

// TanStack Query hooks
const { data, isLoading, error, refetch } = useQuery[Feature]s({ status: 'active' })
const { data: [feature]Detail } = useQuery[Feature]('feature-id')

// Optimistic updates
const createWithCache = useCreate[Feature]WithCache()
await createWithCache.mutateAsync({ name: 'Optimistic [Feature]' })

// Infinite scroll
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfinite[Feature]s()

// Batch operations
const batch = useBatch[Feature]Operations()
await batch.batchCreate([
  { name: '[Feature] 1', status: 'active' },
  { name: '[Feature] 2', status: 'active' },
])

*/