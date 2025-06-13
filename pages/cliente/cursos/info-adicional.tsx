"use client";

import { Badge, BookOpen, Star } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { gsap } from "gsap";

const InfoAdicional = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const Ventajas = [
        {
            title: "Contenido de Calidad",
            description: "Material didáctico actualizado y desarrollado por expertos en la materia.",
            icon: <BookOpen className="h-6 w-6 text-primary" />
        },
        {
            title: "Instructores Certificados",
            description: "Aprende con profesionales en activo con amplia experiencia en el sector.",
            icon: <Star className="h-6 w-6 text-primary" />
        },
        {
            title: "Certificaciones Reconocidas",
            description: "Obtén certificaciones con validez internacional que potenciarán tu currículum.",
            icon: <Badge className="h-6 w-6 text-primary" />
        }
    ]

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    gsap.fromTo(
                        ".info-titulo",
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.8 }
                    );
                    gsap.fromTo(
                        ".info-subtitulo",
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
                    );
                    gsap.fromTo(
                        ".info-parrafo",
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.8, delay: 0.4 }
                    );
                    gsap.fromTo(
                        ".ventaja-animada",
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.6 }
                    );
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={sectionRef} className="rounded-lg p-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-5">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground info-titulo">
                    ¿Por qué elegirnos?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl info-subtitulo">
                    Formación de calidad que marca la diferencia
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed info-parrafo">
                    Nuestra plataforma ofrece ventajas únicas para tu desarrollo profesional
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {
                    Ventajas.map((ventaja, index) => (
                        <div key={index} className="flex flex-col items-center text-center ventaja-animada">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                {ventaja.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{ventaja.title}</h3>
                            <p className="text-muted-foreground">{ventaja.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default InfoAdicional