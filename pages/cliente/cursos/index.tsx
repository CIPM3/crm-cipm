import Link from "next/link"
import { courses } from "@/lib/utils"
import { BookOpen, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import HeaderCliente from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"
import CursoCard from "@/components/card/curso-card"
import FiltersSearch from "@/components/filters/filters-search"

export default function CoursesPage() {
  // Filtrar solo cursos activos para mostrar a los clientes
  const availableCourses = courses.filter((course) => course.status === "Activo")

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
          <FiltersSearch
            filters={[
              {
                name: "Todas las categorias",
                value: "all"
              },
              {
                name:'Avanzado',
                value:'advance'
              },
              {
                name:'Basico',
                value:'basic'
              },
              {
                name:'Principiante',
                value:'begginer'
              },
            ]}
            placeholder="Buscar cursos..."
          />

          {/* Lista de cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course, index) => (
              <Link href={`/cursos/${course.id}`} key={course.id} className="h-full">
                <CursoCard key={index} curso={course} type="cliente" />
              </Link>
            ))}
          </div>

          {/* Sección de información adicional */}
          <div className="mt-16 bg-muted/50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">¿Por qué elegir nuestros cursos?</h2>
              <p className="text-muted-foreground">Formación de calidad que marca la diferencia</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Contenido de Calidad</h3>
                <p className="text-muted-foreground">
                  Material didáctico actualizado y desarrollado por expertos en la materia.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instructores Certificados</h3>
                <p className="text-muted-foreground">
                  Aprende con profesionales en activo con amplia experiencia en el sector.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Badge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Certificaciones Reconocidas</h3>
                <p className="text-muted-foreground">
                  Obtén certificaciones con validez internacional que potenciarán tu currículum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

