'use client'

import CreateAgendadoDialog from '@/components/dialog/agendador/create-agendado.dialog'
import TableAgendador from '@/components/table/table-agendador'
import { useGetAgendadores } from '@/hooks/agendador/useGetAgendadores'
import { useGetAgendados } from '@/hooks/agendador/useGetAgendados'
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore'
import { AgendadorFormValues } from '@/types'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Index = ({ params }: { params: { id: string } }) => {

    const [OPEN_CREATE, setOPEN_CREATE] = useState(false)
    const [OPEN_EDIT, setOPEN_EDIT] = useState(false)
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false)

    const [Selected, setSelected] = useState<AgendadorFormValues>({
        nombreAlumno:"",
        anoSemana:"",
        diaContacto:"",
        quienAgendo:"",
        modalidad:"",
        mesContacto:""
    });

    const { Agendadores } = useGetAgendadores()

    // Obtener estudiantes
    const { Usuarios: Estudiantes, loading, error, refetch } = useGetAgendados()
    

    const { shouldRefetch, resetRefetch, triggerRefetch } = useRefetchUsuariosStore();

    useEffect(() => {
        if (shouldRefetch) {
            refetch();
            resetRefetch();
        }
    }, [shouldRefetch, refetch, resetRefetch]);

    // Filtrar estudiantes por el ID del instructor
    const agendados = Estudiantes?.filter((estudiante) => estudiante.quienAgendo === params.id) || [];
    const Agendador = Agendadores?.find((instructor) => instructor.id === params.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - {Agendador?.name}</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <CreateAgendadoDialog
                open={OPEN_CREATE}
                setIsOpen={setOPEN_CREATE}
                onSuccess={() => {
                    triggerRefetch();
                    setOPEN_CREATE(false);
                }}
            />

            <div className="flex justify-between gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Tabla de agendados</h1>
                <button
                    onClick={() => setOPEN_CREATE(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    <Plus />
                </button>
            </div>

            <TableAgendador
                setOPEN_DELETE={setOPEN_DELETE}
                setOPEN_EDIT={setOPEN_EDIT}
                Agendador={Agendador}
                estudiantes={agendados}
                setSelected={setSelected}
            />
        </div>
    )
}

export default Index