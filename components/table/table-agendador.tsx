import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { ClasePrubeaAgendadorType, ClasePrubeaType, UsersType } from '@/types';

interface Props {
    Agendador: UsersType | undefined;
    estudiantes: ClasePrubeaAgendadorType[];
    setOPEN_EDIT: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<ClasePrubeaType | null>>;
    setOPEN_DELETE: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableAgendador = ({ setOPEN_DELETE, setOPEN_EDIT, Agendador, estudiantes }: Props) => {
    console.log(estudiantes)
    return (
        <Table>
            <TableCaption>Estudiantes agendados por: Luis Rios</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombres</TableHead>
                    <TableHead>Semana</TableHead>
                    <TableHead>Dia de contacto</TableHead>
                    <TableHead>Mes</TableHead>
                    <TableHead>Quien agendo</TableHead>
                    <TableHead>Modalidad y Horario Presencial</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    estudiantes.map((estudiante) => (
                        <TableRow>
                            <TableCell className="w-fit px-3">{estudiante.nombreAlumno}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.anoSemana}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.diaContacto}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.mesContacto}</TableCell>
                            <TableCell className="w-fit px-3">{Agendador?.name}</TableCell>
                            <TableCell className="w-fit px-3"></TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Button
                                    onClick={() => {
                                        setOPEN_EDIT(true);
                                        // setSelected({
                                        //     ...estudiante,
                                        //     maestro: estudiante.maestro || "",
                                        //     fecha: estudiante.fecha,
                                        // });
                                    }}
                                    className="bg-transparent border-input border group hover:bg-secondary"
                                >
                                    <Edit className="text-gray-500 size-4 group-hover:text-white" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOPEN_DELETE(true);
                                        // setSelected({
                                        //     ...estudiante,
                                        //     maestro: estudiante.maestro || "",
                                        //     fecha: estudiante.fecha,
                                        // });
                                    }}
                                    className="bg-transparent border-input border group hover:bg-red-500">
                                    <Trash className="text-gray-500 size-4 group-hover:text-white" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }


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

export default TableAgendador
