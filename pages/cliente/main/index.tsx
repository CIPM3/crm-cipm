import HeaderCliente from "@/components/header/header-cliente"
import Hero from "@/pages/cliente/main/hero"
import Caracteristicas from "@/pages/cliente/main/caracterisitcas"
import CursosDestacados from "@/pages/cliente/main/cursos-destacados"
import VideosDestacados from "@/pages/cliente/main/videos-destacados"
import Testimonios from "@/pages/cliente/main/testimonios"
import CTA from "@/pages/cliente/main/cta"
import Footer from "@/pages/cliente/main/footer"

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegación */}
      <HeaderCliente/>

      <main className="flex-1">
        {/* Hero Section */}
        <Hero/>

        {/* Características */}
        <Caracteristicas/>

        {/* Cursos Destacados */}
        <CursosDestacados/>

        {/* Videos Destacados */}
        <VideosDestacados/>

        {/* Testimonios */}
        <Testimonios/>

        {/* CTA */}
        <CTA/>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

