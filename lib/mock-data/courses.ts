// Mock data for courses
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

// Helper functions
export function getCourseById(id: string) {
  return courses.find(course => course.id === id)
}

export function getCourses() {
  return courses
}