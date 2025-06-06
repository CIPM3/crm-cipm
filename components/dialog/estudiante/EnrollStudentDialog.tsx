import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useParams } from "next/navigation"
import { useGetCourseById } from "@/hooks/cursos"
import { useGetUsuarios } from "@/hooks/usuarios/useGetUsuarios"
import { format } from "date-fns";
import { useCreateEnrollment, useGetEnrollmentsByCourseId } from "@/hooks/enrollments"
import { useEnrollmentsStore } from "@/store/useEnrollmentStore"

interface EnrollStudentDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function EnrollStudentDialog({
  open,
  onOpenChange,
}: EnrollStudentDialogProps) {
  const [search, setSearch] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const { setCanRefetch } = useEnrollmentsStore()
  const [showOptions, setShowOptions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const params = useParams()
  const courseId = params?.id as string
  const { course } = useGetCourseById(courseId)
  const { Usuarios: students = [] } = useGetUsuarios()
  const { create, loading } = useCreateEnrollment()
  const { enrollments } = useGetEnrollmentsByCourseId(courseId)
  const enrolledIds = enrollments?.map((e: any) => e.studentId) ?? []

  const filteredStudents = students.filter(
    (student: any) =>
      !enrolledIds.includes(student.id) &&
      (
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      )
  )

  useEffect(() => {
    if (open) {
      setSearch("")
      setSelectedStudentId("")
      setShowOptions(false)
    }
  }, [open])

  const handleSelect = (studentId: string, studentName: string) => {
    setSelectedStudentId(studentId)
    setSearch(studentName)
    setShowOptions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí va la lógica de inscripción
    if (selectedStudentId) {
      // Simular inscripción exitosa
      const fecha = format(new Date(), "dd/MM/yyyy")
      let enrollment = {
        studentId: selectedStudentId,
        courseId: courseId,
        enrollmentDate: fecha,
        status: "En progreso",
        progress: 0,
        lastAccess: fecha,
      }
      // alert(JSON.stringify(enrollment, null, 2))
      await create(enrollment)
      setCanRefetch(true)
      onOpenChange(false)
    } else {
      alert("Por favor, selecciona un estudiante.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscribir Estudiante a {course?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2 relative">
            <label htmlFor="studentSearch" className="text-sm font-medium">
              Buscar y seleccionar estudiante
            </label>
            <input
              id="studentSearch"
              type="text"
              placeholder="Buscar por nombre o email..."
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={search}
              ref={inputRef}
              autoComplete="off"
              onFocus={() => setShowOptions(true)}
              onChange={e => {
                setSearch(e.target.value)
                setShowOptions(true)
                setSelectedStudentId("")
              }}
            />
            {showOptions && filteredStudents.length > 0 && (
              <ul className="absolute z-10 mt-[8.5dvh] max-h-40 w-full overflow-auto rounded-md border bg-background shadow-lg">
                {filteredStudents.map((student: any) => (
                  <li
                    key={student.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary/10 ${selectedStudentId === student.id ? "bg-primary/20" : ""
                      }`}
                    onClick={() => handleSelect(student.id, `${student.name} - ${student.email}`)}
                  >
                    {student.name.toLocaleLowerCase()} - {student.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input type="hidden" name="studentId" value={selectedStudentId} />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedStudentId && loading}>
              {
                loading
                  ? (
                    <>
                      <Loader2 className="animate-spin size-5 mr-2" />
                      Inscribiendo...
                    </>
                  )
                  : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Inscribir
                    </>)
              }

            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}