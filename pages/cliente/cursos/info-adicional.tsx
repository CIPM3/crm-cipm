import { Badge, BookOpen, Star } from 'lucide-react'
import React from 'react'

const InfoAdicional = () => {
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
    return (
        <div className="rounded-lg p-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-5">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    ¿Por qué elegirnos?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Formación de calidad que marca la diferencia
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Nuestra plataforma ofrece ventajas únicas para tu desarrollo profesional
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {
                    Ventajas.map((ventaja, index) => (
                        <div key={index} className="flex flex-col items-center text-center ">
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
