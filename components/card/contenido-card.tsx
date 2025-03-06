import { ContenidoType } from '@/types'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CheckCircle, Edit, FileText, MoreHorizontal, Trash2, Video } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { getCourseById } from '@/lib/utils'

interface Props {
    contenido: ContenidoType,
    openEditDialog: () => void;
    openDeleteDialog: () => void;
    toggleContentStatus: () => void;
}

const ContenidoCard = ({contenido,openEditDialog,openDeleteDialog,toggleContentStatus}:Props) => {

    const CursoData = getCourseById(contenido.courseId)

    return (
        <Card key={contenido.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    {contenido.type === "video" && (
                        <div className="rounded-full bg-red-100 p-2">
                            <Video className="h-4 w-4 text-red-600" />
                        </div>
                    )}
                    {contenido.type === "document" && (
                        <div className="rounded-full bg-blue-100 p-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                    )}
                    {contenido.type === "quiz" && (
                        <div className="rounded-full bg-green-100 p-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                    )}
                    <CardTitle className="text-lg font-medium">{contenido.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={contenido.status === "Activo" ? "default" : "secondary"}>{contenido.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openEditDialog}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openDeleteDialog}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hidden">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Más opciones</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <div className="text-sm">
                        <span className="font-medium">Curso:</span> {CursoData?.title}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Módulo:</span> {contenido.moduleTitle}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm">
                            <span className="font-medium">Tipo:</span> <span className="capitalize">{contenido.type}</span>
                            {contenido.type === "video" && contenido.duration && (
                                <span className="ml-2 text-muted-foreground">({contenido.duration})</span>
                            )}
                            {contenido.type === "quiz" && contenido.questions && (
                                <span className="ml-2 text-muted-foreground">({contenido.questions} preguntas)</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Estado:</span>
                            <Switch
                                size="sm"
                                checked={contenido.status === "Activo"}
                                onCheckedChange={toggleContentStatus}
                            />
                        </div>
                    </div>
                    {contenido.url && (
                        <div className="text-sm mt-2">
                            <span className="font-medium">URL:</span>{" "}
                            <a
                                href={contenido.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {contenido.url.length > 40 ? contenido.url.substring(0, 40) + "..." : contenido.url}
                            </a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ContenidoCard
