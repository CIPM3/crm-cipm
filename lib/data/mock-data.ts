// === MOCK DATA FOR DEVELOPMENT ===
// This should be replaced with real API calls in production

// Students mock data
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

// Courses mock data
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

// Continue with other mock data...
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
  // ... more enrollments
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
  // ... more tasks
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
  // ... more customers
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
  // ... more deals
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