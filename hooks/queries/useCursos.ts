import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { 
  getAllCursos, 
  createCurso, 
  updateCurso, 
  deleteCurso,
  getCursoById 
} from '@/lib/firebaseService'
import { CursoDataType } from '@/types'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback } from 'react'

// Enhanced hook for getting all cursos with filters and performance optimization
export const useGetCursos = (filters?: { 
  published?: boolean 
  search?: string 
  category?: string 
  instructor?: string 
}) => {
  const memoizedFilters = useMemo(() => filters, [
    filters?.published, 
    filters?.search, 
    filters?.category, 
    filters?.instructor
  ])

  return useServerOptimizedQuery({
    queryKey: queryKeys.cursosList(memoizedFilters),
    queryFn: async () => {
      const data = await getAllCursos()
      
      // Apply client-side filtering for better performance
      if (!memoizedFilters) return data
      
      return data.filter(curso => {
        if (memoizedFilters.published !== undefined && curso.published !== memoizedFilters.published) {
          return false
        }
        if (memoizedFilters.search && !curso.titulo.toLowerCase().includes(memoizedFilters.search.toLowerCase())) {
          return false
        }
        if (memoizedFilters.category && curso.categoria !== memoizedFilters.category) {
          return false
        }
        if (memoizedFilters.instructor && curso.instructorId !== memoizedFilters.instructor) {
          return false
        }
        return true
      })
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - courses change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    select: useCallback((data: (CursoDataType & { id: string })[]) => {
      // Sort by creation date (newest first) and add computed properties
      return data
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .map(curso => ({
          ...curso,
          // Add computed properties for UI
          isPublished: curso.published || false,
          moduleCount: curso.modulos?.length || 0,
          duration: curso.duracion || 0,
          enrollmentCount: 0 // This would be computed from enrollment data
        }))
    }, [])
  })
}

// Get curso by ID with enhanced caching and error handling
export const useGetCurso = (id: string, includeModules?: boolean) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.curso(id),
    queryFn: async () => {
      const curso = await getCursoById(id)
      
      // Optionally fetch modules data in parallel
      if (includeModules && curso.modulos) {
        // This would typically be separate API calls
        // For now, we'll return the basic curso data
      }
      
      return curso
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    select: useCallback((data: CursoDataType & { id: string }) => ({
      ...data,
      // Add computed properties
      isPublished: data.published || false,
      moduleCount: data.modulos?.length || 0,
      canEdit: true, // This would be based on user permissions
      lastUpdated: new Date(data.updatedAt || data.fechaCreacion).toLocaleDateString()
    }), [])
  })
}

// Create curso mutation with optimistic updates and enhanced error handling
export const useCreateCurso = () => {
  return useServerOptimizedMutation<
    { id: string },
    Omit<CursoDataType, 'id'>
  >({
    mutationFn: async (cursoData) => {
      // Validate data before sending
      if (!cursoData.titulo?.trim()) {
        throw new Error('El título del curso es requerido')
      }
      if (!cursoData.descripcion?.trim()) {
        throw new Error('La descripción del curso es requerida')
      }
      
      return await createCurso(cursoData)
    },
    invalidateQueries: getInvalidationKeys.onCursoCreate(),
    optimisticUpdate: {
      queryKey: queryKeys.cursosList(),
      updater: (oldData: (CursoDataType & { id: string })[] | undefined, variables) => {
        if (!oldData) return []
        
        const optimisticCurso: CursoDataType & { id: string } = {
          ...variables,
          id: `temp-${Date.now()}`,
          fechaCreacion: new Date().toISOString(),
          published: false,
          modulos: []
        }
        
        return [optimisticCurso, ...oldData]
      }
    },
    onSuccess: async (data, variables) => {
      console.log('Curso created successfully:', data.id)
      
      // Additional success actions
      if (typeof window !== 'undefined') {
        // Show success notification
        window.dispatchEvent(new CustomEvent('curso-created', {
          detail: { id: data.id, titulo: variables.titulo }
        }))
      }
    },
    onError: (error, variables) => {
      console.error('Error creating curso:', error, variables)
      
      // Additional error handling
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('curso-error', {
          detail: { error: error.message }
        }))
      }
    }
  })
}

