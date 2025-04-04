'use client'

import { Calendar } from '@/components/calendario/calendario-instructor';
import CreateAgendadoDialog from '@/components/dialog/instructor/create-agendado.dialog';
import DeleteAgendadoDialog from '@/components/dialog/instructor/delete.agendado-dialog';
import UpdateAgendadoDialog from '@/components/dialog/instructor/update-agendado-dialog';
import TableInstructor from '@/components/table/table-instructor';
import { useGetAgendados } from '@/hooks/agendador/useGetAgendados';
import { useGetEstudiantes } from '@/hooks/estudiantes/clases-prueba/useGetStudents';
import { useGetInstructores } from '@/hooks/usuarios/useGetInstructores';
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore';
import { getWeek, getYear } from 'date-fns';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface AgendadoFormValues {
    nombreAlumno: string;
    numero: string;
    dia: string;
    horario: string;
    observaciones: string;
    fecha: Date;
    maestro: string;
    nivel: string;
    subNivel: string;
    anoSemana:string;
}

const Index = ({ params }: { params: { id: string } }) => {
    const [OPEN_CREATE, setOPEN_CREATE] = useState(false);
    const [OPEN_EDIT, setOPEN_EDIT] = useState(false);
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false);
    const ActualWeek = `${getYear(new Date()).toString().replace("20", "")}${getWeek(new Date())}`

    const [Selected, setSelected] = useState<AgendadoFormValues>({
        nombreAlumno: "",
        numero: "",
        dia: "",
        horario: "",
        observaciones: "",
        fecha: new Date(),
        maestro: "",
        nivel: "",
        subNivel: "",
        anoSemana:""
    });

    // Obtener datos
    const { Instructores } = useGetInstructores();
    const { Users: Estudiantes, refetch: refetchEstudiantes,loading,error } = useGetEstudiantes();
    const { Usuarios: Agendados, refetch: refetchAgendados } = useGetAgendados();
    const { shouldRefetch, resetRefetch, triggerRefetch } = useRefetchUsuariosStore();

    useEffect(() => {
        if (shouldRefetch) {
            refetchEstudiantes();
            refetchAgendados();
            resetRefetch();
        }
    }, [shouldRefetch, refetchEstudiantes, refetchAgendados, resetRefetch]);

    // Filtrar datos por el ID del instructor
    const estudiantesFiltrados = Estudiantes?.filter(estudiante => estudiante.maestro === params.id && estudiante.anoSemana === ActualWeek) || [];
    const agendadosFiltrados = Agendados?.filter(agendado => agendado.maestro === params.id && agendado.anoSemana === ActualWeek) || [];


    const Instructor = Instructores?.find(instructor => instructor.id === params.id);

    const handleCreateSuccess = () => {
        triggerRefetch();
        setOPEN_CREATE(false);
    };

    const handleUpdateSuccess = () => {
        triggerRefetch();
        setOPEN_EDIT(false);
    };

    const handleDeleteSuccess = () => {
        triggerRefetch();
        setOPEN_DELETE(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - {Instructor?.name}</h1>
                <p className="text-muted-foreground">Información para la gestión de las clases de prueba</p>
            </div>

            <CreateAgendadoDialog 
                open={OPEN_CREATE} 
                setIsOpen={setOPEN_CREATE} 
                onSuccess={handleCreateSuccess} 
            />
            
            <UpdateAgendadoDialog 
                estudiante={Selected} 
                open={OPEN_EDIT} 
                setIsOpen={setOPEN_EDIT} 
                onSuccess={handleUpdateSuccess} 
            />
            
            <DeleteAgendadoDialog 
                estudiante={Selected} 
                open={OPEN_DELETE} 
                setIsOpen={setOPEN_DELETE} 
                onSuccess={handleDeleteSuccess} 
            />

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Calendario de Agendados</h1>
                <Calendar estudiantes={agendadosFiltrados} />
            </div>

            <div className="flex justify-between gap-2 items-center">
                <h1 className="text-2xl font-bold tracking-tight">Tabla de Estudiantes</h1>
                <button
                    onClick={() => setOPEN_CREATE(true)}
                    className="bg-blue-500 hidden text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <TableInstructor
                Agendador={Instructor}
                estudiantes={estudiantesFiltrados}
                setOPEN_DELETE={setOPEN_DELETE}
                setOPEN_EDIT={setOPEN_EDIT}
                setSelected={setSelected}
                isError={error ? true : false}
                isloading={loading}
            />
        </div>
    );
};

export default Index;