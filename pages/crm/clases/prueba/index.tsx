"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Album, Boxes, CalendarPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'

const page = () => {
    const currentUser = useAuthStore((state) => state.user)

    const canViewAgendarClase = currentUser?.role === 'agendador' || currentUser?.role === 'admin' || currentUser?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3"
    const canViewInstructor = currentUser?.role === 'instructor' || currentUser?.role === 'admin' || currentUser?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3"
    const canViewFormacionGrupo = currentUser?.role === 'formacion de grupo' || currentUser?.role === 'admin' || currentUser?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3"

    return (
        <div className="space-y-6 h-[86dvh]">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clases Prueba</h1>
                <p className="text-muted-foreground">Informacion para la gestion de las clases de prueba</p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {canViewAgendarClase && (
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Agendar clase prueba</CardTitle>
                            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Link href={"/admin/clases/prueba/agendador"}>
                                <button className='w-full border-input border my-3 rounded-md text-[12px] p-2'>Agendar aqui</button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {canViewInstructor && (
                    <Card className="border-l-4 border-l-secondary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clase Prueba Instructor</CardTitle>
                            <Album className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Link href={"/admin/clases/prueba/instructor"}>
                                <button className='w-full border-input border my-3 rounded-md text-[12px] p-2'>Completa la informacion</button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {canViewFormacionGrupo && (
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Formacion de grupo</CardTitle>
                            <Boxes className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Link href={"/admin/clases/prueba/formacion"}>
                                <button className='w-full border-input border my-3 rounded-md text-[12px] p-2'>Formacion de grupo - Clases prueba</button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    )
}

export default page