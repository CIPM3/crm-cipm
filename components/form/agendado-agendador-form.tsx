"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { AgendadorFormProps, AgendadorFormValues, ClasePrubeaType } from "@/types";
import { agendadorSchema } from "@/lib/schemas";
import { CalendarIcon, Loader2 } from "lucide-react";
import { getYear, getWeek, format } from "date-fns";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAgendadores } from "@/hooks/agendador/useGetAgendadores";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HORARIO_VALS } from "@/lib/constants";
import { useSchedule } from "@/hooks/schedule/useSchedule";
import { useGetAgendados } from "@/hooks/agendador/useGetAgendados";
import { useEffect, useState } from "react";
import { createInstructor } from "@/api/Estudiantes/Instructores/create";

const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface GroupAvailability {
  id: string;
  availableSlots: number;
  usageCount: number;
}

export function AgendadoForm({ initialValues, onSubmit, onCancel, IsLoading }: AgendadorFormProps) {
  const [scheduleError, setScheduleError] = useState<string>("");
  const [availableGroups, setAvailableGroups] = useState<GroupAvailability[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupUsage, setGroupUsage] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('groupUsage');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Función para convertir timestamp de Firebase a Date
  const firebaseTimestampToDate = (timestamp: { seconds: number, nanoseconds: number } | null | undefined): Date | undefined => {
    if (!timestamp) return undefined;
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  // Función para formatear la fecha
  const formatFirebaseDate = (timestamp: { seconds: number, nanoseconds: number } | null | undefined): string => {
    if (!timestamp) return 'Seleccionar fecha';
    const date = firebaseTimestampToDate(timestamp);
    return date ? format(date, 'd / MMMM') : 'Fecha inválida';
  };

  // Función para normalizar el formato de hora
  const convertHourFormat = (hour: string): string => {
    if (!hour) return '';
    
    if (hour.match(/am|pm/i)) {
      return hour.replace(/(\d+:\d+)\s?(am|pm)/i, (_, time, period) => 
        `${time} ${period.toUpperCase()}`);
    }
    
    const [hours, minutes] = hour.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const { Agendadores } = useGetAgendadores();
  const { Usuarios } = useGetAgendados();
  const { schedule } = useSchedule();

  const handleSubmit = async (values: AgendadorFormValues) => {
    if (scheduleError) return;
    if (!selectedGroupId) {
      setScheduleError("Debe seleccionar un horario válido");
      return;
    }

    try {
      let AgendadoData:AgendadorFormValues = {
        ...values,
        maestro:selectedGroupId
      }
      await onSubmit(AgendadoData)

      let InstructorData : ClasePrubeaType = {
        nombreAlumno:values.nombreAlumno,
        numero: "",
        dia: values.diaClasePrueba,
        horario:values.horaClasePrueba,
        observaciones: "",
        maestro:selectedGroupId,
        anoSemana: values.anoSemana
      }

      await createInstructor(InstructorData)
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const formik = useFormik<AgendadorFormValues>({
    initialValues: initialValues || {
      nombreAlumno: "",
      diaContacto: "",
      mesContacto: "",
      quienAgendo: "",
      modalidad: "Online",
      anoSemana: `${getYear(new Date()).toString().replace("20", "")}${getWeek(new Date())}`,
      nivel: "",
      horaClasePrueba: "",
      diaClasePrueba: {
        seconds: 0,
        nanoseconds: 0
      },
      mayorEdad: ""
    },
    validationSchema: agendadorSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!formik.values.diaClasePrueba || !formik.values.horaClasePrueba) {
      setScheduleError("");
      setAvailableGroups([]);
      setSelectedGroupId(null);
      return;
    }
  
    try {
      const date = firebaseTimestampToDate(formik.values.diaClasePrueba);
      if (!date) {
        setScheduleError("Fecha inválida");
        return;
      }
  
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const selectedHour = formik.values.horaClasePrueba;
      const formattedHour = convertHourFormat(selectedHour);
      const daySchedule = schedule[weekday] || {};
      const hourData = daySchedule[formattedHour];
  
      if (!hourData || hourData.length === 0) {
        setScheduleError("Horario no disponible");
        setAvailableGroups([]);
        setSelectedGroupId(null);
        return;
      }
  
      // Calcular disponibilidad para cada grupo
      const groupsAvailability = hourData.map(groupId => {
        const alumnosInscritos = Usuarios?.filter(user => {
          const userDate = firebaseTimestampToDate(user.diaClasePrueba);
          const userHour = convertHourFormat(user.horaClasePrueba);
          return (
            userDate?.getTime() === date.getTime() &&
            userHour === formattedHour &&
            user.maestro === groupId // Cambiamos user.hourId por user.maestro
          );
        }).length || 0;
  
        return {
          id: groupId,
          availableSlots: 6 - alumnosInscritos,
          alumnosInscritos: alumnosInscritos
        };
      });
  
      const availableGroupsFiltered = groupsAvailability
        .filter(group => group.availableSlots > 0)
        .sort((a, b) => b.alumnosInscritos - a.alumnosInscritos);
  
      if (availableGroupsFiltered.length === 0) {
        setScheduleError("Todos los grupos para este horario están llenos (máximo 6 alumnos por grupo)");
        setAvailableGroups([]);
        setSelectedGroupId(null);
      } else {
        setScheduleError("");
        setAvailableGroups(availableGroupsFiltered);
        
        // Seleccionamos el grupo con más alumnos (el primero después del sort)
        const mostFilledGroup = availableGroupsFiltered[0];
        setSelectedGroupId(mostFilledGroup.id);
      }
  
    } catch (error) {
      console.error("Error al validar disponibilidad:", error);
      setScheduleError("Error al verificar disponibilidad");
      setAvailableGroups([]);
      setSelectedGroupId(null);
    }
  }, [formik.values.horaClasePrueba, formik.values.diaClasePrueba, schedule, Usuarios]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-h-[80dvh] overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Nombre del Alumno */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Nombre del Alumno</label>
          <Input
            name="nombreAlumno"
            className="outline-none ring-0 ring-offset-0"
            placeholder="Juan Pérez"
            value={formik.values.nombreAlumno}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Campo: Quién Agendó */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Quién Agendó</label>
          <Select
            name="quienAgendo"
            value={formik.values.quienAgendo}
            onValueChange={(value) => formik.setFieldValue("quienAgendo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an agendador" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Agendadores.map((agendador) => (
                  <SelectItem key={agendador.id} value={agendador.id}>
                    {agendador.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Mes de Contacto */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Mes de Contacto</label>
          <Select
            name="mesContacto"
            value={formik.values.mesContacto}
            onValueChange={(value) => formik.setFieldValue("mesContacto", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthsOfYear.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Campo: Día de Contacto */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Día de Contacto</label>
          <Select
            name="diaContacto"
            value={formik.values.diaContacto}
            onValueChange={(value) => formik.setFieldValue("diaContacto", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {daysOfMonth.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Fecha de Clase Prueba */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Fecha de Clase Prueba</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatFirebaseDate(formik.values.diaClasePrueba)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={firebaseTimestampToDate(formik.values.diaClasePrueba)}
                onSelect={(date) => {
                  if (date) {
                    formik.setFieldValue("diaClasePrueba", {
                      seconds: Math.floor(date.getTime() / 1000),
                      nanoseconds: 0
                    });
                    formik.setFieldValue("horaClasePrueba", "");
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Campo: Hora de Clase */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Hora de Clase</label>
          <Select
            name="horaClasePrueba"
            value={formik.values.horaClasePrueba}
            onValueChange={(value) => formik.setFieldValue("horaClasePrueba", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {HORARIO_VALS.map((horario) => (
                  <SelectItem key={horario.value} value={horario.value}>
                    {horario.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Información del grupo asignado automáticamente */}
      {selectedGroupId && (
        <div className="w-full p-3 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-blue-800">
            Grupo asignado automáticamente: 
            <span className="font-bold ml-2">
              Grupo {availableGroups.findIndex(g => g.id === selectedGroupId) + 1}
            </span>
            <span className="text-sm text-blue-600 ml-2">
              ({availableGroups.find(g => g.id === selectedGroupId)?.availableSlots} cupos disponibles)
            </span>
          </p>
        </div>
      )}

      {scheduleError && (
        <p className="mt-1 text-sm text-red-500">{scheduleError}</p>
      )}

      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Modalidad */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Modalidad</label>
          <Select
            name="modalidad"
            value={formik.values.modalidad}
            onValueChange={(value) => formik.setFieldValue("modalidad", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Presencial"}>Presencial</SelectItem>
                <SelectItem value={"Online"}>Online</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Campo: Grupo (Mayor/Menor Edad) */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Grupo</label>
          <Select
            name="mayorEdad"
            value={formik.values.mayorEdad}
            onValueChange={(value) => formik.setFieldValue("mayorEdad", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Es mayor o menor de edad?" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Mayor_Edad"}>Mayor de Edad</SelectItem>
                <SelectItem value={"Menor_Edad"}>Menor de Edad</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botones de acción */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button disabled={IsLoading} type="submit">
          {IsLoading ? (
            <>
              <Loader2 className="animate-spin size-5 mr-2" /> Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}