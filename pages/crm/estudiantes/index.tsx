"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import EstudianteCard from "@/components/card/estudiante-card"
import { useGetUsuarios } from "@/hooks/usuarios/useGetUsuarios"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { Usuarios, loading, error } = useGetUsuarios()
  const Estudiantes = Usuarios.filter((user) => user.role === "cliente")

  const students = Estudiantes.map((user) => ({
    id: user.id,
    name: user.name.toLocaleLowerCase(),
    email: user.email,
    phone: user.phone || "N/A",
    status: user.status || "Activo",
    lastLogin: user.createdAt || "N/A",
  }))

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || student.status === statusFilter),
  )

  if (loading) return (
    <div className="flex flex-col h-[86dvh]">
      <Header isLoading={loading} isError={!!error} />
      <div className="grid gap-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-40 bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col h-[86dvh]">
      <Header isLoading={loading} isError={!!error} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <p className="text-destructive">Error al cargar estudiantes: {error.message}</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[86dvh]">
      <Header isLoading={loading} isError={!!error} />
      <div className="flex flex-col md:flex-row gap-4 flex-wrap mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar estudiantes..."
            className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full md:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <div className="grid gap-6">
        {filteredStudents.map((student) => (
          <EstudianteCard
            key={student.id}
            student={{
              id: student.id,
              name: student.name,
              email: student.email,
              phone: student.phone,
              status: student.status,
              lastLogin: student.lastLogin || "N/A",
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface HeaderProps {
  isLoading: boolean
  isError: boolean
}
const Header = ({ isLoading, isError }: HeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
      <p className="text-muted-foreground">Gestiona tus estudiantes y sus inscripciones</p>
    </div>
    {
      !isError && !isLoading && (
        <Button asChild>
          <Link href='/admin/estudiantes/nuevo'>
            <Plus className="mr-2 h-4 w-4" />
            Añadir Estudiante
          </Link>
        </Button>
      )
    }
  </div>
)