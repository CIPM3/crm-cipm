import { ScheduleEditor } from '@/components/schedule/Schedule-profesores'
import React from 'react'

const index = () => {
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - Formacion Grupo - Horarios</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <ScheduleEditor />

        </div>
    )
}

export default index
