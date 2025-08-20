// hooks/core/useStandardizedHook.ts
import { useState, useCallback } from 'react'
import { FirebaseServiceError } from '@/lib/firebaseService'

// Standard hook return signature for all hooks
export interface StandardHookReturn<T> {
  data: T | null
  loading: boolean
  error: FirebaseServiceError | null
  mutate: (...args: any[]) => Promise<T>
  reset: () => void
}

// Standard hook return signature for query hooks (read operations)
export interface StandardQueryReturn<T> {
  data: T | null
  loading: boolean
  error: FirebaseServiceError | null
  refetch: () => Promise<void>
  reset: () => void
}

// Standard hook return signature for mutation hooks (write operations)
export interface StandardMutationReturn<TData, TVariables = any> {
  data: TData | null
  loading: boolean
  error: FirebaseServiceError | null
  mutate: (variables: TVariables) => Promise<TData>
  reset: () => void
}

// Base hook factory for mutations
export function useStandardizedMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
): StandardMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<FirebaseServiceError | null>(null)

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mutationFn(variables)
      setData(result)
      return result
    } catch (err) {
      const firebaseError = err instanceof FirebaseServiceError 
        ? err 
        : new FirebaseServiceError(
            'Unknown error occurred',
            'unknown',
            'mutation'
          )
      setError(firebaseError)
      throw firebaseError
    } finally {
      setLoading(false)
    }
  }, [mutationFn])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, mutate, reset }
}

// Base hook factory for queries
export function useStandardizedQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = []
): StandardQueryReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<FirebaseServiceError | null>(null)

  const executeQuery = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await queryFn()
      setData(result)
    } catch (err) {
      const firebaseError = err instanceof FirebaseServiceError 
        ? err 
        : new FirebaseServiceError(
            'Unknown error occurred',
            'unknown',
            'query'
          )
      setError(firebaseError)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, refetch: executeQuery, reset }
}

// Hook state management utilities
export const createHookState = <T>() => ({
  data: null as T | null,
  loading: false,
  error: null as FirebaseServiceError | null
})

// Error transformation utility
export const transformError = (error: unknown, operation: string, collection?: string): FirebaseServiceError => {
  if (error instanceof FirebaseServiceError) {
    return error
  }
  
  return new FirebaseServiceError(
    error instanceof Error ? error.message : 'Unknown error occurred',
    'unknown',
    operation,
    collection
  )
}