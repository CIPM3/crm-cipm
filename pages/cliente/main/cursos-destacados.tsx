"use client"

import CursoCard from '@/components/card/curso-card'
import CursoCardSkeleton from '@/components/card/curso-skeleton-card'
import { Button } from '@/components/ui/button'
import { useFetchCourses } from '@/hooks/cursos'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CursosDestacados = () => {

    const { courses, loading, error } = useFetchCourses()

    const featuredCourses = courses
        .filter((course) => course.status === "Activo")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)

    return (
        <Content>
            {loading &&
                <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }, (_, index) => (
                        <CursoCardSkeleton key={index} />
                    ))}
                </div>}
            {error &&
                <div className='w-full h-full flex flex-col gap-5 items-center justify-center'>
                    <div className="relative transition-transform mt-10 duration-500 ease-in-out group-hover:scale-105">
                        <img
                            src="/404.svg?height=400&width=600"
                            alt="Estudiantes aprendiendo"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-contain"
                            width={600}
                            height={400}
                        />
                        <div className="absolute inset-0 rounded-xl ring-inset ring-primary/10"></div>
                    </div>

                    <h3 className='text-gray-500'>Ocurrio un error al cargar los cursos.</h3>
                </div>
            }

            {!loading && !error && featuredCourses.length === 0 && (
                <p>No hay cursos destacados disponibles.</p>
            )}

            <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
                {!loading && !error && featuredCourses.map((course) => (
                    <CursoCard curso={course} type='cliente' />
                ))}
            </div>

        </Content>
    )
}


const Content = ({ children }) => {
    return (
        <section id="cursos" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Cursos Destacados</h2>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Descubre nuestra selección de cursos más populares
                        </p>
                    </div>
                </div>

                {children}
                <div className="flex justify-center mt-12">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/register">
                            Ver todos los cursos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CursosDestacados
