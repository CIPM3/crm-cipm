import { useEffect, useState } from "react"
import {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByCourseId,
  getEnrollmentsByStudentId,
} from "@/api/Enrollment"
import type { Enrollment } from "@/types"

// Obtener todos los enrollments
export const useFetchEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllEnrollments()
        setEnrollments(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { enrollments, loading, error }
}

// Obtener enrollment por ID
export const useGetEnrollmentById = (id: string) => {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getEnrollmentById(id)
        setEnrollment(result || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  return { enrollment, loading, error }
}

// Obtener enrollments por courseId
export const useGetEnrollmentsByCourseId = (courseId: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getEnrollmentsByCourseId(courseId)
      setEnrollments(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  return { enrollments, loading, error, refetch: fetchData }
}

export function useGetEnrollmentsByStudentId(studentId: string) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    getEnrollmentsByStudentId(studentId)
      .then(setEnrollments)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [studentId])

  return { enrollments, loading, error }
}

// Crear enrollment
export const useCreateEnrollment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (data: Omit<Enrollment, "id">) => {
    setLoading(true)
    setError(null)
    try {
      return await createEnrollment(data)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

// Actualizar enrollment
export const useUpdateEnrollment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, data: Partial<Enrollment>) => {
    setLoading(true)
    setError(null)
    try {
      return await updateEnrollment(id, data)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

// Eliminar enrollment
export const useDeleteEnrollment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await deleteEnrollment(id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}