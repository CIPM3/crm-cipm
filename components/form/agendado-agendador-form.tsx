"use client"

import AgendadoUnifiedForm from "./unified/AgendadoUnifiedForm"
import { AgendadorFormProps, AgendadorFormValues, ClasePrubeaType } from "@/types"
import { createInstructor } from "@/api/Estudiantes/Instructores/create"

export function AgendadoForm({ initialValues, onSubmit, onCancel, IsLoading }: AgendadorFormProps) {
  const handleSubmit = async (values: AgendadorFormValues) => {
    try {
      // Original agendador logic
      await onSubmit(values)

      // Create instructor entry as well
      const instructorData: ClasePrubeaType = {
        nombreAlumno: values.nombreAlumno,
        numero: "",
        dia: values.diaClasePrueba,
        horario: values.horaClasePrueba,
        observaciones: "",
        maestro: values.maestro,
        anoSemana: values.anoSemana
      }

      await createInstructor(instructorData)
    } catch (error) {
      console.error('Error in AgendadoForm:', error)
      throw error
    }
  }

  return (
    <AgendadoUnifiedForm
      formType="agendador"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={IsLoading}
    />
  )
}