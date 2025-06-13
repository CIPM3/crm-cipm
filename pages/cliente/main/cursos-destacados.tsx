"use client"

import CursoCard from '@/components/card/curso-card'
import CursoCardSkeleton from '@/components/card/curso-skeleton-card'
import { Button } from '@/components/ui/button'
import { useFetchCourses } from '@/hooks/cursos'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { gsap } from "gsap"

const CursosDestacados = () => {
    const { courses, loading, error } = useFetchCourses()
    const sectionRef = useRef<HTMLDivElement>(null)

    const featuredCourses = courses
        .filter((course) => course.status === "Activo")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    gsap.fromTo(
                        ".cursos-titulo",
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.8 }
                    )
                    gsap.fromTo(
                        ".cursos-subtitulo",
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
                    )
                    gsap.fromTo(
                        ".curso-card-animada",
                        { opacity: 0, x: -60, scale: 0.95 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.9, stagger: 0.18, delay: 0.4, ease: "power3.out" }
                    )
                }
            },
            { threshold: 0.2 }
        )

        observer.observe(section)
        return () => observer.disconnect()
    }, [featuredCourses.length])

    return (
        <Content ref={sectionRef}>
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
                    <h3 className='text-gray-500'>Ocurrió un error al cargar los cursos.</h3>
                </div>
            }

            {!loading && !error && featuredCourses.length === 0 && (
                <p>No hay cursos destacados disponibles.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6">
                {!loading && !error && featuredCourses.map((course, index) => (
                    <div
                        key={course.id}
                        className="h-full curso-card-animada"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <CursoCard curso={course} type='cliente' />
                    </div>
                ))}
            </div>
        </Content>
    )
}

const Content = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
    ({ children }, ref) => {
        const User = useAuthStore((state) => state.user)
        const Href = User ? "/cursos" : "/register"

        return (
            <section id="cursos" ref={ref} className="w-full py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl cursos-titulo">
                                Cursos Destacados
                            </h2>
                            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed cursos-subtitulo">
                                Descubre nuestra selección de cursos más populares
                            </p>
                        </div>
                    </div>
                    {children}
                    <div className="flex justify-center mt-12">
                        <Button variant="outline" size="lg" asChild>
                            <Link href={Href}>
                                Ver todos los cursos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        )
    }
)

Content.displayName = "Content"

export default CursosDestacados