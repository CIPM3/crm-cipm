import {
    Video,
    Clock,
    BookOpen,
    Layers,
    Star,
    BarChart3,
} from "lucide-react"
import { useFetchContents } from "@/hooks/contenidos"
import { useFetchModules } from "@/hooks/modulos"
import { useFetchCourses } from "@/hooks/cursos"
import React from "react"
import StatCard from "../StatCard"
import SkeletonCard from "../SkeletonCard"
// Utilidad para convertir duración "mm:ss" o "hh:mm:ss" a minutos
function durationToMinutes(duration: string) {
    const parts = duration.split(":").map(Number)
    if (parts.length === 3) {
        return parts[0] * 60 + parts[1] + parts[2] / 60
    }
    if (parts.length === 2) {
        return parts[0] + parts[1] / 60
    }
    return 0
}

export default function VideosDashboard() {
    const { content: contents, loading: loadingContents } = useFetchContents()
    const { modules, loading: loadingModules } = useFetchModules()
    const { courses, loading: loadingCourses } = useFetchCourses()

    const loading = loadingContents || loadingModules || loadingCourses

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    // Filtrar solo videos
    const videos = contents.filter((c) => c.type === "video")
    const totalVideos = videos.length

    // Duración total de videos (en minutos)
    const totalMinutes = videos.reduce(
        (acc, v) => acc + durationToMinutes(v.duration || "0:00"),
        0
    )
    const totalHours = (totalMinutes / 60).toFixed(2)

    // Video más largo
    const videoMasLargo =
        videos.length > 0
            ? videos.reduce((max, v) =>
                durationToMinutes(v.duration || "0:00") >
                    durationToMinutes(max.duration || "0:00")
                    ? v
                    : max,
                videos[0])
            : { title: "N/A", duration: "0:00" }

    // Curso con más videos
    const cursoConMasVideos =
        courses.length > 0
            ? courses
                .map((curso) => {
                    const modulosCurso = modules.filter((m) => m.courseId === curso.id)
                    const videosCurso = modulosCurso.reduce(
                        (acc, m) =>
                            acc +
                            contents.filter(
                                (c) => c.moduleId === m.id && c.type === "video"
                            ).length,
                        0
                    )
                    return { ...curso, videosCurso }
                })
                .reduce(
                    (max, curso) =>
                        curso.videosCurso > max.videosCurso ? curso : max,
                    { videosCurso: 0 }
                )
            : { title: "N/A", videosCurso: 0 }

    // Promedio de duración de videos
    const avgDuration =
        videos.length > 0 ? (totalMinutes / videos.length).toFixed(2) : "0"

    // Módulo con más videos
    const moduloConMasVideos =
        modules.length > 0
            ? modules
                .map((mod) => ({
                    ...mod,
                    videos: contents.filter(
                        (c) => c.moduleId === mod.id && c.type === "video"
                    ).length,
                }))
                .reduce(
                    (max, mod) => (mod.videos > max.videos ? mod : max),
                    { videos: 0 }
                )
            : { title: "N/A", videos: 0 }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard icon={<Video size={32} />} label="Total de Videos" value={totalVideos} />
            <StatCard icon={<Clock size={32} />} label="Duración total (horas)" value={totalHours} />
            <StatCard icon={<Star size={32} />} label="Promedio duración (min)" value={avgDuration} />
            <StatCard
                icon={<BarChart3 size={32} />}
                label="Video más largo"
                value={
                    <span>
                        {videoMasLargo.title}
                        <br />
                        <span className="text-lg font-normal text-gray-500">
                            ({videoMasLargo.duration})
                        </span>
                    </span>
                }
                highlight
            />
            <StatCard
                icon={<BookOpen size={32} />}
                label="Curso con más videos"
                value={
                    <span>
                        {cursoConMasVideos.title}
                        <br />
                        <span className="text-lg font-normal text-gray-500">
                            ({cursoConMasVideos.videosCurso} videos)
                        </span>
                    </span>
                }
                highlight
            />
            <StatCard
                icon={<Layers size={32} />}
                label="Módulo con más videos"
                value={
                    <span>
                        {moduloConMasVideos.title}
                        <br />
                        <span className="text-lg font-normal text-gray-500">
                            ({moduloConMasVideos.videos} videos)
                        </span>
                    </span>
                }
                highlight
            />
        </div>
    )
}