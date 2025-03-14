"use client"

import { Get } from '@/api/Usuarios/get'
import { getQueryClient } from '@/components/provider/get-query-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/useAuthStore'
import { UsersType } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Index = () => {
 
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(Get)
    const { data:Instructores } = useSuspenseQuery(Get);
    const [InstructoresRoles, setInstructoresRoles] = useState<UsersType[]>([])

    const User = useAuthStore((state) => state.user)

    useEffect(() => {
        // Roles permitidos para la lógica principal
        const allowedRoles = ["admin", "formacion de grupo", "instructor"];
        const instructores = Instructores.filter(profesor => profesor.role === "instructor");

        // Validar si el usuario está autenticado
        if (!User) {
            redirect('/admin/clases/prueba');
            return;
        }

        // Permitir acceso a un usuario específico (independientemente de su rol)
        if (User.id === 'fZBbWtrIihQvkITliDfLHHhK6rA3') {
            setInstructoresRoles(instructores); // Permitir acceso completo
            return;
        }

        // Validar roles permitidos para otros usuarios
        if (!allowedRoles.includes(User.role)) {
            redirect('/admin/clases/prueba');
            return;
        }

        // Lógica para roles permitidos
        if (User.role === "instructor") {
            setInstructoresRoles(instructores.filter(profesor => profesor.id === User.id));
        } else {
            setInstructoresRoles(instructores);
        }
    }, [User])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba - Instructor</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {
                    InstructoresRoles.map(profesor => (
                        <Card key={profesor.id} className="border-l-4 border-l-primary">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{profesor.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={'instructor/'+profesor.id}>
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