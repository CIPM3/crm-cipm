
import { useEffect, useState } from "react"
import { Module } from "@/types/"
import { createModule, getAllModules,getModuleById,updateModule,deleteModule } from "@/api/Modulos";

export const useCreateModule= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (course: Omit<Module, "id">) => {
    setLoading(true)
    setError(null)
    try {
      return await createModule(course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useFetchModules = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllModules()
        setModules(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { modules, loading, error }
}

export const useGetModuleById = (id: string) => {
  const [module, setModule] = useState<Module| null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getModuleById(id)
        setModule(result || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { module, loading, error }
}

export const useGetModulesByCourseId = (courseId: string) => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllModules()
        const filteredModules = result.filter((module) => module.courseId === courseId)
        setModules(filteredModules)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  return { modules, loading, error }
}

export const useUpdateModule= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, course: Partial<Module>) => {
    setLoading(true)
    setError(null)
    try {
      return await updateModule(id, course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteModule= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await deleteModule(id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}