// Template for creating TanStack Query hooks with advanced patterns
// Copy this file and replace [Feature] placeholders with your feature name

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery,
  useSuspenseQuery,
  useQueries,
  QueryClient,
  InfiniteData
} from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { 
  getAll[Feature]s, 
  get[Feature]ById, 
  getFiltered[Feature]s,
  get[Feature]sPage,
  create[Feature], 
  update[Feature], 
  delete[Feature],
  batchCreate[Feature]s,
  batchUpdate[Feature]s
} from '@/api/[Feature]'
import { [Feature]DataType, [Feature]FilterOptions, [Feature]SortOptions } from '@/types'

// === QUERY CONFIGURATION CONSTANTS ===

const QUERY_CONFIG = {
  staleTime: {
    list: 5 * 60 * 1000,      // 5 minutes for lists
    detail: 10 * 60 * 1000,   // 10 minutes for individual items
    analytics: 2 * 60 * 1000, // 2 minutes for analytics
    static: 15 * 60 * 1000,   // 15 minutes for relatively static data
  },
  gcTime: {
    default: 10 * 60 * 1000,  // 10 minutes
    longLived: 30 * 60 * 1000, // 30 minutes
  },
  retry: {
    default: 2,
    important: 3,
    background: 1,
  }
} as const

// === BASIC QUERY HOOKS ===

/**
 * Fetches all [feature]s with optional filtering
 * @param filters - Filter options for the query
 * @param options - Additional query options
 */
export const useQuery[Feature]s = (
  filters?: [Feature]FilterOptions,
  options?: {
    enabled?: boolean
    staleTime?: number
    select?: (data: [Feature]DataType[]) => any
  }
) => {
  return useQuery({
    queryKey: queryKeys.[feature]s(filters),
    queryFn: () => filters ? getFiltered[Feature]s(filters) : getAll[Feature]s(),
    staleTime: options?.staleTime ?? QUERY_CONFIG.staleTime.list,
    gcTime: QUERY_CONFIG.gcTime.default,
    enabled: options?.enabled ?? true,
    select: options?.select,
    retry: QUERY_CONFIG.retry.default,
  })
}

/**
 * Fetches a single [feature] by ID
 * @param id - The [feature] ID
 * @param options - Additional query options
 */
export const useQuery[Feature] = (
  id: string,
  options?: {
    enabled?: boolean
    staleTime?: number
    select?: (data: [Feature]DataType) => any
  }
) => {
  return useQuery({
    queryKey: queryKeys.[feature](id),
    queryFn: () => get[Feature]ById(id),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: options?.staleTime ?? QUERY_CONFIG.staleTime.detail,
    gcTime: QUERY_CONFIG.gcTime.default,
    select: options?.select,
    retry: QUERY_CONFIG.retry.important,
  })
}

/**
 * Suspense-enabled query for [feature]s (for React 18+ concurrent features)
 * @param filters - Filter options for the query
 */
export const useSuspenseQuery[Feature]s = (filters?: [Feature]FilterOptions) => {
  return useSuspenseQuery({
    queryKey: queryKeys.[feature]s(filters),
    queryFn: () => filters ? getFiltered[Feature]s(filters) : getAll[Feature]s(),
    staleTime: QUERY_CONFIG.staleTime.list,
  })
}

/**
 * Infinite query for paginated [feature]s
 * @param filters - Filter options for pagination
 * @param pageSize - Number of items per page (default: 10)
 */
export const useInfinite[Feature]s = (
  filters?: [Feature]FilterOptions, 
  pageSize: number = 10
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.[feature]sList(filters),
    queryFn: ({ pageParam }) => get[Feature]sPage(pageSize, pageParam),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPageCursor : undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousPageCursor,
    staleTime: QUERY_CONFIG.staleTime.list,
    gcTime: QUERY_CONFIG.gcTime.default,
    retry: QUERY_CONFIG.retry.default,
  })
}

/**
 * Query multiple [feature]s in parallel
 * @param ids - Array of [feature] IDs to fetch
 */
