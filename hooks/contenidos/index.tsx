
import { useEffect, useState } from "react"
import { Content, ContentItem } from "@/types/"
import { createContent,getAllContent,getContentById,updateContent,deleteContent } from "@/api/Contents";

export const useCreateContent= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (course: Omit<Content, "id">) => {
    setLoading(true)
    setError(null)
    try {
      return await createContent(course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useFetchContents = () => {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllContent()
        setContent(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { content, loading, error }
}

export const useGetContentById = (id: string) => {
  const [content, setContent] = useState<Content| null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getContentById(id)
        setContent(result || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { content, loading, error }
}

export const useGetContentsByModuleId = (moduleId: string) => {
  const [content, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllContent()
        const filteredContents = result.filter((module) => module.moduleId === moduleId)
        setContents(filteredContents)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [moduleId])

  return { content, loading, error }
}

export const useUpdateContent= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, course: Partial<Content>) => {
    setLoading(true)
    setError(null)
    try {
      return await updateContent(id, course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteContent= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await deleteContent(id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}