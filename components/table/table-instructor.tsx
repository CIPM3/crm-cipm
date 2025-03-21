import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Edit, Trash } from 'lucide-react';
import { ClasePrubeaType, UsersType } from '@/types';

interface Props {
    Agendador: UsersType | undefined;
    estudiantes: ClasePrubeaType[];
    setOPEN_EDIT: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<ClasePrubeaType | null>>;
    setOPEN_DELETE: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableInstructor = ({Agendador,estudiantes,setOPEN_DELETE,setOPEN_EDIT,setSelected}:Props) => {
    return (
        <Table>
            <TableCaption>Estudiantes asignados a: {Agendador?.name}</TableCaption>
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
                        <TableCell className="w-fit px-3">{Agendador?.name}</TableCell>
                        <TableCell className="w-fit px-3">{estudiante.nivel}</TableCell>
                        <TableCell className="w-fit px-3">{estudiante.subNivel}</TableCell>
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
            </TableBody>
            <TableFooter className="hidden">
                <TableRow>
                    <TableCell colSpan={8}>Total</TableCell>
                    <TableCell className="text-right">$2,400.00</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default TableInstructor
