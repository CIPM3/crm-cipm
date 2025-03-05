import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CursoType } from '@/types'

interface Props {
  curso: CursoType
}

const CursoCard = ({curso}:Props) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(curso.title)}`}
          alt={curso.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{curso.title}</CardTitle>
          <Badge>{curso.type || "Online"}</Badge>
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
      <CardFooter className="flex justify-between">
        <div className="text-lg font-bold">${curso.price.toLocaleString()}</div>
        <Button>Ver Detalles</Button>
      </CardFooter>
    </Card>
  )
}

export default CursoCard
