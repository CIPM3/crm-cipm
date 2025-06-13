"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { gsap } from "gsap";

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            ".texto-animado",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
          );
          gsap.fromTo(
            ".parrafo-animado",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.2 }
          );
          gsap.fromTo(
            ".botones-animados",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.4 }
          );
          gsap.fromTo(
            ".img-animada",
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1, delay: 0.6 }
          );
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background group"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4 transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-80">
            <h1 className="text-3xl texto-animado text-center md:text-start font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
              Una forma diferente
              de aprender ingles
            </h1>
            <p className="parrafo-animado text-muted-foreground text-center md:text-start md:text-xl">
              Aprende con los mejores profesionales del sector y obtén certificaciones reconocidas
              internacionalmente. Impulsa tu carrera con nuestros cursos especializados.
            </p>
            <div className="botones-animados flex flex-col justify-start sm:flex-row gap-4">
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
          <div className="relative transition-transform duration-500 ease-in-out group-hover:scale-105">
            <img
              src="/heros_img.svg?height=400&width=600"
              alt="Estudiantes aprendiendo"
              className="mx-auto img-animada aspect-video overflow-hidden rounded-xl object-contain"
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