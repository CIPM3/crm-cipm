// hooks/cursos/index.tsx - Standardized Course Hooks

import { useEffect } from "react"
import { Course } from "@/types/"
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from "@/api/Cursos/"
import { 
  useStandardizedMutation, 
  useStandardizedQuery,
  StandardMutationReturn,
  StandardQueryReturn
} from "../core/useStandardizedHook"

// === MUTATION HOOKS (Write Operations) ===

export const useCreateCourse = (): StandardMutationReturn<{ id: string }, Omit<Course, "id">> => {
  return useStandardizedMutation(async (courseData: Omit<Course, "id">) => {
    return await createCourse(courseData)
  })
}

export const useUpdateCourse = (): StandardMutationReturn<{ id: string }, { id: string; data: Partial<Course> }> => {
  return useStandardizedMutation(async ({ id, data }: { id: string; data: Partial<Course> }) => {
    return await updateCourse(id, data)
  })
}

export const useDeleteCourse = (): StandardMutationReturn<{ id: string }, string> => {
  return useStandardizedMutation(async (id: string) => {
    return await deleteCourse(id)
  })
}

// === QUERY HOOKS (Read Operations) ===

export const useFetchCourses = (): StandardQueryReturn<Course[]> & { courses: Course[] } => {
  const queryResult = useStandardizedQuery<Course[]>(() => getAllCourses())
  
  // Auto-fetch on mount
  useEffect(() => {
    queryResult.refetch()
  }, [])

  return {
    ...queryResult,
    courses: queryResult.data || [] // Legacy compatibility
  }
}

export const useGetCourseById = (id: string): StandardQueryReturn<Course> & { course: Course | null } => {
  const queryResult = useStandardizedQuery<Course>(
    () => getCourseById(id),
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
    course: queryResult.data // Legacy compatibility
  }
}

// === BATCH OPERATIONS ===

export const useBatchCourseOperations = () => {
  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()
  const deleteMutation = useDeleteCourse()

  const batchCreate = async (courses: Omit<Course, "id">[]): Promise<{ id: string }[]> => {
    const results = await Promise.all(
      courses.map(course => createMutation.mutate(course))
    )
    return results
  }

  const batchUpdate = async (updates: { id: string; data: Partial<Course> }[]): Promise<{ id: string }[]> => {
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
// These maintain backward compatibility with existing code

export const useCreateCourseV1 = () => {
  const mutation = useCreateCourse()
  return {
    mutate: (course: Omit<Course, "id">) => mutation.mutate(course),
    data: mutation.data,
    loading: mutation.loading,
    error: mutation.error
  }
}

export const useFetchCoursesV1 = () => {
  const query = useFetchCourses()
  return {
    courses: query.courses,
    loading: query.loading,
    error: query.error
  }
}

export const useGetCourseByIdV1 = (id: string) => {
  const query = useGetCourseById(id)
  return {
    course: query.course,
    loading: query.loading,
    error: query.error
  }
}