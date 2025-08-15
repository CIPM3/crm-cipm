import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Course } from "@/types"
import { useState } from "react"
import CourseBuyDialog from "../CourseBuyDialog"

interface CourseSidebarProps {
  course: Course
  thumbnail: string
  isBuyed: boolean
  onShowPlayer: () => void
}

const COURSE_BENEFITS = [
  "Certificado de finalización",
  "Acceso a todos los materiales",
  "Soporte de instructores",
  "Actualizaciones gratuitas"
] as const

export default function CourseSidebar({
  course,
  thumbnail,
  isBuyed,
  onShowPlayer
}: CourseSidebarProps) {

  const [BuyDialogOpen, setBuyDialogOpen] = useState(false)

  return (
    <div>
      <Card className="overflow-hidden shadow-lg">
        {/* Imagen del curso */}
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
        
        <CardContent className="p-6">
          {/* Precio */}
          <div className="text-3xl font-bold mb-6">
            ${course.price.toLocaleString()}
          </div>
          
          {/* Botón de acción */}
          {isBuyed ? (
            <Button className="w-full mb-4" onClick={onShowPlayer}>
              Ver Curso
            </Button>
          ) : (
            <CourseBuyDialog courseName={course.title}/>
          )}
          
          {/* Texto de acceso */}
          <p className="text-sm text-muted-foreground text-center mb-4">
            Acceso completo de por vida
          </p>
          
          {/* Lista de beneficios */}
          <div className="space-y-2">
            {COURSE_BENEFITS.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}