export const useQuery[Feature]sByIds = (ids: string[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.[feature](id),
      queryFn: () => get[Feature]ById(id),
      enabled: !!id,
      staleTime: QUERY_CONFIG.staleTime.detail,
    })),
  })
}

// === MUTATION HOOKS ===

/**
 * Creates a new [feature] with optimistic updates and cache management
 */
export const useCreate[Feature] = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create[Feature],
    
    // Optimistic update
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.[feature]s() })
      
      // Snapshot the previous value
      const previous[Feature]s = queryClient.getQueryData<[Feature]DataType[]>(
        queryKeys.[feature]s()
      )
      
      // Optimistically update the cache
      if (previous[Feature]s) {
        const optimistic[Feature]: [Feature]DataType = {
          id: 'temp-' + Date.now(), // Temporary ID
          ...newData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        queryClient.setQueryData<[Feature]DataType[]>(
          queryKeys.[feature]s(),
          [optimistic[Feature], ...previous[Feature]s]
        )
      }
      
      return { previous[Feature]s }
    },
    
    // Handle success
    onSuccess: (data, variables, context) => {
      // Update the cache with the real data
      queryClient.setQueryData<[Feature]DataType[]>(
        queryKeys.[feature]s(),
        (prev) => {
          if (!prev) return [{ ...variables, id: data.id, createdAt: new Date(), updatedAt: new Date() }]
          
          // Replace the optimistic item with the real one
          return prev.map(item => 
            item.id.startsWith('temp-') 
              ? { ...variables, id: data.id, createdAt: new Date(), updatedAt: new Date() }
              : item
          )
        }
      )
      
      // Invalidate related queries
      getInvalidationKeys.on[Feature]Create().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      
      toast({
        title: 'Success',
        description: '[Feature] created successfully',
      })
    },
    
    // Handle error (rollback optimistic update)
    onError: (error, variables, context) => {
      if (context?.previous[Feature]s) {
        queryClient.setQueryData(queryKeys.[feature]s(), context.previous[Feature]s)
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create [feature]',
        variant: 'destructive',
      })
    },
    
    retry: QUERY_CONFIG.retry.important,
  })
}

/**
 * Updates an existing [feature] with optimistic updates
 */
export const useUpdate[Feature] = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<[Feature]DataType> }) =>
      update[Feature](id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.[feature](id) })
      await queryClient.cancelQueries({ queryKey: queryKeys.[feature]s() })
      
      // Snapshot previous values
      const previous[Feature] = queryClient.getQueryData<[Feature]DataType>(
        queryKeys.[feature](id)
      )
      const previous[Feature]s = queryClient.getQueryData<[Feature]DataType[]>(
        queryKeys.[feature]s()
      )
      
      // Optimistic updates
      if (previous[Feature]) {
        const updated[Feature] = {
          ...previous[Feature],
          ...data,
          updatedAt: new Date(),
        }
        
        queryClient.setQueryData<[Feature]DataType>(
          queryKeys.[feature](id),
          updated[Feature]
        )
      }
      
      if (previous[Feature]s) {
        queryClient.setQueryData<[Feature]DataType[]>(
          queryKeys.[feature]s(),
          previous[Feature]s.map([feature] => 
            [feature].id === id 
              ? { ...[feature], ...data, updatedAt: new Date() }
              : [feature]
          )
        )
      }
      
      return { previous[Feature], previous[Feature]s }
    },
    
    onSuccess: (_, { id }) => {
      // Invalidate related queries
      getInvalidationKeys.on[Feature]Update(id).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      
      toast({
        title: 'Success',
        description: '[Feature] updated successfully',
      })
    },
    
    onError: (error, { id }, context) => {
      // Rollback optimistic updates
      if (context?.previous[Feature]) {
        queryClient.setQueryData(queryKeys.[feature](id), context.previous[Feature])
      }
      if (context?.previous[Feature]s) {
        queryClient.setQueryData(queryKeys.[feature]s(), context.previous[Feature]s)
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to update [feature]',
        variant: 'destructive',
      })
    },
    
    retry: QUERY_CONFIG.retry.important,
  })
}

/**
 * Deletes a [feature] with cache cleanup
 */
