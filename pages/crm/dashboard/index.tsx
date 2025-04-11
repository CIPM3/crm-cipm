"use client"

import { useState } from "react"
import { UserCog } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { AgendadorDashboard } from "@/components/dashboard/agendador-dashboard"
import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard"
import { FormacionDashboard } from "@/components/dashboard/formacion-dashboard"
import { useAuthStore } from "@/store/useAuthStore"

// Tipos de roles disponibles
type UserRole = "admin" | "agendador" | "instructor" | "formacion"

export default function DashboardPage() {
  // Estado para el rol seleccionado (en un sistema real, esto vendría de la autenticación)

  const User = useAuthStore((state) => state.user)
  const Role = User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3" ? "admin" : User?.role
  const [selectedRole, setSelectedRole] = useState<UserRole>(Role as UserRole)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de métricas y rendimiento de la plataforma</p>
        </div>

        {/* Selector de rol (solo para demostración) */}
        {
          User?.role === "admin" || User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3" && (
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="agendador">Agendador</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="formacion">Formación de Grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )
        }

      </div>

      {/* Renderizar el dashboard según el rol seleccionado */}
      {selectedRole === "admin" && <AdminDashboard />}
      {selectedRole === "agendador" && <AgendadorDashboard />}
      {selectedRole === "instructor" && <InstructorDashboard />}
      {selectedRole === "formacion" && <FormacionDashboard />}
    </div>
  )
}

