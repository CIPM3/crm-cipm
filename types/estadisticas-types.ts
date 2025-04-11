
/**
 * Representa el Timestamp de Firestore
 */
export type Timestamp = {
  seconds: number
  nanoseconds: number
}

/**
 * Representa a cada estudiante de FormacionData
 */
export type Student = {
  maestro: string
  horario: string
  fecha: Timestamp | Date
  week: string
  [key: string]: any
}

// Puedes ubicarlo en: src/app/instructorDashboardTypes.ts

/**
 * Representa cada registro "agendado" o "estudiante" en tu base
 */
export interface Agendado {
  maestro: string
  horario: string
  fecha: Timestamp | Date
  week: string
  telefono: string
  modalidad: string
  status: string
  nombre: string
  observaciones?: string
  id: string
  nivel: string
  tipo: string
  [key: string]: any
}

/**
 * Interfaz para las estadísticas generadas
 */
export interface Estadisticas {
  porSemana: { week: string; total: number }[]
  porHorario: { horario: string; total: number }[]
  porTipo: { tipo: string; total: number }[]
  porEdad: { tipo: string; total: number }[]
  porNivel: { nivel: string; total: number }[]
  porDia: { dia: string; total: number }[]
  porMaestro: { maestro: string; total: number }[]
  porQuienAgendo: { nombre: string; total: number }[]
}
