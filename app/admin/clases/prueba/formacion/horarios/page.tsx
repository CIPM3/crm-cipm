import { ScheduleEditor } from '@/components/schedule/Schedule-profesores'
import React from 'react'

export default function HorariosPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - Formación Grupo - Horarios</h1>
                <p className="text-muted-foreground">Información para la gestión de horarios de clases de prueba</p>
            </div>

            <ScheduleEditor />
        </div>
    )
}