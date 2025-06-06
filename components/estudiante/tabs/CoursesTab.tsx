import Link from "next/link"
import { useState } from "react"
import { BookOpen, Calendar, Clock, Award, Trash2, Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCourseById, courses } from "@/lib/utils"
import EnrollStudentDialog from "@/components/dialog/estudiante/EnrollStudentDialog"
import UnenrollDialog from "@/components/dialog/estudiante/UnenrollDialog"
import { useGetEnrollmentsByStudentId } from "@/hooks/enrollments"
import { useGetCourseById } from "@/hooks/cursos"

export default function CoursesTab({
  student,
  enrollments,
  setEnrollments,
}: {
  student: any
  enrollments: any[]
  setEnrollments: (enrollments: any[]) => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null)
  const [isUnenrollDialogOpen, setIsUnenrollDialogOpen] = useState(false)
  
  const enrolledCourseIds = enrollments.map((e) => e.courseId)
  const availableCourses = courses.filter((c) => !enrolledCourseIds.includes(c.id))

  const handleProgressChange = (id: string, diff: number) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              progress: Math.min(100, Math.max(0, e.progress + diff)),
              status: e.progress + diff >= 100 ? "Completado" : "En progreso",
              lastAccess: new Date().toISOString().split("T")[0],
            }
          : e
      )
    )
  }

  const handleUnenroll = () => {
    if (!selectedEnrollment) return
    setEnrollments((prev) => prev.filter((e) => e.id !== selectedEnrollment.id))
    setIsUnenrollDialogOpen(false)
    setSelectedEnrollment(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Cursos Inscritos</h3>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <BookOpen className="mr-2 h-4 w-4" />
          Inscribir en Curso
        </Button>
      </div>

      <div className="grid gap-4">
        {enrollments.length > 0 ? (
          enrollments.map((e) => {
            const {course} = useGetCourseById(e.courseId)
            return (
              <Card key={e.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{course?.title}</CardTitle>
                    <Badge variant={e.status === "Completado" ? "default" : "secondary"}>{e.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p className="text-sm text-muted-foreground">{course?.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <Item icon={<Calendar />} label="Inscripción" value={e.enrollmentDate} />
                    <Item icon={<Clock />} label="Último acceso" value={e.lastAccess} />
                    <Item icon={<Award />} label="Duración" value={course?.duration!!} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Progreso: {e.progress}%</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleProgressChange(e.id, -10)} disabled={e.progress <= 0}>
                          -10%
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleProgressChange(e.id, 10)} disabled={e.progress >= 100}>
                          +10%
                        </Button>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-200">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEnrollment(e)
                        setIsUnenrollDialogOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Dar de Baja
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/admin/cursos/${course?.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ver Curso
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="font-medium text-lg">No hay cursos inscritos</p>
              <p className="text-sm text-muted-foreground mb-4">
                Este estudiante no está inscrito en ningún curso.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Inscribir en un Curso
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EnrollStudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={student}
        availableCourses={availableCourses}
        setEnrollments={setEnrollments}
      />

      <UnenrollDialog
        open={isUnenrollDialogOpen}
        onOpenChange={setIsUnenrollDialogOpen}
        courseTitle={getCourseById(selectedEnrollment?.courseId)?.title!!}
        onConfirm={handleUnenroll}
      />
    </div>
  )
}

function Item({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  )
}