export const useDelete[Feature] = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: delete[Feature],
    
    // Optimistic removal
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.[feature]s() })
      
      const previous[Feature]s = queryClient.getQueryData<[Feature]DataType[]>(
        queryKeys.[feature]s()
      )
      
      // Optimistically remove the item
      if (previous[Feature]s) {
        queryClient.setQueryData<[Feature]DataType[]>(
          queryKeys.[feature]s(),
          previous[Feature]s.filter([feature] => [feature].id !== id)
        )
      }
      
      return { previous[Feature]s, deleted[Feature]Id: id }
    },
    
    onSuccess: (_, id, context) => {
      // Remove individual item from cache
      queryClient.removeQueries({ queryKey: queryKeys.[feature](id) })
      
      // Invalidate related queries
      getInvalidationKeys.on[Feature]Delete(id).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      
      toast({
        title: 'Success',
        description: '[Feature] deleted successfully',
      })
    },
    
    onError: (error, id, context) => {
      // Restore the deleted item
      if (context?.previous[Feature]s) {
        queryClient.setQueryData(queryKeys.[feature]s(), context.previous[Feature]s)
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete [feature]',
        variant: 'destructive',
      })
    },
    
    retry: QUERY_CONFIG.retry.default,
  })
}

// === BATCH OPERATION HOOKS ===

/**
 * Creates multiple [feature]s in batch
 */
export const useBatchCreate[Feature]s = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: batchCreate[Feature]s,
    onSuccess: (data) => {
      // Invalidate list queries to refetch with new items
      queryClient.invalidateQueries({ queryKey: queryKeys.[feature]s() })
      
      toast({
        title: 'Success',
        description: `${data.length} [feature]s created successfully`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create [feature]s',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Updates multiple [feature]s in batch
 */
export const useBatchUpdate[Feature]s = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: batchUpdate[Feature]s,
    onSuccess: (data) => {
      // Invalidate affected queries
      data.forEach(({ id }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.[feature](id) })
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.[feature]s() })
      
      toast({
        title: 'Success',
        description: `${data.length} [feature]s updated successfully`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update [feature]s',
        variant: 'destructive',
      })
    },
  })
}

// === ADVANCED PATTERNS ===

/**
 * Prefetches [feature] data for better UX
 */
export const usePrefetch[Feature] = () => {
  const queryClient = useQueryClient()

  const prefetch[Feature] = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.[feature](id),
      queryFn: () => get[Feature]ById(id),
      staleTime: QUERY_CONFIG.staleTime.detail,
    })
  }

  const prefetch[Feature]s = (filters?: [Feature]FilterOptions) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.[feature]s(filters),
      queryFn: () => filters ? getFiltered[Feature]s(filters) : getAll[Feature]s(),
      staleTime: QUERY_CONFIG.staleTime.list,
    })
  }

  return { prefetch[Feature], prefetch[Feature]s }
}

/**
 * Real-time sync hook (would typically integrate with WebSockets or Firebase real-time)
 * This is a conceptual example - implement based on your real-time solution
 */
export const useRealTime[Feature]s = (filters?: [Feature]FilterOptions) => {
  const queryClient = useQueryClient()
  
  // This would typically set up a WebSocket connection or Firebase listener
  React.useEffect(() => {
    // Simulated real-time updates
    const handleRealTimeUpdate = (updated[Feature]: [Feature]DataType) => {
      // Update individual item
      queryClient.setQueryData<[Feature]DataType>(
        queryKeys.[feature](updated[Feature].id),
        updated[Feature]
      )
      
      // Update in lists
      queryClient.setQueriesData<[Feature]DataType[]>(
        { queryKey: queryKeys.[feature]s() },
        (prev) => {
          if (!prev) return prev
          return prev.map([feature] => 
            [feature].id === updated[Feature].id ? updated[Feature] : [feature]
          )
        }
      )
    }
    
    // Set up your real-time listener here
    // const unsubscribe = setupRealTimeListener(handleRealTimeUpdate, filters)
    
    // return unsubscribe
  }, [queryClient, filters])
  
  return useQuery[Feature]s(filters)
}

/**
 * Debounced search hook for [feature]s
 */
