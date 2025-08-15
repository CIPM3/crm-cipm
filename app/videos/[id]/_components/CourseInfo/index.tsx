import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules } from "@/lib/utils"
import { CourseInfoProps } from "@/types"

export default function CourseInfo({ courseData }: CourseInfoProps) {
  if (!courseData) return null

  const courseModules = modules.filter((m) => m.courseId === courseData.id)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sobre este curso</CardTitle>
      </CardHeader>
      
      <CardContent>
        <h3 className="font-bold mb-2">{courseData.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {courseData.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <CourseInfoItem 
            label="Duración" 
            value={courseData.duration} 
          />
          <CourseInfoItem 
            label="Módulos" 
            value={courseModules.length.toString()} 
          />
          <CourseInfoItem 
            label="Precio" 
            value={courseData.price ? `$${courseData.price.toLocaleString()}` : "N/A"} 
          />
        </div>
        
        <Button className="w-full" asChild>
          <Link href={`/cursos/${courseData.id}`}>
            Ver Curso Completo
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

interface CourseInfoItemProps {
  label: string
  value: string
}

function CourseInfoItem({ label, value }: CourseInfoItemProps) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}