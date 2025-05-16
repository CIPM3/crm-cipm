import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const CursoCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen del curso */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <Skeleton className="h-[200px] w-[400px]" />
      </div>

      {/* Header */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" /> {/* Título */}
          <Skeleton className="h-6 w-16" /> {/* Badge */}
        </div>
      </CardHeader>

      {/* Contenido */}
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" /> {/* Descripción línea 1 */}
        <Skeleton className="h-4 w-5/6 mb-4" /> {/* Descripción línea 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" /> {/* Icono de duración */}
            <Skeleton className="h-4 w-20" /> {/* Duración */}
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" /> {/* Icono de rating */}
            <Skeleton className="h-4 w-8" /> {/* Rating */}
            <Skeleton className="h-4 w-12" /> {/* Enrollments */}
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-between">
        <Skeleton className="h-6 w-20" /> {/* Precio */}
        <Skeleton className="h-10 w-24" /> {/* Botón */}
      </CardFooter>

      {/* Opciones para CRM */}
      <div className="flex justify-between gap-2 px-4 mb-2">
        <Skeleton className="h-10 w-full" /> {/* Botón Editar */}
        <Skeleton className="h-10 w-full" /> {/* Botón Eliminar */}
      </div>
    </Card>
  )
}

export default CursoCardSkeleton