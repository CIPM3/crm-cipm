import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface EnrollStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: { id: string; name: string }[]
  courseId: string
  onEnroll: (enrollment: {
    studentId: string
    courseId: string
    enrollmentDate: string
    status: "En progreso"
    progress: number
    lastAccess: string
  }) => void
}

export function EnrollStudentDialog({
  open,
  onOpenChange,
  students,
  courseId,
  onEnroll,
}: EnrollStudentDialogProps) {
  const [studentId, setStudentId] = useState("")

  const handleEnroll = () => {
    if (!studentId) return
    const now = new Date().toISOString()
    onEnroll({
      studentId,
      courseId,
      enrollmentDate: now,
      status: "En progreso",
      progress: 0,
      lastAccess: now,
    })
    setStudentId("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscribir Estudiante</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium">Selecciona un estudiante</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
          >
            <option value="">Selecciona...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleEnroll} disabled={!studentId}>
            Inscribir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}