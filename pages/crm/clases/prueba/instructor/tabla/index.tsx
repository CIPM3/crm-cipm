'use client'
import { getAllStudents } from '@/api/Estudiantes/clase-prueba/get';
import { Calendar } from '@/components/calendario/calendario-instructor';
import CreateAgendadoDialog from '@/components/dialog/instructor/create-agendado.dialog';
import DeleteAgendadoDialog from '@/components/dialog/instructor/delete.agendado-dialog';
import UpdateAgendadoDialog from '@/components/dialog/instructor/update-agendado-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetEstudiantes } from '@/hooks/estudiantes/clases-prueba/useGetStudents';
import { useGetInstructores } from '@/hooks/usuarios/useGetInstructores';
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore';
import { AgendadoFormValues, CalendarEvent, EventStatus } from '@/types';
import { format } from 'date-fns';
import { Edit, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

const Index = ({ params }: { params: { id: string } }) => {
    const [OPEN_CREATE, setOPEN_CREATE] = useState(false);
    const [OPEN_EDIT, setOPEN_EDIT] = useState(false);
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false)
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

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

            <div className="flex justify-between gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Tabla de agendados</h1>
                <button
                    onClick={() => setOPEN_CREATE(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    <Plus />
                </button>
            </div>

            <Table>
                <TableCaption>Estudiantes asignados a: {Instructor?.name}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre Alumno</TableHead>
                        <TableHead>Numero</TableHead>
                        <TableHead>Dia</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Observaciones</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Maestro</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Sub Nivel (solo Intermedio)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {estudiantes.map((estudiante, index) => (
                        <TableRow key={index}>
                            <TableCell className="w-fit px-3">{estudiante.nombreAlumno}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.numero}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.dia}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.horario}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.observaciones}</TableCell>
                            <TableCell>
                                {estudiante.fecha
                                    ? format(new Date(estudiante.fecha.seconds * 1000), "MM/dd/yyyy")
                                    : "Fecha no válida"}
                            </TableCell>
                            <TableCell className="w-fit px-3">{Instructor?.name}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.nivel}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.subNivel}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Button
                                    onClick={() => {
                                        setOPEN_EDIT(true);
                                        setSelected({
                                            ...estudiante,
                                            maestro: estudiante.maestro || "",
                                            fecha: new Date(estudiante.fecha.seconds * 1000),
                                        });
                                    }}
                                    className="bg-transparent border-input border group hover:bg-secondary"
                                >
                                    <Edit className="text-gray-500 size-4 group-hover:text-white" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOPEN_DELETE(true);
                                        setSelected({
                                            ...estudiante,
                                            maestro: estudiante.maestro || "",
                                            fecha: new Date(estudiante.fecha.seconds * 1000),
                                        });
                                    }}
                                    className="bg-transparent border-input border group hover:bg-red-500">
                                    <Trash className="text-gray-500 size-4 group-hover:text-white" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="hidden">
                    <TableRow>
                        <TableCell colSpan={8}>Total</TableCell>
                        <TableCell className="text-right">$2,400.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default Index;