// hooks/useCreateCourse.ts

import { useEffect, useState } from "react"
import { Course } from "@/types/"
import { createCourse,getAllCourses,getCourseById, updateCourse,deleteCourse } from "@/api/Cursos/"

export const useCreateCourse = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (course: Omit<Course, "id">) => {
    setLoading(true)
    setError(null)
    try {
      return await createCourse(course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useFetchCourses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllCourses()
        setCourses(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { courses, loading, error }
}

export const useGetCourseById = (id: string) => {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getCourseById(id)
        setCourse(result || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { course, loading, error }
}

export const useUpdateCourse = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, course: Partial<Course>) => {
    setLoading(true)
    setError(null)
    try {
      return await updateCourse(id, course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteCourse = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await deleteCourse(id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}