"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Search } from "lucide-react"
import { useFetchCourses } from "@/hooks/cursos"
import CursoCardSkeleton from "@/components/card/curso-skeleton-card"

// Import heavy components normally for now to fix the issue
import HeaderCliente from "@/components/header/header-cliente"
import Footer from "../main/footer"
import CursoCard from "@/components/card/curso-card"
import InfoAdicional from "./info-adicional"
import { motion } from "framer-motion"

export default function CoursesPage() {
  // Estados para filtros y búsqueda
  const [search, setSearch] = useState("")
  const [precio, setPrecio] = useState("all")
  const [semanas, setSemanas] = useState("all")

  const filtersPrecio = [
    { name: "Todos", value: "all" },
    { name: "menor a 500", value: "500" },
    { name: "menor a 1000", value: "1000" },
    { name: "menor a 1500", value: "1500" },
    { name: "menor a 2000", value: "2000" },
  ]

  const filtersSemanas = [
    { name: "Todos", value: "all" },
    { name: "menor a 2 semanas", value: "2" },
    { name: "menor a 4 semanas", value: "4" },
    { name: "menor a 6 semanas", value: "6" },
    { name: "menor a 8 semanas", value: "8" },
  ]

  // Filtrar solo cursos activos para mostrar a los clientes
  let { courses, error, loading } = useFetchCourses()
  let availableCourses = courses.filter((course) => course.status === "Activo")

  // Aplicar filtros
  availableCourses = availableCourses.filter((course) => {
    // Filtro por búsqueda de título
    if (search && !course.title.toLowerCase().includes(search.toLowerCase())) return false
    // Filtro por precio
    if (precio !== "all" && Number(course.price) >= Number(precio)) return false
    // Filtro por semanas (asumiendo que course.duration es tipo "4 semanas")
    if (semanas !== "all") {
      const numSemanas = parseInt(course.duration)
      if (isNaN(numSemanas) || numSemanas >= Number(semanas)) return false
    }
    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <HeaderCliente />

      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Nuestros Cursos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra selección de cursos especializados en gestión de proyectos y desarrollo profesional
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="relative mb-10 grid grid-cols-12 gap-3 flex-1">
            <div className="col-span-8">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="search"
                placeholder={"Buscar cursos..."}
                className="w-full rounded-md border border-input bg-background pl-10 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <select
              className="rounded-md border w-full border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring col-span-2"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
            >
              {filtersPrecio.map((filter, index) => (
                <option key={index} value={filter.value}>{filter.name}</option>
              ))}
            </select>

            <select
              className="rounded-md border w-full border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring col-span-2"
              value={semanas}
              onChange={e => setSemanas(e.target.value)}
            >
              {filtersSemanas.map((filter, index) => (
                <option key={index} value={filter.value}>{filter.name}</option>
              ))}
            </select>
          </div>

          {/* Lista de cursos */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <CursoCardSkeleton key={index} />
              ))}
            </div>
          )}

          {
            error && (
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
            )
          }

          {!loading && !error && availableCourses.length === 0 && (
            <p>No hay cursos disponibles.</p>
          )
          }

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
                className="h-full"
              >
                <Link href={`/cursos/${course.id}`} className="h-full">
                  <CursoCard curso={course} type="cliente" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Sección de información adicional */}
          <div className="bg-muted/50 py-12 md:py-24 mt-12">
            <InfoAdicional />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}