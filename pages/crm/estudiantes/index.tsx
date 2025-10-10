"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useGetUsuarios } from "@/hooks/usuarios/useGetUsuarios"

// Lazy load EstudianteCard to reduce initial bundle
const EstudianteCard = dynamic(() => import("@/components/card/estudiante-card"), {
  loading: () => (
    <div className="h-40 bg-muted rounded-md animate-pulse" />
  ),
})

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 20

  const { data: Usuarios, loading, error } = useGetUsuarios()
  const Estudiantes = (Usuarios || []).filter((user) => user.role === "cliente")

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

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

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

      {filteredStudents.length > 0 ? (
        <>
          {/* Info bar */}
          <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
            <span>
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} de {filteredStudents.length} estudiantes
            </span>
            {totalPages > 1 && (
              <span>Página {currentPage} de {totalPages}</span>
            )}
          </div>

          {/* Simple paginated list */}
          <div className="grid gap-6">
            {paginatedStudents.map((student) => (
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
                delay={0}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {Estudiantes.length === 0
              ? "No hay estudiantes registrados con rol 'cliente'"
              : "No se encontraron estudiantes que coincidan con los filtros"}
          </p>
          {Usuarios && Usuarios.length > 0 && Estudiantes.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Total de usuarios en el sistema: {Usuarios.length}
            </p>
          )}
        </div>
      )}
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