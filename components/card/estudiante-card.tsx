import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, MoreHorizontal, Phone } from 'lucide-react'
import { format } from "date-fns"
import { useGetEnrollmentsByStudentId } from '@/hooks/enrollments'

interface Props {
    student: {
        id: string
        name: string
        email: string
        phone?: string
        status: string
        lastLogin: string
    }
    delay?: number
}

function capitalizeWords(str: string) {
    return str.replace(/\p{L}+/gu, (word) =>
        word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
    );
}

const EstudianteCard = ({ student, delay=0 }: Props) => {
    const {enrollments} = useGetEnrollmentsByStudentId(student.id)

    return (
        <Link href={`/admin/estudiantes/${student.id}`} key={student.id}>
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">{capitalizeWords(student.name)}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant={student.status === "Activo" ? "default" : "secondary"}>{student.status}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Más opciones</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.phone}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="text-sm">
                                <span className="font-medium">Usuario Creado:</span>{" "}
                                {student.lastLogin ? format(new Date(student.lastLogin), "dd/MM/yyyy") : "N/A"}
                            </div>
                            <div className="text-sm font-medium">{enrollments.length} cursos inscritos</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default EstudianteCard
