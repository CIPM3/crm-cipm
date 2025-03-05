import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import React from 'react'

const Testimonios = () => {
    return (
        <section id="testimonios" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Lo que dicen nuestros alumnos</h2>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Experiencias reales de profesionales que han confiado en nosotros
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`/placeholder.svg?height=50&width=50&text=U${i}`}
                                        alt={`Usuario ${i}`}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <CardTitle className="text-base">Usuario Ejemplo {i}</CardTitle>
                                        <CardDescription>Profesional en Gestión de Proyectos</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground">
                                    "Los cursos de CIPM Educación han sido fundamentales para mi desarrollo profesional. El contenido
                                    es de alta calidad y los profesores son verdaderos expertos en la materia."
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonios
