// Mock data for students
export const students = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+52 555 123 4567",
    status: "Activo",
    lastLogin: "2023-10-15",
    enrolledCourses: ["1", "3"],
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+52 555 987 6543",
    status: "Activo",
    lastLogin: "2023-10-10",
    enrolledCourses: ["1", "2"],
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "+52 555 234 5678",
    status: "Inactivo",
    lastLogin: "2023-09-28",
    enrolledCourses: ["2"],
  },
  {
    id: "4",
    name: "Ana López",
    email: "ana@example.com",
    phone: "+52 555 876 5432",
    status: "Activo",
    lastLogin: "2023-10-05",
    enrolledCourses: ["1", "3", "4"],
  },
  {
    id: "5",
    name: "Roberto Martínez",
    email: "roberto@example.com",
    phone: "+52 555 432 1098",
    status: "Activo",
    lastLogin: "2023-10-12",
    enrolledCourses: ["4"],
  },
]

// Helper functions
export function getStudentById(id: string) {
  return students.find(student => student.id === id)
}