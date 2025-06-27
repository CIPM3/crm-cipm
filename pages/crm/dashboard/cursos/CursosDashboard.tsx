import {
    Book,
    Star,
    Users,
    BarChart3,
    Layers,
} from "lucide-react"
import { useFetchCourses } from "@/hooks/cursos"
import { useFetchModules } from "@/hooks/modulos"
import { useFetchEnrollments } from "@/hooks/enrollments"
import { useFetchContents } from "@/hooks/contenidos"

import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import SkeletonCard from "../SkeletonCard"

const StatCard = ({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
    highlight?: boolean
}) => {
    const valueRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (valueRef.current) {
            gsap.fromTo(
                valueRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
            )
        }
    }, [value])

    return (
        <div
            ref={valueRef}
            className={`flex flex-col items-center justify-center bg-white dark:bg-muted rounded-xl shadow-md border p-6 min-h-[160px] ${highlight ? "border-primary" : "border-gray-100 dark:border-gray-800"
                }`}
        >
            <div className="mb-2 text-primary text-3xl">{icon}</div>
            <div className="text-center text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
                {label}
            </div>
            <div
                className={`font-bold text-black dark:text-white ${typeof value === "string" && value.length > 25
                        ? "text-lg md:text-xl"
                        : "text-3xl md:text-4xl"
                    } text-center break-words w-full`}
            >
                {value}
            </div>
        </div>
    )
}

export default function CursosDashboard() {
    const { courses,loading:coursesLoading} = useFetchCourses()
    const { modules,loading:modulesLoading } = useFetchModules()
    const { enrollments,loading:enrollmentsLoading } = useFetchEnrollments()
    const { content: contents,loading:studentsLoading } = useFetchContents()

    const isLoading = enrollmentsLoading || coursesLoading || studentsLoading || modulesLoading

    // Estadísticas generales
    const totalCursos = courses.length
    const cursosConRating = courses.filter((c) => typeof c.rating === "number" && !isNaN(c.rating))
    const promedioRating =
        cursosConRating.length > 0
            ? (cursosConRating.reduce((acc, c) => acc + c.rating, 0) / cursosConRating.length).toFixed(2)
            : "0.00"

    const totalInscripciones = enrollments.length

    // Curso más popular (por inscripciones reales)
    const cursoMasPopular =
        courses.length > 0
            ? courses
                .map((curso) => ({
                    ...curso,
                    inscripciones: enrollments.filter((e) => e.courseId === curso.id).length,
                }))
                .reduce(
                    (max, curso) =>
                        curso.inscripciones > max.inscripciones ? curso : max,
                    { inscripciones: 0 }
                )
            : { title: "N/A", inscripciones: 0 }

    // Curso con más contenido (usando contents)
    const cursoConMasContenido =
        courses.length > 0
            ? courses
                .map((curso) => {
                    // Buscar módulos de este curso
                    const modulosCurso = modules.filter((m) => m.courseId === curso.id)
                    // Buscar contenidos de esos módulos
                    const totalContenido = modulosCurso.reduce(
                        (acc, m) =>
                            acc + contents.filter((c) => c.moduleId === m.id).length,
                        0
                    )
                    return { ...curso, totalContenido }
                })
                .reduce(
                    (max, curso) =>
                        curso.totalContenido > max.totalContenido ? curso : max,
                    { totalContenido: 0 }
                )
            : { title: "N/A", totalContenido: 0 }

    if (isLoading) {
        // Muestra 6 skeletons mientras carga
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard icon={<Book size={32} />} label="Total de Cursos" value={totalCursos} />
            <StatCard icon={<Star size={32} />} label="Promedio de rating" value={promedioRating} />
            <StatCard icon={<Users size={32} />} label="Total de inscripciones" value={totalInscripciones} />
            <StatCard
                icon={<BarChart3 size={32} />}
                label="Curso más popular"
                value={
                    <span>
                        {cursoMasPopular.title}
                        <br />
                        <span className="text-lg font-normal text-gray-500">
                            ({cursoMasPopular.inscripciones} inscripciones)
                        </span>
                    </span>
                }
                highlight
            />
            <StatCard
                icon={<Layers size={32} />}
                label="Curso con más contenido"
                value={
                    <span>
                        {cursoConMasContenido.title}
                        <br />
                        <span className="text-lg font-normal text-gray-500">
                            ({cursoConMasContenido.totalContenido} contenidos)
                        </span>
                    </span>
                }
                highlight
            />
        </div>
    )
}