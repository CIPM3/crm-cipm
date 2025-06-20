"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import React, { useState } from 'react'
import { ClasePruebaDashboard } from "./clasePrueba/ClasePrueba.dashboard"
import CursosDashboard from "./cursos/CursosDashboard"
import VideosDashboard from "./videos/VideosDashboard"
import EstudiantesDashboard from "./estudiantes/EstudiantesDashboard"

const index = () => {

  const [TabSelection, setTabSelection] = useState("Clase Prueba")

  const tabsInfo = [
    { value: "clase-prueba", label: "Clase Prueba" },
    { value: "cursos", label: "Cursos" },
    { value: "videos", label: "Videos" },
    { value: "estudiantes", label: "Estudiantes" }
  ]

  return (
    <div className="space-y-6 min-h-screen max-h-[87dvh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard {TabSelection}</h1>
          <p className="text-muted-foreground">Resumen de métricas y rendimiento de la plataforma</p>
        </div>
      </div>
      <Tabs defaultValue="cursos" className="w-full">
        <TabsList
          className="w-full flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide py-2 md:pl-0 pl-[30dvh]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {tabsInfo.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setTabSelection(tab.label)}
              className="flex-shrink-0 min-w-[120px]"
            >
              {tab.label}
            </TabsTrigger>
          ))} 
        </TabsList>
        <TabsContent value="clase-prueba">
          {/* Aquí puedes renderizar las estadísticas de clase prueba */}
          <ClasePruebaDashboard />
        </TabsContent>
        <TabsContent value="cursos">
          {/* Aquí puedes renderizar las estadísticas de cursos */}
          <CursosDashboard />
        </TabsContent>
        <TabsContent value="videos">
          {/* Aquí puedes renderizar las estadísticas de videos */}
          <VideosDashboard/>
        </TabsContent>
        <TabsContent value="estudiantes">
          {/* Aquí puedes renderizar las estadísticas de estudiantes */}
          <EstudiantesDashboard/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default index
