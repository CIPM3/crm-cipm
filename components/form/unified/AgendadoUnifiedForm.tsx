"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import BaseForm from "./BaseForm"
import { 
  InputField, 
  SelectField, 
  DateField, 
  CustomField 
} from "./FormField"
import { 
  useGetAgendadores 
} from "@/hooks/agendador/useGetAgendadores"
import { 
  useGetAgendados 
} from "@/hooks/agendador/useGetAgendados"
import { 
  useSchedule 
} from "@/hooks/schedule/useSchedule"
import { HORARIO_VALS } from "@/lib/constants"
import { agendadorSchema } from "@/lib/schemas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type AgendadoFormType = 'agendador' | 'formacion' | 'instructor'

interface AgendadoUnifiedFormProps {
  formType: AgendadoFormType
  initialValues: any
  onSubmit: (values: any) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

// Configuration for different form types
const FORM_CONFIGS = {
  agendador: {
    title: "Formulario de Agendador",
    submitText: "Crear Agendado",
    fields: ['nombreAlumno', 'diaClasePrueba', 'horaClasePrueba', 'maestro', 'anoSemana']
  },
  formacion: {
    title: "Formulario de Formación",
    submitText: "Agendar Formación", 
    fields: ['nombreAlumno', 'diaClasePrueba', 'horaClasePrueba', 'maestro', 'anoSemana', 'observaciones']
  },
  instructor: {
    title: "Formulario de Instructor",
    submitText: "Asignar Instructor",
    fields: ['nombreAlumno', 'numero', 'dia', 'horario', 'observaciones', 'maestro', 'anoSemana']
  }
}

export default function AgendadoUnifiedForm({
  formType,
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false
}: AgendadoUnifiedFormProps) {
  const [scheduleError, setScheduleError] = useState<string>("")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  
  const { Agendadores } = useGetAgendadores()
  const { Usuarios } = useGetAgendados()
  const { schedule } = useSchedule()
  
  const config = FORM_CONFIGS[formType]

  // Convert Firebase timestamp to Date
  const firebaseTimestampToDate = (timestamp: any): Date | undefined => {
    if (!timestamp) return undefined
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000)
    }
    return new Date(timestamp)
  }

  // Format hour display
  const convertHourFormat = (hour: string): string => {
    if (!hour) return ''
    
    if (hour.match(/am|pm/i)) {
      return hour.replace(/(\d+:\d+)\s?(am|pm)/i, (_, time, period) => 
        `${time} ${period.toUpperCase()}`)
    }
    
    const [hours, minutes] = hour.split(':')
    const hourNum = parseInt(hours, 10)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum % 12 || 12
    return `${displayHour}:${minutes} ${period}`
  }

  // Get time options based on form type
  const getTimeOptions = () => {
    if (formType === 'instructor') {
      return HORARIO_VALS.map(hour => ({
        value: hour,
        label: convertHourFormat(hour)
      }))
    }
    
    // For agendador and formacion
    return schedule?.horarios?.map((horario: any) => ({
      value: horario.hora,
      label: convertHourFormat(horario.hora)
    })) || []
  }

  // Get instructor/maestro options
  const getMaestroOptions = () => {
    if (formType === 'instructor') {
      return Agendadores?.map((agendador: any) => ({
        value: agendador.id,
        label: agendador.nombre
      })) || []
    }
    
    // For agendador and formacion
    return schedule?.grupos?.map((grupo: any) => ({
      value: grupo.id,
      label: `Grupo ${grupo.nombre} - ${grupo.horario}`
    })) || []
  }

  const handleFormSubmit = async (values: any) => {
    if (scheduleError) return
    
    try {
      const processedValues = {
        ...values,
        maestro: selectedGroupId || values.maestro
      }
      
      await onSubmit(processedValues)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={agendadorSchema}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitText={config.submitText}
    >
      {(formik: any) => (
        <div className="grid gap-4">
          {/* Common Fields */}
          <InputField
            name="nombreAlumno"
            label="Nombre del Alumno"
            formik={formik}
            required
            placeholder="Ingrese el nombre completo"
          />

          {/* Date Field - Different names for different forms */}
          <DateField
            name={formType === 'instructor' ? 'dia' : 'diaClasePrueba'}
            label="Fecha de la Clase"
            formik={formik}
            required
          />

          {/* Time Field */}
          <SelectField
            name={formType === 'instructor' ? 'horario' : 'horaClasePrueba'}
            label="Horario"
            formik={formik}
            options={getTimeOptions()}
            placeholder="Seleccionar horario"
            required
          />

          {/* Maestro/Instructor Selection */}
          <SelectField
            name="maestro"
            label={formType === 'instructor' ? 'Instructor' : 'Grupo/Maestro'}
            formik={formik}
            options={getMaestroOptions()}
            placeholder={`Seleccionar ${formType === 'instructor' ? 'instructor' : 'grupo'}`}
            required
          />

          {/* Year/Week field */}
          <InputField
            name="anoSemana"
            label="Año y Semana"
            formik={formik}
            placeholder="Ej: 2024-W12"
          />

          {/* Conditional Fields */}
          {(formType === 'formacion' || formType === 'instructor') && (
            <InputField
              name="observaciones"
              label="Observaciones"
              formik={formik}
              placeholder="Notas adicionales (opcional)"
            />
          )}

          {formType === 'instructor' && (
            <InputField
              name="numero"
              label="Número de Contacto"
              formik={formik}
              type="tel"
              placeholder="Número de teléfono"
            />
          )}

          {/* Schedule Error Display */}
          {scheduleError && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {scheduleError}
            </div>
          )}
        </div>
      )}
    </BaseForm>
  )
}