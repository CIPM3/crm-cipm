import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Edit, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CursoType } from '@/types'
import Link from 'next/link'
import { DeleteCursoDialog } from '../dialog/delete-curso-dialog'

interface Props {
  curso: CursoType,
  type?: 'cliente' | 'crm'
}

const CursoCard = ({ curso, type }: Props) => {

  const Thumbnail = curso?.thumbnail!! || "/placeholder.svg?height=200&width=400&text=Curso"

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={Thumbnail}
          alt={curso.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{curso.title}</CardTitle>
          <Badge className={`${curso.status === "Activo" ? "bg-blue-500" : "bg-yellow-500"}`}>{curso.status || "Online"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">{curso.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{curso.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{curso.rating}</span>
            <span className="text-sm text-muted-foreground">({curso.enrollments})</span>
          </div>
        </div>
      </CardContent>
      <div>

      </div>
      {
        type === "cliente"
          ? (
            <CardFooter className="flex justify-between">
              <div className="text-lg font-bold">${curso.price.toLocaleString()}</div>
              <Button>
                <Link
                  //href={`/cursos/${curso.id}`}
                  href={'/'}
                >
                  Ver Detalles
                </Link>
              </Button>
            </CardFooter>)
          : (
            <div className="flex justify-between gap-2 px-4 mb-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href={`/admin/cursos/${curso.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </Button>
              <DeleteCursoDialog
                cursoId={curso.id}
                cursoTitle={curso.title}
                variant="outline"
                size="sm"
                className="flex-1"
              />
            </div>)
      }
    </Card>
  )
}

export default CursoCard
