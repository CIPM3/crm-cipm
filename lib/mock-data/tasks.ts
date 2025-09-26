// Mock data for tasks
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

// Helper functions
export function getTaskById(id: string) {
  return tasks.find(task => task.id === id)
}

export function getTasksByRelatedId(type: string, id: string) {
  return tasks.filter(task => task.relatedTo.type === type && task.relatedTo.id === id)
}