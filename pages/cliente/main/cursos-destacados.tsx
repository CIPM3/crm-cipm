import CursoCard from '@/components/card/curso-card'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CursosDestacados = () => {
    const featuredCourses = courses
        .filter((course) => course.status === "Activo")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
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
                <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
                    {featuredCourses.map((course) => (
                        <CursoCard key={course.id} curso={course} type='cliente'/>
                    ))}
                </div>
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
