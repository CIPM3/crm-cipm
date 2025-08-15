// hooks/useCreateCourse.ts

import { useEffect, useState } from "react"
import { Course } from "@/types/"
import { createCourse,getAllCourses,getCourseById, updateCourse,deleteCourse } from "@/api/Cursos/"

export const useCreateCourse = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<{ id: string } | null>(null)

  const mutate = async (course: Omit<Course, "id">) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createCourse(course)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, data, loading, error }
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
  const [data, setData] = useState<{ id: string } | null>(null)

  const mutate = async (id: string, course: Partial<Course>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await updateCourse(id, course)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, data, loading, error }
}

export const useDeleteCourse = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<{ id: string } | null>(null)

  const mutate = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await deleteCourse(id)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, data, loading, error }
}