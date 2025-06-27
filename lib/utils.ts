import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const NavClient = [
  {
    title: "Inicio",
    href: "/",
  },
  {
    title: "Cursos",
    href: "/cursos",
  },
  {
    title: "Videos",
    href: "/videos",
  },
  {
    title: "Testimonios",
    href: "/#testimonios",
  },
  {
    title: "Contacto",
    href: "/#contacto",
  },
]

// Mock data for the CRM
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

export const courses = [
  {
    id: "1",
    title: "Introducción a la Gestión de Proyectos",
    description: "Curso básico sobre los fundamentos de la gestión de proyectos",
    price: 2500,
    duration: "4 semanas",
    status: "Activo",
    enrollments: 45,
    rating: 4.7,
    modules: ["m1", "m2", "m3"],
  },
  {
    id: "2",
    title: "Certificación PMP - Preparación",
    description: "Curso intensivo para preparar el examen de certificación PMP",
    price: 5000,
    duration: "8 semanas",
    status: "Activo",
    enrollments: 32,
    rating: 4.9,
    modules: ["m4", "m5", "m6", "m7"],
  },
  {
    id: "3",
    title: "Gestión Ágil de Proyectos",
    description: "Metodologías ágiles para la gestión moderna de proyectos",
    price: 3500,
    duration: "6 semanas",
    status: "Activo",
    enrollments: 28,
    rating: 4.5,
    modules: ["m8", "m9", "m10"],
  },
  {
    id: "4",
    title: "Liderazgo en Gestión de Proyectos",
    description: "Habilidades de liderazgo para gestores de proyectos",
    price: 4000,
    duration: "5 semanas",
    status: "Inactivo",
    enrollments: 15,
    rating: 4.3,
    modules: ["m11", "m12"],
  },
]

