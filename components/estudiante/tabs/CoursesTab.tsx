import Link from "next/link"
import { useState } from "react"
import { BookOpen, Calendar, Clock, Award, Trash2, Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCourseById, courses } from "@/lib/utils"
import UnenrollDialog from "@/components/dialog/estudiante/UnenrollDialog"
import { useDeleteEnrollment } from "@/hooks/enrollments"
import { useGetCourseById } from "@/hooks/cursos"
import { useEnrollmentsStore } from "@/store/useEnrollmentStore"
import { useRouter } from "next/navigation"

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

  const setCanRefetch = useEnrollmentsStore((state) => state.setCanRefetch)
  const { remove, loading } = useDeleteEnrollment()

  const router = useRouter();


  const handleUnenroll = async () => {
    if (!selectedEnrollment) return
    await remove(selectedEnrollment.id)
    router.replace("/admin/estudiantes/")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Cursos Inscritos</h3>

      </div>

      <div className="grid gap-4">
        {enrollments.length > 0 ? (
          enrollments.map((e) => {
            const { course } = useGetCourseById(e.courseId)
            return (
              <Card key={e.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <CardTitle>{course?.title}</CardTitle>
                    <Badge className="text-center" variant={e.status === "Completado" ? "default" : "secondary"}>{e.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p className="text-sm text-muted-foreground">{course?.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <Item icon={<Calendar />} label="Inscripción" value={e.enrollmentDate} />
                    <Item icon={<Clock />} label="Último acceso" value={e.lastAccess} />
                    <Item icon={<Award />} label="Duración" value={course?.duration!!} />
                  </div>

                  <div className="flex-1 flex flex-col gap-2 lg:flex-row">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex justify-between mb-1">
                        <span>Progreso: {e.progress}%</span>

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

              <Button onClick={() => {
                setIsDialogOpen(true)
                router.push('/admin/cursos')
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Inscribir en un Curso
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <UnenrollDialog
        open={isUnenrollDialogOpen}
        onOpenChange={setIsUnenrollDialogOpen}
        courseTitle={getCourseById(selectedEnrollment?.courseId)?.title!!}
        onConfirm={handleUnenroll}
        loading={loading}
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
