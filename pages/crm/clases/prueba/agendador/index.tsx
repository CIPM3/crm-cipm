"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAgendadores } from '@/hooks/agendador/useGetAgendadores'
import { useAuthStore } from '@/store/useAuthStore'
import { UsersType } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Index = () => {
    const { data: Agendadores, loading, error } = useGetAgendadores();
    const [InstructoresRoles, setInstructoresRoles] = useState<UsersType[]>([]);
    const User = useAuthStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // Roles permitidos para la lógica principal
        const allowedRoles = ["admin", "formacion de grupo", "agendador"];

        // Validar si el usuario está autenticado
        if (!User) {
            router.push('/admin/clases/prueba');
            return;
        }

        // Permitir acceso a un usuario específico (independientemente de su rol)
        if (User.id === 'fZBbWtrIihQvkITliDfLHHhK6rA3') {
            setInstructoresRoles(Agendadores || []); // Permitir acceso completo
            return;
        }

        // Validar roles permitidos para otros usuarios
        if (!allowedRoles.includes(User.role)) {
            router.push('/admin/clases/prueba');
            return;
        }

        // Lógica para roles permitidos
        if (User.role === "agendador") {
            // Si el usuario es agendador, solo mostrar su propio perfil
            setInstructoresRoles(Agendadores?.filter(agendador => agendador.id === User.id) || []);
        } else {
            // Admin y formacion de grupo pueden ver todos
            setInstructoresRoles(Agendadores || []);
        }
    }, [User, Agendadores, loading, router]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="space-y-6 h-[86dvh]">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - Agendador</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {
                    InstructoresRoles.map(agendador => (
                        <Card key={agendador.id} className="border-l-4 border-l-primary">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{agendador.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/admin/clases/prueba/agendador/${agendador.id}`}>
                                    <button className='w-full border-input border my-3 rounded-md text-[12px] p-2'>Agendar aqui</button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}

export default Index