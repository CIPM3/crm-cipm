import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Una forma diferente
              de aprender ingles
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Aprende con los mejores profesionales del sector y obtén certificaciones reconocidas
              internacionalmente. Impulsa tu carrera con nuestros cursos especializados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#cursos">Ver Cursos</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/heros_img.svg?height=400&width=600"
              alt="Estudiantes aprendiendo"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain"
              width={600}
              height={400}
            />
            <div className="absolute inset-0 rounded-xl ring-inset ring-primary/10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
