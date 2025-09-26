"use client"

import AgendadoUnifiedForm from "./unified/AgendadoUnifiedForm"
import { FormacionDataType } from "@/types"

interface FormacionFormProps {
  initialValues?: FormacionDataType
  onSubmit: (values: FormacionDataType) => Promise<void>
  onCancel: () => void
  IsLoading: boolean
}

export function FormacionForm({ initialValues, onSubmit, onCancel, IsLoading }: FormacionFormProps) {
  const defaultValues = initialValues || {
    status: "",
    week: "",
    nombre: "",
    telefono: "",
    modalidad: "",
    horario: "",
    observaciones: "",
    fecha: new Date(),
    maestro: "",
    nivel: "",
    tipo: ""
  }

  return (
    <AgendadoUnifiedForm
      formType="formacion"
      initialValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={IsLoading}
    />
  )
}