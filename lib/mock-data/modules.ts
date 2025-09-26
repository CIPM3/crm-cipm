// Mock data for course modules
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

// Helper functions
export function getModuleById(id: string) {
  return modules.find(module => module.id === id)
}

export function getModulesByCourseId(courseId: string) {
  return modules.filter(module => module.courseId === courseId).sort((a, b) => a.order - b.order)
}