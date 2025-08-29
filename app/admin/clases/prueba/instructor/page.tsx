"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetInstructores } from '@/hooks/usuarios/useGetInstructores'
import { useAuthStore } from '@/store/useAuthStore'
import { UsersType } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function InstructorPage() {
    const { data: Instructores, loading, error } = useGetInstructores();
    const [InstructoresRoles, setInstructoresRoles] = useState<UsersType[]>([]);
    const User = useAuthStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // Roles permitidos para la lógica principal
        const allowedRoles = ["admin", "formacion de grupo", "instructor"];

        // Validar si el usuario está autenticado
        if (!User) {
            router.push('/admin/clases/prueba');
            return;
        }

        // Permitir acceso a un usuario específico (independientemente de su rol)
        if (User.id === 'fZBbWtrIihQvkITliDfLHHhK6rA3') {
            setInstructoresRoles(Instructores); // Permitir acceso completo
            return;
        }

        // Validar roles permitidos para otros usuarios
        if (!allowedRoles.includes(User.role)) {
            router.push('/admin/clases/prueba');
            return;
        }

        // Lógica para roles permitidos
        if (User.role === "instructor") {
            router.push('/admin/clases/prueba/instructor/' + User.id)
        } else {
            setInstructoresRoles(Instructores);
        }
    }, [User, Instructores, loading, router]);

    if (loading) {
        return (
            <div className="space-y-6 h-[86dvh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                    <p className="mt-4">Cargando instructores...</p>
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
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - Instructor</h1>
                <p className="text-muted-foreground">Información para la gestión de las clases de prueba</p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {
                    InstructoresRoles.map(profesor => (
                        <Card key={profesor.id} className="border-l-4 border-l-primary">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{profesor.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={'/admin/clases/prueba/instructor/' + profesor.id}>
                                    <button className='w-full border-input border my-3 rounded-md text-[12px] p-2 hover:bg-gray-50 transition-colors'>
                                        Ver detalles
                                    </button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>

            {InstructoresRoles.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay instructores disponibles</p>
                </div>
            )}
        </div>
    )
}