export const modules = [
  {
    id: "m1",
    courseId: "1",
    title: "Fundamentos de Gestión de Proyectos",
    order: 1,
    status: "Activo",
    content: [
      {
        id: "c1",
        type: "video",
        title: "Introducción a la Gestión de Proyectos",
        duration: "15:30",
        url: "/videos/intro.mp4",
      },
      { id: "c2", type: "document", title: "Guía de Conceptos Básicos", url: "/docs/conceptos.pdf" },
      { id: "c3", type: "quiz", title: "Evaluación de Conceptos Básicos", questions: 10 },
    ],
  },
  {
    id: "m2",
    courseId: "1",
    title: "Planificación de Proyectos",
    order: 2,
    status: "Activo",
    content: [
      { id: "c4", type: "video", title: "Creación de un Plan de Proyecto", duration: "22:15", url: "/videos/plan.mp4" },
      { id: "c5", type: "document", title: "Plantillas de Planificación", url: "/docs/plantillas.pdf" },
      { id: "c6", type: "quiz", title: "Evaluación de Planificación", questions: 8 },
    ],
  },
  // {
  //   id: "m3",
  //   courseId: "1",
  //   title: "Ejecución y Control",
  //   order: 3,
  //   status: "Activo",
  //   content: [
  //     { id: "c7", type: "video", title: "Seguimiento de Proyectos", duration: "18:45", url: "/videos/seguimiento.mp4" },
  //     { id: "c8", type: "document", title: "Herramientas de Control", url: "/docs/herramientas.pdf" },
  //     { id: "c9", type: "quiz", title: "Evaluación Final", questions: 15 },
  //   ],
  // },
  // {
  //   id: "m4",
  //   courseId: "2",
  //   title: "Introducción a PMP",
  //   order: 1,
  //   status: "Activo",
  //   content: [
  //     { id: "c10", type: "video", title: "¿Qué es PMP?", duration: "12:30", url: "/videos/pmp-intro.mp4" },
  //     { id: "c11", type: "document", title: "Guía PMBOK - Resumen", url: "/docs/pmbok.pdf" },
  //   ],
  // },
  // {
  //   id: "m5",
  //   courseId: "2",
  //   title: "Áreas de Conocimiento",
  //   order: 2,
  //   status: "Activo",
  //   content: [
  //     { id: "c12", type: "video", title: "Las 10 Áreas de Conocimiento", duration: "45:20", url: "/videos/areas.mp4" },
  //     { id: "c13", type: "quiz", title: "Evaluación de Áreas", questions: 20 },
  //   ],
  // },
  // {
  //   id: "m6",
  //   courseId: "2",
  //   title: "Grupos de Procesos",
  //   order: 3,
  //   status: "Activo",
  //   content: [
  //     { id: "c14", type: "video", title: "Los 5 Grupos de Procesos", duration: "38:15", url: "/videos/procesos.mp4" },
  //     { id: "c15", type: "quiz", title: "Evaluación de Procesos", questions: 15 },
  //   ],
  // },
  // {
  //   id: "m7",
  //   courseId: "2",
  //   title: "Simulación de Examen",
  //   order: 4,
  //   status: "Activo",
  //   content: [
  //     { id: "c16", type: "document", title: "Guía de Estudio Final", url: "/docs/guia-final.pdf" },
  //     { id: "c17", type: "quiz", title: "Simulación Completa", questions: 180 },
  //   ],
  // },
  // {
  //   id: "m8",
  //   courseId: "3",
  //   title: "Introducción a Agile",
  //   order: 1,
  //   status: "Activo",
  //   content: [
  //     { id: "c18", type: "video", title: "Manifiesto Ágil", duration: "14:30", url: "/videos/agile-intro.mp4" },
  //     { id: "c19", type: "document", title: "Principios Ágiles", url: "/docs/principios.pdf" },
  //   ],
  // },
  // {
  //   id: "m9",
  //   courseId: "3",
  //   title: "Scrum Framework",
  //   order: 2,
  //   status: "Activo",
  //   content: [
  //     { id: "c20", type: "video", title: "Introducción a Scrum", duration: "25:45", url: "/videos/scrum.mp4" },
  //     { id: "c21", type: "quiz", title: "Evaluación Scrum", questions: 12 },
  //   ],
  // },
  // {
  //   id: "m10",
  //   courseId: "3",
  //   title: "Kanban y otros métodos",
  //   order: 3,
  //   status: "Activo",
  //   content: [
  //     { id: "c22", type: "video", title: "Kanban en la práctica", duration: "20:15", url: "/videos/kanban.mp4" },
  //     { id: "c23", type: "quiz", title: "Evaluación Final Agile", questions: 15 },
  //   ],
  // },
  // {
  //   id: "m11",
  //   courseId: "4",
  //   title: "Habilidades de Liderazgo",
  //   order: 1,
  //   status: "Activo",
  //   content: [
  //     { id: "c24", type: "video", title: "Liderazgo Efectivo", duration: "28:30", url: "/videos/liderazgo.mp4" },
  //     { id: "c25", type: "document", title: "Estilos de Liderazgo", url: "/docs/estilos.pdf" },
  //   ],
  // },
  // {
  //   id: "m12",
  //   courseId: "4",
  //   title: "Gestión de Equipos",
  //   order: 2,
  //   status: "Activo",
  //   content: [
  //     {
  //       id: "c26",
  //       type: "video",
  //       title: "Formación de Equipos Efectivos",
  //       duration: "32:15",
  //       url: "/videos/equipos.mp4",
  //     },
  //     { id: "c27", type: "quiz", title: "Evaluación de Liderazgo", questions: 10 },
  //   ],
  // },
]

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

