"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetFormacion } from '@/hooks/formacion/useGetFormacion';
import { useAuthStore } from '@/store/useAuthStore';
import { UsersType } from '@/types';
import { Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function FormacionPage() {
    const { data: FormacionGrupo, loading, error } = useGetFormacion();
    const [InstructoresRoles, setInstructoresRoles] = useState<UsersType[]>([]);
    const User = useAuthStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // Roles permitidos para la lógica principal
        const allowedRoles = ["admin", "formacion de grupo"];

        // Validar si el usuario está autenticado
        if (!User) {
            router.push('/admin/clases/prueba');
            return;
        }

        // Permitir acceso a un usuario específico (independientemente de su rol)
        if (User.id === 'fZBbWtrIihQvkITliDfLHHhK6rA3') {
            setInstructoresRoles(FormacionGrupo); // Permitir acceso completo
            return;
        }

        // Validar roles permitidos para otros usuarios
        if (!allowedRoles.includes(User.role)) {
            router.push('/admin/clases/prueba');
            return;
        }

        // Lógica para roles permitidos
        if (User.role === "formacion de grupo") {
            // Los usuarios con rol "formacion de grupo" pueden ver las opciones
            setInstructoresRoles(FormacionGrupo);
        } else {
            setInstructoresRoles(FormacionGrupo);
        }
    }, [User, FormacionGrupo, loading, router]);

    if (loading) {
        return (
            <div className="space-y-6 h-[86dvh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                    <p className="mt-4">Cargando información de formación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 h-[86dvh] flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p>Error: {error.message}</p>
                    <button 
                        onClick={() => router.push('/admin/clases/prueba')}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Volver a Clases Prueba
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-[86dvh]">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - Formación Grupo</h1>
                <p className="text-muted-foreground">Información para la gestión de las clases de prueba en grupo</p>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Horarios</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Link href={'/admin/clases/prueba/formacion/horarios'}>
                            <button className='w-full border-input border my-3 rounded-md text-[12px] p-2 hover:bg-gray-50 transition-colors'>
                                Ver horarios aquí
                            </button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clase Prueba</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Link href={'/admin/clases/prueba/formacion/clase-prueba'}>
                            <button className='w-full border-input border my-3 rounded-md text-[12px] p-2 hover:bg-gray-50 transition-colors'>
                                Gestionar clase prueba
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}