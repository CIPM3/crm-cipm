'use client'

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import { FirebaseServiceError } from '@/lib/firebaseService'

// Enhanced query options for server-optimized queries
export interface ServerOptimizedQueryOptions<T> {
  queryKey: QueryKey
  queryFn: () => Promise<T>
  initialData?: T
  staleTime?: number
  gcTime?: number
  refetchOnMount?: boolean | 'always'
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
  retry?: number | boolean
  retryDelay?: number
  enabled?: boolean
  select?: (data: T) => any
  suspense?: boolean
  keepPreviousData?: boolean
}

// Server-optimized query hook
export function useServerOptimizedQuery<T>(options: ServerOptimizedQueryOptions<T>) {
  const {
    queryKey,
    queryFn,
    initialData,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    gcTime = 10 * 60 * 1000, // 10 minutes default
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    retry = 2,
    retryDelay = 1000,
    enabled = true,
    select,
    suspense = false,
    keepPreviousData = false,
  } = options

  // Optimized query configuration
  const queryConfig = useMemo(() => ({
    queryKey,
    queryFn,
    initialData,
    staleTime,
    gcTime,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    retry: (failureCount: number, error: any) => {
      if (error instanceof FirebaseServiceError) {
        // Don't retry on auth errors or not found
        if (error.code === 'permission-denied' || error.code === 'not-found') {
          return false
        }
      }
      return typeof retry === 'number' ? failureCount < retry : retry
    },
    retryDelay: (attemptIndex: number) => 
      Math.min(retryDelay * Math.pow(2, attemptIndex), 30000),
    enabled,
    select,
    suspense,
    keepPreviousData,
  }), [
    queryKey, queryFn, initialData, staleTime, gcTime, refetchOnMount,
    refetchOnWindowFocus, refetchOnReconnect, retry, retryDelay, enabled,
    select, suspense, keepPreviousData
  ])

  return useQuery(queryConfig)
}

// Server-optimized mutation options
export interface ServerOptimizedMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: unknown, variables: TVariables) => void
  onMutate?: (variables: TVariables) => Promise<any> | any
  onSettled?: (data: TData | undefined, error: unknown | null, variables: TVariables) => void
  retry?: number | boolean
  retryDelay?: number
  invalidateQueries?: QueryKey[]
  optimisticUpdate?: {
    queryKey: QueryKey
    updater: (oldData: any, variables: TVariables) => any
  }
}

// Server-optimized mutation hook
export function useServerOptimizedMutation<TData, TVariables = void>(
  options: ServerOptimizedMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient()
  
  const {
    mutationFn,
    onSuccess,
    onError,
    onMutate,
    onSettled,
    retry = 1,
    retryDelay = 1000,
    invalidateQueries = [],
    optimisticUpdate,
  } = options

  // Optimistic update helper
  const handleOptimisticUpdate = useCallback((variables: TVariables) => {
    if (!optimisticUpdate) return undefined

    const { queryKey, updater } = optimisticUpdate
    const previousData = queryClient.getQueryData(queryKey)
    
    if (previousData) {
      queryClient.setQueryData(queryKey, (old: any) => updater(old, variables))
    }
    
    return { previousData, queryKey }
  }, [queryClient, optimisticUpdate])

  // Enhanced success handler
  const handleSuccess = useCallback(async (data: TData, variables: TVariables) => {
    // Invalidate specified queries
    await Promise.all(
      invalidateQueries.map(queryKey => 
        queryClient.invalidateQueries({ queryKey })
      )
    )

    // Call user-provided onSuccess
    if (onSuccess) {
      await onSuccess(data, variables)
    }
  }, [queryClient, invalidateQueries, onSuccess])

  // Enhanced error handler
  const handleError = useCallback((error: unknown, variables: TVariables, context: any) => {
    // Rollback optimistic update
    if (context?.previousData && context?.queryKey) {
      queryClient.setQueryData(context.queryKey, context.previousData)
    }

    // Call user-provided onError
    if (onError) {
      onError(error, variables)
    }
  }, [queryClient, onError])

  const mutationConfig = useMemo(() => ({
    mutationFn,
    onMutate: (variables: TVariables) => {
      const optimisticContext = handleOptimisticUpdate(variables)
      return onMutate ? { ...onMutate(variables), ...optimisticContext } : optimisticContext
    },
    onSuccess: handleSuccess,
    onError: handleError,
    onSettled,
    retry: (failureCount: number, error: any) => {
      if (error instanceof FirebaseServiceError) {
        if (['permission-denied', 'not-found', 'invalid-argument'].includes(error.code)) {
          return false
        }
      }
      return typeof retry === 'number' ? failureCount < retry : retry
    },
    retryDelay: (attemptIndex: number) => 
      Math.min(retryDelay * Math.pow(2, attemptIndex), 30000),
  }), [
    mutationFn, handleOptimisticUpdate, onMutate, handleSuccess, 
    handleError, onSettled, retry, retryDelay
  ])

  return useMutation(mutationConfig)
}

// Prefetch helper for server-side data
export function usePrefetchData() {
  const queryClient = useQueryClient()

  const prefetch = useCallback(
    <T>(queryKey: QueryKey, queryFn: () => Promise<T>, options?: { staleTime?: number }) => {
      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: options?.staleTime ?? 5 * 60 * 1000,
      })
    },
    [queryClient]
  )

  const ensureData = useCallback(
    <T>(queryKey: QueryKey, queryFn: () => Promise<T>) => {
      return queryClient.ensureQueryData({ queryKey, queryFn })
    },
    [queryClient]
  )

  return { prefetch, ensureData }
}

// Batch query operations
export function useBatchQueries() {
  const queryClient = useQueryClient()

  const invalidateMultiple = useCallback(
    (queryKeys: QueryKey[]) => {
      return Promise.all(
        queryKeys.map(queryKey => 
          queryClient.invalidateQueries({ queryKey })
        )
      )
    },
    [queryClient]
  )

  const refetchMultiple = useCallback(
    (queryKeys: QueryKey[]) => {
      return Promise.all(
        queryKeys.map(queryKey => 
          queryClient.refetchQueries({ queryKey })
        )
      )
    },
    [queryClient]
  )

  const cancelMultiple = useCallback(
    (queryKeys: QueryKey[]) => {
      return Promise.all(
        queryKeys.map(queryKey => 
          queryClient.cancelQueries({ queryKey })
        )
      )
    },
    [queryClient]
  )

  return { invalidateMultiple, refetchMultiple, cancelMultiple }
}

// Background sync helper
export function useBackgroundSync() {
  const queryClient = useQueryClient()

  const syncInBackground = useCallback(
    (queryKey: QueryKey, queryFn: () => Promise<any>) => {
      // Only sync if we're online and have focus
      if (typeof window !== 'undefined' && navigator.onLine && document.hasFocus()) {
        return queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime: 0, // Always fetch fresh data for sync
        })
      }
    },
    [queryClient]
  )

  return { syncInBackground }
}