'use client'

import CreateAgendadoDialog from '@/components/dialog/agendador/create-agendado.dialog'
import DeleteAgendadoDialog from '@/components/dialog/agendador/delete.agendado.dialog'
import UpdateAgendadoDialog from '@/components/dialog/agendador/update-agendado-dialog'
import TableAgendador from '@/components/table/table-agendador'
import { useGetAgendadores } from '@/hooks/agendador/useGetAgendadores'
import { useGetAgendados } from '@/hooks/agendador/useGetAgendados'
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore'
import { AgendadorFormValues } from '@/types'
import { getWeek, getYear } from 'date-fns'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Index = ({ params }: { params: { id: string } }) => {
    const [OPEN_CREATE, setOPEN_CREATE] = useState(false)
    const [OPEN_EDIT, setOPEN_EDIT] = useState(false)
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false)

    const [Selected, setSelected] = useState<AgendadorFormValues>({
        nombreAlumno: "",
        anoSemana: "",
        diaContacto: "",
        quienAgendo: "",
        modalidad: "",
        mesContacto: "",
        mayorEdad: "", // Valor por defecto
        nivel: "", // Valor por defecto
        horaClasePrueba: "", // Valor por defecto
        diaClasePrueba: ""
    });

    const { data: Agendadores } = useGetAgendadores()
    const { data: Estudiantes, loading, error, refetch } = useGetAgendados()
    const { shouldRefetch, resetRefetch, triggerRefetch } = useRefetchUsuariosStore();

    useEffect(() => {
        if (shouldRefetch) {
            refetch();
            resetRefetch();
        }
    }, [shouldRefetch, refetch, resetRefetch]);
    const AnoSemana = `${getYear(new Date()).toString().replace("20", "")}${getWeek(new Date())}`
    const agendados = (Estudiantes || []).filter((estudiante) => estudiante.quienAgendo === params.id && estudiante.anoSemana === AnoSemana);
    const Agendador = (Agendadores || []).find((instructor) => instructor.id === params.id);

    return (
        <div className="space-y-6 h-[86dvh]">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - {Agendador?.name}</h1>
            </div>

            <CreateAgendadoDialog
                open={OPEN_CREATE}
                setIsOpen={setOPEN_CREATE}
                onSuccess={() => {
                    triggerRefetch();
                    setOPEN_CREATE(false);
                }}
            />

            <UpdateAgendadoDialog
                estudiante={Selected}
                onSuccess={() => {
                    triggerRefetch();
                    setOPEN_EDIT(false)
                }}
                setIsOpen={setOPEN_EDIT}
                open={OPEN_EDIT}
            />

            <DeleteAgendadoDialog
                estudiante={Selected}
                onSuccess={() => {
                    triggerRefetch();
                    setOPEN_DELETE(false)
                }}
                setIsOpen={setOPEN_DELETE}
                open={OPEN_DELETE}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Tabla de agendados</h1>
                <button
                    onClick={() => setOPEN_CREATE(true)}
                    className="bg-blue-500 w-fit ml-auto text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={16} />
                    Agregar Clase Prueba
                </button>
            </div>

            <TableAgendador
                setOPEN_DELETE={setOPEN_DELETE}
                setOPEN_EDIT={setOPEN_EDIT}
                Agendador={Agendador}
                estudiantes={agendados}
                setSelected={setSelected}
                isError={error ? true : false}
                isLoading={loading}
            />
        </div>
    )
}

export default Index