import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { ClasePrubeaAgendadorType, UsersType } from '@/types';
import { format } from 'date-fns';

interface Props {
    Agendador: UsersType | undefined;
    estudiantes: ClasePrubeaAgendadorType[];
    setOPEN_EDIT: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<ClasePrubeaAgendadorType | null>>;
    setOPEN_DELETE: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableAgendador = ({ setOPEN_DELETE, setOPEN_EDIT, Agendador, estudiantes, setSelected }: Props) => {

    return (
        <Table>
            <TableCaption>Estudiantes agendados por: Luis Rios</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombres</TableHead>
                    <TableHead>Semana</TableHead>
                    <TableHead>Dia de contacto</TableHead>
                    <TableHead>Mes de contacto</TableHead>
                    <TableHead>Quien agendo</TableHead>
                    <TableHead>Fecha de clase</TableHead>
                    <TableHead>Hora de clase</TableHead>
                    <TableHead>Mayor/menor de edad</TableHead>
                    <TableHead>Modalidad y Horario Presencial</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    estudiantes.map((estudiante) => (
                        <TableRow key={estudiante.id}>
                            <TableCell className="w-fit px-3">{estudiante.nombreAlumno}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.anoSemana}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.diaContacto}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante.mesContacto}</TableCell>
                            <TableCell className="w-fit px-3">{Agendador?.name}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante?.diaClasePrueba
                                ? format(new Date(estudiante.diaClasePrueba.seconds * 1000), 'd / MMMM')
                                : 'No definido'}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante?.horaClasePrueba}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante?.mayorEdad}</TableCell>
                            <TableCell className="w-fit px-3">{estudiante?.modalidad}</TableCell>

                            {/* OPC BUTTONS */}
                            <TableCell className="flex items-center space-x-2">
                                <Button
                                    onClick={() => {
                                        setOPEN_EDIT(true);
                                        setSelected({
                                            ...estudiante
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
                                            ...estudiante
                                        });
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
