import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { ClasePrubeaType, UsersType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    Agendador: UsersType | undefined;
    estudiantes: ClasePrubeaType[];
    setOPEN_EDIT: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<ClasePrubeaType | null>>;
    setOPEN_DELETE: React.Dispatch<React.SetStateAction<boolean>>;
    isloading?: boolean;
    isError?: boolean | null | undefined;
}

const TableInstructor = ({ Agendador, estudiantes, setOPEN_DELETE, setOPEN_EDIT, setSelected, isError, isloading }: Props) => {
    // Función mejorada para formatear la fecha de Firebase
    const formatFirebaseDate = (timestamp: any): string => {
        if (!timestamp) return 'Fecha no válida';

        // Si es un objeto de Firebase Timestamp
        if (timestamp.seconds && timestamp.nanoseconds !== undefined) {
            try {
                const date = new Date(timestamp.seconds * 1000);
                return format(date, "MM/dd/yyyy");
            } catch (error) {
                console.error("Error al formatear fecha Firebase:", error);
                return 'Fecha inválida';
            }
        }

        // Si ya es una cadena de texto
        if (typeof timestamp === 'string') {
            try {
                const date = new Date(timestamp);
                return isNaN(date.getTime()) ? timestamp : format(date, "MM/dd/yyyy");
            } catch {
                return timestamp;
            }
        }

        // Si es un objeto Date
        if (timestamp instanceof Date) {
            return format(timestamp, "MM/dd/yyyy");
        }

        return 'Formato no soportado';
    };

    // Función para renderizar valores de forma segura
    const safeRender = (value: any): string | number | React.ReactNode => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'string' || typeof value === 'number') return value;
        if (value.seconds && value.nanoseconds !== undefined) return formatFirebaseDate(value);
        return JSON.stringify(value); // como último recurso
    };

    return (
        <Table>
            <TableCaption>Estudiantes asignados a: {safeRender(Agendador?.name)}</TableCaption>
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
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    isloading ? (
                        <>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={10} className="text-center">
                                        <Skeleton
                                            className='w-full h-10'
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        <>
                            {estudiantes.map((estudiante, index) => (
                                <TableRow key={index}>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.nombreAlumno)}</TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.numero)}</TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.dia)}</TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.horario)}</TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.observaciones)}</TableCell>
                                    <TableCell className="w-fit px-3">
                                        {formatFirebaseDate(estudiante.fecha)}
                                    </TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(Agendador?.name)}</TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.nivel)}</TableCell>
                                    <TableCell className="w-fit px-3">{safeRender(estudiante.subNivel)}</TableCell>
                                    <TableCell className="flex items-center space-x-2">
                                        <Button
                                            onClick={() => {
                                                setOPEN_EDIT(true);
                                                setSelected({
                                                    ...estudiante,
                                                    maestro: estudiante.maestro || "",
                                                    fecha: estudiante.fecha,
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
                                                    fecha: estudiante.fecha,
                                                });
                                            }}
                                            className="bg-transparent border-input border group hover:bg-red-500">
                                            <Trash className="text-gray-500 size-4 group-hover:text-white" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    )
                }
                {
                    isError && (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center">
                                Error al cargar los datos
                            </TableCell>
                        </TableRow>
                    )
                }

            </TableBody>
            <TableFooter className="hidden">
                <TableRow>
                    <TableCell colSpan={10}>Total: {estudiantes.length} estudiantes</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default TableInstructor