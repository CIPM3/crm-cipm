"use client"

import React, { useEffect, useState } from 'react'
import {
    Table, TableBody, TableCell, TableFooter,
    TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Edit, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { useGetFormacionStudents } from '@/hooks/formacion/useGetStudentsFormacion';
import { useGetInstructores } from '@/hooks/usuarios/useGetInstructores';
import UpdateStudentDialog from '../dialog/formacion/update-student-dialog';
import DeleteStudentDialog from '../dialog/formacion/delete-student-dialog';
import { FormacionDataType } from '@/types';
import { useRefetchUsuariosStore } from '@/store/useRefetchUsuariosStore';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '../ui/select';
import { NIVELES_NAVS, STATUS_VALS } from '@/lib/constants';

const toDateObject = (fecha: any): Date | null => {
    if (!fecha) return null;
    if (fecha.seconds && fecha.nanoseconds !== undefined) {
        return new Date(fecha.seconds * 1000);
    }
    if (typeof fecha === 'string' || fecha instanceof Date) {
        const date = new Date(fecha);
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
};

const TableFormacion = () => {
    const { data: FormacionData, loading, error, refetch } = useGetFormacionStudents()
    const { data: Instructores } = useGetInstructores()
    const { shouldRefetch, resetRefetch, triggerRefetch } = useRefetchUsuariosStore()

    const [OPEN_EDIT, setOPEN_EDIT] = useState(false)
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false)
    const [Selected, setSelected] = useState<FormacionDataType>()

    const uniqueWeeks = Array.from(
        new Set((FormacionData || []).map((item) => item.week).filter(Boolean))
    ).sort();

    const uniqueHours = Array.from(
        new Set((FormacionData || []).map((item) => item.horario).filter(Boolean))
    ).sort();


    const [filters, setFilters] = useState({
        status: 'all',
        week: 'all',
        maestro: 'all',
        nivel: 'all',
        horario: 'all',
    });

    useEffect(() => {
        if (shouldRefetch) {
            refetch();
            resetRefetch();
        }
    }, [shouldRefetch, refetch, resetRefetch]);

    const formatFirebaseDate = (timestamp: any): string => {
        const date = toDateObject(timestamp);
        return date ? format(date, "MM/dd/yyyy") : "Fecha inválida";
    }

    const safeRender = (value: any): string | number | React.ReactNode => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'string' || typeof value === 'number') return value;
        if (value.seconds && value.nanoseconds !== undefined) return formatFirebaseDate(value);
        return JSON.stringify(value); // fallback
    }

    const sortedData = [...FormacionData].sort((a, b) => {
        const dateA = toDateObject(a.fecha);
        const dateB = toDateObject(b.fecha);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime(); // ascendente
    });

    const filteredData = sortedData.filter((item) => {
        const { status, week, maestro, nivel, horario } = filters;
        return (
            (status === 'all' || item.status === status) &&
            (week === 'all' || item.week === week) &&
            (maestro === 'all' || item.maestro === maestro) &&
            (nivel === 'all' || item.nivel === nivel) &&
            (horario === 'all' || item.horario === horario)
        );
    });

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                {/* Status */}
                <div className="flex flex-col w-full min-w-[150px]">
                    <label className='text-sm font-semibold mb-1'>Status</label>
                    <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {STATUS_VALS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Semana */}
                <div className="flex flex-col w-full min-w-[150px]">
                    <label className='text-sm font-semibold mb-1'>Semana</label>
                    <Select
                        value={filters.week}
                        onValueChange={(value) => setFilters({ ...filters, week: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Semana" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {uniqueWeeks.map((week) => (
                                <SelectItem key={week} value={week}>
                                    {week}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Horario */}
                <div className="flex flex-col w-full min-w-[150px]">
                    <label className='text-sm font-semibold mb-1'>Horario</label>
                    <Select
                        value={filters.horario}
                        onValueChange={(value) => setFilters({ ...filters, horario: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Horario" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {uniqueHours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Nivel */}
                <div className="flex flex-col w-full min-w-[150px]">
                    <label className='text-sm font-semibold mb-1'>Nivel</label>
                    <Select
                        value={filters.nivel}
                        onValueChange={(value) => setFilters({ ...filters, nivel: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {NIVELES_NAVS.map((nivel) => (
                                <SelectItem key={nivel.value} value={nivel.value}>
                                    {nivel.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Maestro */}
                <div className="flex flex-col w-full min-w-[150px]">
                    <label className='text-sm font-semibold mb-1'>Maestro</label>
                    <Select
                        value={filters.maestro}
                        onValueChange={(value) => setFilters({ ...filters, maestro: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Maestro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {(Instructores || []).map((i) => (
                                <SelectItem key={i.id} value={i.id}>
                                    {i.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Week</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Telefono</TableHead>
                        <TableHead>Modalidad</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Observaciones</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Maestro</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={12}><Skeleton className="w-full h-10" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        filteredData.map((estudiante, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.status)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.week)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.nombre)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.telefono)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.modalidad)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.horario)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.observaciones)}</TableCell>
                                <TableCell className="w-fit px-3">{formatFirebaseDate(estudiante.fecha)}</TableCell>
                                <TableCell className="w-fit px-3">
                                    {(Instructores || []).find(maestro => maestro.id === estudiante.maestro)?.name || "-"}
                                </TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.nivel)}</TableCell>
                                <TableCell className="w-fit px-3">{safeRender(estudiante.tipo)}</TableCell>
                                <TableCell className="flex items-center space-x-2">
                                    <Button onClick={() => { setOPEN_EDIT(true); setSelected(estudiante); }} className="bg-transparent border-input border group hover:bg-secondary">
                                        <Edit className="text-gray-500 size-4 group-hover:text-white" />
                                    </Button>
                                    <Button onClick={() => { setOPEN_DELETE(true); setSelected(estudiante); }} className="bg-transparent border-input border group hover:bg-red-500">
                                        <Trash className="text-gray-500 size-4 group-hover:text-white" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                    {error && (
                        <TableRow>
                            <TableCell colSpan={12} className="text-center">
                                <p>Error al cargar los datos.</p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

                <TableFooter className="hidden" />
            </Table>

            <UpdateStudentDialog
                open={OPEN_EDIT}
                setIsOpen={setOPEN_EDIT}
                onSuccess={() => {
                    setOPEN_EDIT(false);
                    triggerRefetch();
                }}
                selected={Selected!!}
            />

            <DeleteStudentDialog
                open={OPEN_DELETE}
                setIsOpen={setOPEN_DELETE}
                onSuccess={() => {
                    setOPEN_DELETE(false);
                    triggerRefetch();
                }}
                selected={Selected!!}
            />
        </>
    )
}

export default TableFormacion;
