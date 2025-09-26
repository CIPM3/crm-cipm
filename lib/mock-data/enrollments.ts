// Mock data for course enrollments
export const enrollments = [
  {
    id: "1",
    studentId: "1",
    courseId: "1",
    enrollmentDate: "2023-09-01",
    status: "En progreso",
    progress: 65,
    lastAccess: "2023-10-14",
  },
  {
    id: "2",
    studentId: "1",
    courseId: "3",
    enrollmentDate: "2023-08-15",
    status: "En progreso",
    progress: 40,
    lastAccess: "2023-10-10",
  },
  {
    id: "3",
    studentId: "2",
    courseId: "1",
    enrollmentDate: "2023-09-05",
    status: "En progreso",
    progress: 75,
    lastAccess: "2023-10-12",
  },
  {
    id: "4",
    studentId: "2",
    courseId: "2",
    enrollmentDate: "2023-07-20",
    status: "Completado",
    progress: 100,
    lastAccess: "2023-09-30",
  },
  {
    id: "5",
    studentId: "3",
    courseId: "2",
    enrollmentDate: "2023-08-10",
    status: "En progreso",
    progress: 50,
    lastAccess: "2023-09-25",
  },
  {
    id: "6",
    studentId: "4",
    courseId: "1",
    enrollmentDate: "2023-09-15",
    status: "En progreso",
    progress: 30,
    lastAccess: "2023-10-13",
  },
  {
    id: "7",
    studentId: "4",
    courseId: "3",
    enrollmentDate: "2023-08-01",
    status: "Completado",
    progress: 100,
    lastAccess: "2023-09-20",
  },
  {
    id: "8",
    studentId: "4",
    courseId: "4",
    enrollmentDate: "2023-10-01",
    status: "En progreso",
    progress: 15,
    lastAccess: "2023-10-10",
  },
  {
    id: "9",
    studentId: "5",
    courseId: "4",
    enrollmentDate: "2023-09-10",
    status: "En progreso",
    progress: 60,
    lastAccess: "2023-10-11",
  },
]

// Helper functions
export function getEnrollmentById(id: string) {
  return enrollments.find(enrollment => enrollment.id === id)
}

export function getEnrollmentsByStudentId(studentId: string) {
  return enrollments.filter(enrollment => enrollment.studentId === studentId)
}

export function getEnrollmentsByCourseId(courseId: string) {
  return enrollments.filter(enrollment => enrollment.courseId === courseId)
}