export const tasks = [
  {
    id: "1",
    title: "Actualizar contenido del módulo de Scrum",
    description: "Revisar y actualizar los videos y documentos del módulo de Scrum",
    dueDate: "2023-10-20",
    assignedTo: "user1",
    status: "Pendiente",
    priority: "Alta",
    relatedTo: { type: "module", id: "m9" },
  },
  {
    id: "2",
    title: "Crear nuevo quiz para certificación PMP",
    description: "Desarrollar preguntas adicionales para el simulador de examen",
    dueDate: "2023-10-18",
    assignedTo: "user1",
    status: "En Progreso",
    priority: "Media",
    relatedTo: { type: "module", id: "m7" },
  },
  {
    id: "3",
    title: "Contactar a estudiantes inactivos",
    description: "Enviar correo a estudiantes que no han accedido en el último mes",
    dueDate: "2023-10-17",
    assignedTo: "user2",
    status: "Pendiente",
    priority: "Alta",
    relatedTo: { type: "student", id: "3" },
  },
  {
    id: "4",
    title: "Revisar calificaciones del curso de Liderazgo",
    description: "Verificar y ajustar las calificaciones de los estudiantes",
    dueDate: "2023-10-16",
    assignedTo: "user1",
    status: "Completado",
    priority: "Media",
    relatedTo: { type: "course", id: "4" },
  },
  {
    id: "5",
    title: "Preparar nuevo curso de Gestión de Riesgos",
    description: "Desarrollar el esquema y contenido inicial del nuevo curso",
    dueDate: "2023-10-25",
    assignedTo: "user2",
    status: "Pendiente",
    priority: "Baja",
    relatedTo: { type: "course", id: "new" },
  },
]

export const customers = [
  {
    id: "1",
    name: "Acme Corp",
    contact: "John Doe",
    email: "john.doe@acmecorp.com",
    phone: "+1 555 123 4567",
    status: "Active",
    value: 100000,
    lastContact: "2023-10-26",
  },
  {
    id: "2",
    name: "Beta Solutions",
    contact: "Jane Smith",
    email: "jane.smith@betasolutions.com",
    phone: "+1 555 987 6543",
    status: "Inactive",
    value: 50000,
    lastContact: "2023-10-18",
  },
  {
    id: "3",
    name: "Gamma Industries",
    contact: "Peter Jones",
    email: "peter.jones@gammaindustries.com",
    phone: "+1 555 234 5678",
    status: "Active",
    value: 75000,
    lastContact: "2023-10-22",
  },
]

export const deals = [
  {
    id: "1",
    title: "Acme Corp - Project Alpha",
    customerId: "1",
    value: 50000,
    stage: "Closed Won",
    probability: 95,
    expectedCloseDate: "2023-10-31",
  },
  {
    id: "2",
    title: "Beta Solutions - Project Beta",
    customerId: "2",
    value: 25000,
    stage: "Closed Lost",
    probability: 40,
    expectedCloseDate: "2023-11-15",
  },
  {
    id: "3",
    title: "Gamma Industries - Project Gamma",
    customerId: "3",
    value: 30000,
    stage: "Negotiation",
    probability: 70,
    expectedCloseDate: "2023-11-30",
  },
]

export const users = [
  {
    id: "user1",
    name: "Alex Morgan",
    email: "alex@cipm.com",
    role: "Administrador",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user2",
    name: "Sam Taylor",
    email: "sam@cipm.com",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function getStudentById(id: string) {
  return students.find((student) => student.id === id)
}

export function getCourseById(id: string) {
  return courses.find((course) => course.id === id)
}

export function getModuleById(id: string) {
  return modules.find((module) => module.id === id)
}

export function getModulesByCourseId(courseId: string) {
  return modules.filter((module) => module.courseId === courseId).sort((a, b) => a.order - b.order)
}

export function getEnrollmentById(id: string) {
  return enrollments.find((enrollment) => enrollment.id === id)
}

export function getEnrollmentsByStudentId(studentId: string) {
  return enrollments.filter((enrollment) => enrollment.studentId === studentId)
}

export function getEnrollmentsByCourseId(courseId: string) {
  return enrollments.filter((enrollment) => enrollment.courseId === courseId)
}

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id)
}

export function getUserById(id: string) {
  return users.find((user) => user.id === id)
}

export function getTasksByRelatedId(type: string, id: string) {
  return tasks.filter((task) => task.relatedTo.type === type && task.relatedTo.id === id)
}

export function getCustomerById(id: string) {
  return customers.find((customer) => customer.id === id)
}

export function getDealsByCustomerId(customerId: string) {
  return deals.filter((deal) => deal.customerId === customerId)
}

export function getDealById(id: string) {
  return deals.find((deal) => deal.id === id)
}

// Añadir esta función para obtener todos los cursos
export function getCourses() {
  return courses
}

