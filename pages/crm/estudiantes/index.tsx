"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { students, getEnrollmentsByStudentId } from "@/lib/utils"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || student.status === statusFilter),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
          <p className="text-muted-foreground">Gestiona tus estudiantes y sus inscripciones</p>
        </div>
        <Link href='/admin/estudiantes/nuevo'>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Añadir Estudiante
          </Button>
        </Link>

      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
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
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filtrar</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredStudents.map((student) => {
          const enrollments = getEnrollmentsByStudentId(student.id)
          return (
            <Link href={`/admin/estudiantes/${student.id}`} key={student.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{student.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.status === "Activo" ? "default" : "secondary"}>{student.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Más opciones</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm">
                        <span className="font-medium">Último acceso:</span> {student.lastLogin}
                      </div>
                      <div className="text-sm font-medium">{enrollments.length} cursos inscritos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

