import React from 'react'

const ComentarioCard = () => {
    return (
        <div className="flex items-start gap-4 mb-6">
            <img
                src="/placeholder.svg?height=360&width=640&text=Video"
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">Juan Pérez</span>
                    <span className="text-xs text-muted-foreground">• hace 2 horas</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    ¡Excelente video! Me ayudó mucho a entender la gestión de proyectos. ¿Habrá más contenido sobre este tema?
                </p>
            </div>
        </div>
    )
}

export default ComentarioCard
