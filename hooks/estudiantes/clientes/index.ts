import { useEffect, useState } from "react"
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from "@/api/Estudiantes/clientes"
import type { Usuario } from "@/api/Estudiantes/clientes"

// Crear cliente
export const useCreateCliente = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (cliente: Omit<Usuario, "id">) => {
    setLoading(true)
    setError(null)
    try {
      return await createUsuario(cliente)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

// Obtener todos los clientes
export const useFetchClientes = () => {
  const [clientes, setClientes] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllUsuarios()
        setClientes(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { clientes, loading, error }
}

// Obtener cliente por ID
export const useGetClienteById = (id: string) => {
  const [cliente, setCliente] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getUsuarioById(id)
        setCliente(result || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  return { cliente, loading, error }
}

// Actualizar cliente
export const useUpdateCliente = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, data: Partial<Usuario>) => {
    setLoading(true)
    setError(null)
    try {
      return await updateUsuario(id, data)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

// Eliminar cliente
export const useDeleteCliente = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await deleteUsuario(id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}