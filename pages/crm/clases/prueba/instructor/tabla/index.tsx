'use client'

import { Calendar } from '@/components/calendario/calendario-instructor';
import CreateAgendadoDialog from '@/components/dialog/instructor/create-agendado.dialog';
import DeleteAgendadoDialog from '@/components/dialog/instructor/delete.agendado-dialog';
import UpdateAgendadoDialog from '@/components/dialog/instructor/update-agendado-dialog';
import TableInstructor from '@/components/table/table-instructor';
import { useGetEstudiantes } from '@/hooks/estudiantes/clases-prueba/useGetStudents';
import { useGetInstructores } from '@/hooks/usuarios/useGetInstructores';
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore';
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
}

const Index = ({ params }: { params: { id: string } }) => {
    const [OPEN_CREATE, setOPEN_CREATE] = useState(false);
    const [OPEN_EDIT, setOPEN_EDIT] = useState(false);
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false)

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
    });

    // Obtener instructores
    const { Instructores } = useGetInstructores()

    // Obtener estudiantes
    const { Users: Estudiantes, loading, error, refetch } = useGetEstudiantes()

    const { shouldRefetch, resetRefetch, triggerRefetch } = useRefetchUsuariosStore();

    useEffect(() => {
        if (shouldRefetch) {
            refetch();
            resetRefetch();
        }
    }, [shouldRefetch, refetch, resetRefetch]);

    // Filtrar estudiantes por el ID del instructor
    const estudiantes = Estudiantes?.filter((estudiante) => estudiante.maestro === params.id) || [];
    const Instructor = Instructores?.find((instructor) => instructor.id === params.id);

    const handleCreateSuccess = () => {
        triggerRefetch(); // Refetch de la query de estudiantes
        setOPEN_CREATE(false);
    };

    const handleUpdateSuccess = () => {
        triggerRefetch(); // Refetch de la query de estudiantes
        setOPEN_EDIT(false);
    };

    const handleDeleteSuccess = () => {
        triggerRefetch(); // Refetch de la query de estudiantes
        setOPEN_DELETE(false);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - {Instructor?.name}</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <CreateAgendadoDialog open={OPEN_CREATE} setIsOpen={setOPEN_CREATE} onSuccess={handleCreateSuccess} />
            <UpdateAgendadoDialog estudiante={Selected} open={OPEN_EDIT} setIsOpen={setOPEN_EDIT} onSuccess={handleUpdateSuccess} />
            <DeleteAgendadoDialog estudiante={Selected} open={OPEN_DELETE} setIsOpen={setOPEN_DELETE} onSuccess={handleDeleteSuccess} />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Calendario</h1>
            </div>

            <Calendar estudiantes={estudiantes} />



            <div className=" justify-between gap-2 hidden">
                <h1 className="text-2xl font-bold tracking-tight">Tabla de agendados</h1>
                <button
                    onClick={() => setOPEN_CREATE(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    <Plus />
                </button>
            </div>


            <TableInstructor
                Instructor={Instructor}
                estudiantes={estudiantes}
                setOPEN_DELETE={setOPEN_DELETE}
                setOPEN_EDIT={setOPEN_EDIT}
                setSelected={setSelected}
            />
        </div>
    );``
};

export default Index;