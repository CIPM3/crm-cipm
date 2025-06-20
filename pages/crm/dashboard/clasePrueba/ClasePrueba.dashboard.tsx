"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { UserCog } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { AgendadorDashboard } from "@/components/dashboard/agendador-dashboard"
import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard"
import { FormacionDashboard } from "@/components/dashboard/formacion-dashboard"
import { useAuthStore } from "@/store/useAuthStore"

// Tipos de roles disponibles
type UserRole = "admin" | "agendador" | "instructor" | "formacion"

export const ClasePruebaDashboard = () => {
    const User = useAuthStore((state) => state.user)
      const [selectedRole, setSelectedRole] = useState<UserRole | null>(null) // Estado inicial vacío
      const [loadingRole, setLoadingRole] = useState(true) // Estado de carga
    
      useEffect(() => {
        // Simular una llamada asíncrona para obtener el rol del usuario
        const fetchRole = async () => {
          setLoadingRole(true)
          try {
            // Simula una llamada a una API o servicio
            const role = User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3" ? "admin" : User?.role
            setSelectedRole(role as UserRole)
          } catch (error) {
            console.error("Error al obtener el rol del usuario:", error)
          } finally {
            setLoadingRole(false)
          }
        }
    
        fetchRole()
      }, [User])
    
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            
    
            {/* Selector de rol (solo para demostración) */}
            {User?.role === "admin" || User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3" ? (
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedRole || undefined} onValueChange={(value: UserRole) => setSelectedRole(value)}>
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
            ) : null}
          </div>
    
          {/* Renderizar el dashboard según el rol seleccionado */}
          {selectedRole === "admin" && <AdminDashboard />}
          {selectedRole === "agendador" && <AgendadorDashboard />}
          {selectedRole === "instructor" && <InstructorDashboard />}
          {selectedRole === "formacion" && <FormacionDashboard />}
        </div>
      )
    }