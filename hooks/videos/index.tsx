
import { useEffect, useState } from "react"
import { CreateVideoForm } from "@/types/"
import { createVideo,deleteVideo,getAllVideos,getVideoById,updateVideo } from "@/api/videos";

export const useCreateVideo= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (course: Omit<CreateVideoForm, "id">) => {
    setLoading(true)
    setError(null)
    try {
      return await createVideo(course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useFetchVideos = () => {
  const [videos, setVideos] = useState<CreateVideoForm[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllVideos()
        setVideos(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { videos, loading, error }
}

export const useGetVideoById = (id: string) => {
  const [video, setVideo] = useState<CreateVideoForm| null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getVideoById(id)
        setVideo(result || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { video, loading, error }
}


export const useUpdateVideo= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, course: Partial<CreateVideoForm>) => {
    setLoading(true)
    setError(null)
    try {
      return await updateVideo(id, course)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteVideo= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await deleteVideo(id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}