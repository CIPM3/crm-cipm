"use client"

import {
    Users,
    UserCheck,
    UserPlus,
    BookOpen,
    BarChart3,
    Star,
} from "lucide-react"
import { useFetchEnrollments } from "@/hooks/enrollments"
import { useFetchCourses } from "@/hooks/cursos"
import { useFetchClientes } from "@/hooks/estudiantes/clientes"
import StatCard from "../StatCard"
import SkeletonCard from "../SkeletonCard"


export default function EstudiantesDashboard() {
    const { enrollments, loading: loadingEnroll } = useFetchEnrollments()
    const { courses, loading: loadingCourses } = useFetchCourses()
    const { clientes: students, loading: loadingStudents } = useFetchClientes()

    const Loading = loadingCourses || loadingEnroll || loadingStudents;

    if (Loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    // Total de estudiantes
    const totalEstudiantes = students.filter(student => student.role === 'cliente').length

    // Estudiantes activos (con al menos una inscripción)
    const estudiantesActivos = students.filter(student =>
        enrollments.some(e => e.studentId === student.id) && student.role === 'cliente'
    ).length

    // Estudiantes nuevos (últimos 30 días, suponiendo campo createdAt)
    const now = new Date()
    const estudiantesNuevos = students.filter(student => {
        if (!student.createdAt) return false
        const created = new Date(student.createdAt)
        const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 30
    }).length

    // Promedio de cursos por estudiante
    const cursosPorEstudiante =
        totalEstudiantes > 0
            ? (enrollments.length / totalEstudiantes).toFixed(2)
            : "0"

    // Estudiante con más cursos inscritos
    const estudianteMasInscrito =
        students.length > 0
            ? students
                .map(student => {
                    const inscripciones = enrollments.filter(
                        e => e.studentId === student.id
                    ).length
                    return { ...student, inscripciones }
                })
                .reduce(
                    (max, student) =>
                        student.inscripciones > max.inscripciones ? student : max,
                    { inscripciones: 0 }
                )
            : { name: "N/A", inscripciones: 0 }

    // Curso más popular entre estudiantes (más inscripciones)
    const cursoMasPopular =
        courses.length > 0
            ? courses
                .map(curso => ({
                    ...curso,
                    inscripciones: enrollments.filter(e => e.courseId === curso.id)
                        .length,
                }))
                .reduce(
                    (max, curso) =>
                        curso.inscripciones > max.inscripciones ? curso : max,
                    { inscripciones: 0 }
                )
            : { title: "N/A", inscripciones: 0 }

    // Promedio de progreso general
    const avgProgress =
        enrollments.length > 0
            ? (
                enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
                enrollments.length
            ).toFixed(2)
            : "0"

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard icon={<Users size={32} />} label="Total de estudiantes" value={totalEstudiantes} />
            <StatCard icon={<UserCheck size={32} />} label="Estudiantes activos" value={estudiantesActivos} />
            <StatCard icon={<UserPlus size={32} />} label="Estudiantes nuevos (30 días)" value={estudiantesNuevos} />
            <StatCard icon={<BookOpen size={32} />} label="Promedio cursos/estudiante" value={cursosPorEstudiante} />
            <StatCard
                icon={<BarChart3 size={32} />}
                label="Estudiante con más cursos"
                value={
                    <span>
                        {estudianteMasInscrito.name}
                        <br />
                        <span className="text-lg font-normal text-gray-500">
                            ({estudianteMasInscrito.inscripciones} cursos)
                        </span>
                    </span>
                }
                highlight
            />
            <StatCard
                icon={<Star size={32} />}
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
                icon={<BarChart3 size={32} />}
                label="Progreso promedio"
                value={`${avgProgress}%`}
            />
        </div>
    )
}