export const useDebounced[Feature]Search = (searchTerm: string, delay: number = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [searchTerm, delay])
  
  return useQuery[Feature]s(
    { search: debouncedSearchTerm },
    { enabled: debouncedSearchTerm.length > 0 }
  )
}

/**
 * Cache management utilities
 */
export const use[Feature]CacheUtils = () => {
  const queryClient = useQueryClient()
  
  const invalidateAll[Feature]s = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.[feature]s() })
  }
  
  const removeAll[Feature]Cache = () => {
    queryClient.removeQueries({ queryKey: queryKeys.[feature]s() })
  }
  
  const prefetchNext[Feature]s = async (currentPage: number, filters?: [Feature]FilterOptions) => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.[feature]sList(filters),
      queryFn: ({ pageParam }) => get[Feature]sPage(10, pageParam),
      pages: currentPage + 1,
    })
  }
  
  const getCached[Feature] = (id: string): [Feature]DataType | undefined => {
    return queryClient.getQueryData(queryKeys.[feature](id))
  }
  
  const setCached[Feature] = (id: string, data: [Feature]DataType) => {
    queryClient.setQueryData(queryKeys.[feature](id), data)
  }
  
  return {
    invalidateAll[Feature]s,
    removeAll[Feature]Cache,
    prefetchNext[Feature]s,
    getCached[Feature],
    setCached[Feature],
  }
}

// === BACKGROUND SYNC ===

/**
 * Background sync for offline support
 */
export const useBackground[Feature]Sync = () => {
  const queryClient = useQueryClient()
  
  React.useEffect(() => {
    const handleOnline = () => {
      // Resume paused mutations when coming back online
      queryClient.resumePausedMutations()
      
      // Refetch important queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.[feature]s(),
        type: 'active'
      })
    }
    
    window.addEventListener('online', handleOnline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [queryClient])
}

// === EXPORTS ===

export {
  // Query hooks
  useQuery[Feature]s,
  useQuery[Feature],
  useSuspenseQuery[Feature]s,
  useInfinite[Feature]s,
  useQuery[Feature]sByIds,
  
  // Mutation hooks
  useCreate[Feature],
  useUpdate[Feature],
  useDelete[Feature],
  
  // Batch operations
  useBatchCreate[Feature]s,
  useBatchUpdate[Feature]s,
  
  // Advanced patterns
  usePrefetch[Feature],
  useRealTime[Feature]s,
  useDebounced[Feature]Search,
  use[Feature]CacheUtils,
  useBackground[Feature]Sync,
  
  // Configuration
  QUERY_CONFIG,
}

/* 
USAGE EXAMPLES:

// Basic queries
const { data: [feature]s, isLoading, error } = useQuery[Feature]s()
const { data: [feature] } = useQuery[Feature]('feature-id')

// With filters
const { data: active[Feature]s } = useQuery[Feature]s({ 
  status: 'active',
  category: 'development' 
})

// Infinite scroll
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfinite[Feature]s({ status: 'active' })

// Mutations with optimistic updates
const create[Feature]Mutation = useCreate[Feature]()
await create[Feature]Mutation.mutateAsync({
  name: 'New Feature',
  status: 'draft'
})

// Batch operations
const batchCreate = useBatchCreate[Feature]s()
await batchCreate.mutateAsync([
  { name: 'Feature 1', status: 'active' },
  { name: 'Feature 2', status: 'draft' }
])

// Prefetching for better UX
const { prefetch[Feature] } = usePrefetch[Feature]()
<Button onMouseEnter={() => prefetch[Feature]('feature-id')}>
  View Feature
</Button>

// Debounced search
const searchQuery = useDebounced[Feature]Search(searchTerm)

// Cache utilities
const { invalidateAll[Feature]s, getCached[Feature] } = use[Feature]CacheUtils()
const cached = getCached[Feature]('feature-id')

// Background sync for offline support
useBackground[Feature]Sync()

// Suspense with React 18
const SuspenseComponent = () => {
  const { data } = useSuspenseQuery[Feature]s()
  return <[Feature]List [feature]s={data} />
}

*/