// Update curso mutation with partial updates and conflict resolution
export const useUpdateCurso = () => {
  return useServerOptimizedMutation<
    { id: string },
    { id: string; cursoData: Partial<CursoDataType> }
  >({
    mutationFn: async ({ id, cursoData }) => {
      // Validate updates
      if (cursoData.titulo !== undefined && !cursoData.titulo?.trim()) {
        throw new Error('El título del curso no puede estar vacío')
      }
      
      return await updateCurso(id, cursoData)
    },
    optimisticUpdate: {
      queryKey: queryKeys.cursosList(),
      updater: (oldData: (CursoDataType & { id: string })[] | undefined, { id, cursoData }) => {
        if (!oldData) return []
        
        return oldData.map(curso => 
          curso.id === id 
            ? { ...curso, ...cursoData, updatedAt: new Date().toISOString() }
            : curso
        )
      }
    },
    onSuccess: async (data, { id, cursoData }) => {
      // Invalidate related queries
      const invalidationKeys = getInvalidationKeys.onCursoUpdate(id)
      
      console.log('Curso updated successfully:', id)
      
      // Update specific curso in cache
      const queryClient = useQueryClient()
      queryClient.setQueryData(queryKeys.curso(id), (oldData: any) => {
        if (!oldData) return oldData
        return { ...oldData, ...cursoData, updatedAt: new Date().toISOString() }
      })
    },
    onError: (error, { id }) => {
      console.error('Error updating curso:', error, id)
    }
  })
}

// Delete curso mutation with cascade effects
export const useDeleteCurso = () => {
  return useServerOptimizedMutation<
    { id: string },
    string
  >({
    mutationFn: async (id) => {
      // Check for dependencies before deletion
      // This would typically involve checking enrollments, etc.
      
      await deleteCurso(id)
      return { id }
    },
    optimisticUpdate: {
      queryKey: queryKeys.cursosList(),
      updater: (oldData: (CursoDataType & { id: string })[] | undefined, id) => {
        if (!oldData) return []
        return oldData.filter(curso => curso.id !== id)
      }
    },
    onSuccess: async (data, id) => {
      // Invalidate related queries
      const invalidationKeys = getInvalidationKeys.onCursoDelete(id)
      
      console.log('Curso deleted successfully:', id)
      
      // Clean up related cache entries
      const queryClient = useQueryClient()
      queryClient.removeQueries({ queryKey: queryKeys.curso(id) })
      queryClient.removeQueries({ queryKey: queryKeys.cursoModulos(id) })
    },
    onError: (error, id) => {
      console.error('Error deleting curso:', error, id)
      
      // Check if error is due to dependencies
      if (error.message.includes('enrollment') || error.message.includes('dependency')) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('curso-delete-blocked', {
            detail: { 
              id, 
              reason: 'El curso tiene estudiantes inscritos y no puede ser eliminado' 
            }
          }))
        }
      }
    }
  })
}

// Bulk operations hook for performance
export const useBulkCursoOperations = () => {
  const queryClient = useQueryClient()
  
  const bulkUpdate = useCallback(async (updates: Array<{ id: string; data: Partial<CursoDataType> }>) => {
    const promises = updates.map(({ id, data }) => updateCurso(id, data))
    const results = await Promise.allSettled(promises)
    
    // Invalidate all affected queries
    queryClient.invalidateQueries({ queryKey: queryKeys.cursosList() })
    
    return results
  }, [queryClient])
  
  const bulkDelete = useCallback(async (ids: string[]) => {
    const promises = ids.map(id => deleteCurso(id))
    const results = await Promise.allSettled(promises)
    
    // Clean up cache
    ids.forEach(id => {
      queryClient.removeQueries({ queryKey: queryKeys.curso(id) })
    })
    queryClient.invalidateQueries({ queryKey: queryKeys.cursosList() })
    
    return results
  }, [queryClient])
  
  return { bulkUpdate, bulkDelete }
}

// Course statistics hook
export const useCursoStats = (id: string) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.cursoStats(id),
    queryFn: async () => {
      // This would fetch enrollment counts, completion rates, etc.
      // For now, returning mock data structure
      return {
        totalEnrollments: 0,
        activeEnrollments: 0,
        completionRate: 0,
        averageRating: 0,
        totalRevenue: 0
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes - stats change frequently
    gcTime: 15 * 60 * 1000
  })
}