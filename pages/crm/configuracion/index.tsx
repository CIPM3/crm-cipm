"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/useAuthStore"
import PerfilTab from "./perfil"
import CuentaTab from "./cuenta"
import AparienciaTab from "./apariencia"
import UsuariosTab from "./usuarios"
import SistemaTab from "./sistema"

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState("perfil")

  const UserData = useAuthStore((state) => state.user)
  const currentUser = UserData

  return (
    <div className="space-y-6 h-[86dvh]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Administra tus preferencias y configuración del sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex overflow-x-auto pl-16 md:pl-0">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          {(currentUser?.role === "admin" || currentUser?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3") && (
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          )}
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="space-y-6">
          <PerfilTab />
        </TabsContent>
        <TabsContent value="cuenta" className="space-y-6">
          <CuentaTab />
        </TabsContent>
        <TabsContent value="apariencia" className="space-y-6">
          <AparienciaTab />
        </TabsContent>
        {(currentUser?.role === "admin" || currentUser?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3") && (
          <TabsContent value="usuarios" className="space-y-6">
            <UsuariosTab />
          </TabsContent>
        )}
        <TabsContent value="sistema" className="space-y-6">
          <SistemaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}