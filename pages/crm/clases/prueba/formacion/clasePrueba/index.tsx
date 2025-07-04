import TableFormacion from '@/components/table/table-formacion'
import React from 'react'

const index = () => {
    return (
        <div className="space-y-6 h-[87dvh]">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <div className="flex justify-between gap-2 items-center">
                <h1 className="text-2xl font-bold tracking-tight">Tabla de Estudiantes</h1>
                
            </div>

            <TableFormacion/>
        </div>
    )
}

export default index
