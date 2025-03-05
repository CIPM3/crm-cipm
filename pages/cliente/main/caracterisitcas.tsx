import { CheckCircle, Play, Users } from 'lucide-react'
import React from 'react'

const Caracteristicas = () => {
    return (
        <section className="w-full py-12 md:py-24 bg-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
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
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
                    <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <CheckCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Certificaciones Oficiales</h3>
                        <p className="text-center text-muted-foreground">
                            Obtén certificaciones reconocidas internacionalmente que potenciarán tu currículum.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Profesores Expertos</h3>
                        <p className="text-center text-muted-foreground">
                            Aprende con profesionales en activo con amplia experiencia en el sector.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Play className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Contenido Actualizado</h3>
                        <p className="text-center text-muted-foreground">
                            Accede a material didáctico constantemente actualizado con las últimas tendencias.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Caracteristicas
