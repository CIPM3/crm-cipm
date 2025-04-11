// src/logic.ts
import { Student,Agendado } from "@/types/estadisticas-types"

/**
 * Convierte un Firestore Timestamp a un objeto Date
 */
export function convertirFecha(fecha: any): Date {
  if (fecha instanceof Date) return fecha
  if (fecha && typeof fecha.seconds === "number") {
    return new Date(fecha.seconds * 1000)
  }
  return new Date()
}

/**
 * Retorna el día de la semana en español (ejemplo: "lunes", "martes", etc.)
 */
export function getDayNameInSpanish(date: Date): string {
  return date.toLocaleDateString("es-ES", { weekday: "long" })
}

/**
 * Genera estadísticas globales (Status, Semana, Horario, Nivel, Tipo, Modalidad, Maestro)
 */
export function generarEstadisticasCierres(
  registros: Student[],
  usuariosMap: Record<string, string> = {}
) {
  const porStatus: Record<string, number> = {}
  const porSemana: Record<string, number> = {}
  const porHorario: Record<string, number> = {}
  const porNivel: Record<string, number> = {}
  const porTipo: Record<string, number> = {}
  const porModalidad: Record<string, number> = {}
  const porMaestro: Record<string, number> = {}

  const getClean = (val: any): string | null =>
    typeof val === "string" && val.trim() !== "" ? val.trim() : null

  registros.forEach((item) => {
    const status = getClean(item.status)
    const week = getClean(item.week)
    const horario = getClean(item.horario)
    const nivel = getClean(item.nivel)
    const tipo = getClean(item.tipo)
    const modalidad = getClean(item.modalidad)
    const maestroId = getClean(item.maestro)
    const maestroNombre = maestroId ? usuariosMap[maestroId] || maestroId : null

    if (status) porStatus[status] = (porStatus[status] || 0) + 1
    if (week) porSemana[week] = (porSemana[week] || 0) + 1
    if (horario) porHorario[horario] = (porHorario[horario] || 0) + 1
    if (nivel) porNivel[nivel] = (porNivel[nivel] || 0) + 1
    if (tipo) porTipo[tipo] = (porTipo[tipo] || 0) + 1
    if (modalidad) porModalidad[modalidad] = (porModalidad[modalidad] || 0) + 1
    if (maestroNombre) porMaestro[maestroNombre] = (porMaestro[maestroNombre] || 0) + 1
  })

  // Transforma en array
  const toArray = (obj: Record<string, number>, key: string) =>
    Object.entries(obj).map(([k, total]) => ({ [key]: k, total }))

  return {
    porStatus: toArray(porStatus, "status"),
    porSemana: toArray(porSemana, "week"),
    porHorario: toArray(porHorario, "horario"),
    porNivel: toArray(porNivel, "nivel"),
    porTipo: toArray(porTipo, "tipo"),
    porModalidad: toArray(porModalidad, "modalidad"),
    porMaestro: toArray(porMaestro, "maestro"),
  }
}

/**
 * Agrupa SOLO los estudiantes de la semana actual que tengan el mismo maestro + horario + week
 */
import { getYear, getWeek } from "date-fns"

export function agruparCoincidencias(estudiantes: Student[]): {
  maestro: string
  horario: string
  week: string
  estudiantes: Student[]
}[] {
  // Filtrar primero los de la semana actual
  const año = getYear(new Date()).toString().replace("20", "") // ej: "25"
  const sem = getWeek(new Date()) // num de semana, ej: 15
  const anoSemana = año + sem.toString() // ej: "2515"

  const actuales = estudiantes.filter((est) => est.week === anoSemana)

  const grupos: Record<string, Student[]> = {}

  actuales.forEach((est) => {
    const maestro = est.maestro || "Sin maestro"
    const horario = est.horario || "Sin horario"

    const clave = `${maestro}||${horario}||${anoSemana}`

    const fechaObj = convertirFecha(est.fecha)
    const dayName = getDayNameInSpanish(fechaObj)

    if (!grupos[clave]) {
      grupos[clave] = []
    }
    grupos[clave].push({
      ...est,
      fecha: fechaObj,
      dayName,
    })
  })

  // Retorna también grupos con 1 solo est? => > 0
  // O con 2+ est => > 1
  return Object.entries(grupos)
    .map(([clave, arr]) => {
      const [maestro, horario, week] = clave.split("||")
      return { maestro, horario, week, estudiantes: arr }
    })
    .filter((g) => g.estudiantes.length > 0)
}

/**
 * Genera estadísticas para la data de agendados/estudiantes
 */
export const generarEstadisticas = (
  agendados: any[],
  usuariosMap: Record<string, string>
) => {
  const porSemana: Record<string, number> = {}
  const porHorario: Record<string, number> = {}
  const porTipo: Record<string, number> = {}
  const porEdad: Record<string, number> = {}
  const porNivel: Record<string, number> = {}
  const porDia: Record<string, number> = {}
  const porMaestro: Record<string, number> = {}
  const porQuienAgendo: Record<string, number> = {}

  const getClean = (val: any) =>
    typeof val === "string" && val.trim() !== "" ? val.trim() : null

  agendados.forEach((item) => {
    const semana = getClean(item.anoSemana)
    const horario = getClean(item.horario || item.horaClasePrueba)
    const tipo = getClean(item.modalidad)
    const edad = getClean(item.mayorEdad)
    const nivel = getClean(item.nivel)
    const dia = getClean(item.dia || item.diaContacto)

    const maestro = getClean(usuariosMap[item.maestro])
    const quien = getClean(usuariosMap[item.quienAgendo])

    if (semana) porSemana[semana] = (porSemana[semana] || 0) + 1
    if (horario) porHorario[horario] = (porHorario[horario] || 0) + 1
    if (tipo) porTipo[tipo] = (porTipo[tipo] || 0) + 1
    if (edad) porEdad[edad] = (porEdad[edad] || 0) + 1
    if (nivel) porNivel[nivel] = (porNivel[nivel] || 0) + 1
    if (dia) porDia[dia] = (porDia[dia] || 0) + 1
    if (maestro) porMaestro[maestro] = (porMaestro[maestro] || 0) + 1
    if (quien) porQuienAgendo[quien] = (porQuienAgendo[quien] || 0) + 1
  })

  const toArray = (obj: Record<string, number>, key: string) =>
    Object.entries(obj).map(([k, total]) => ({ [key]: k, total }))

  return {
    porSemana: toArray(porSemana, "week"),
    porHorario: toArray(porHorario, "horario"),
    porTipo: toArray(porTipo, "tipo"),
    porEdad: toArray(porEdad, "tipo"),
    porNivel: toArray(porNivel, "nivel"),
    porDia: toArray(porDia, "dia"),
    porMaestro: toArray(porMaestro, "maestro"),
    porQuienAgendo: toArray(porQuienAgendo, "nombre"),
  }
}
