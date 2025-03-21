"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { AgendadorFormProps, AgendadorFormValues } from "@/types";
import { agendadorSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import { getYear, getWeek } from "date-fns"; // Asegúrate de tener instalada la librería date-fns
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAgendadores } from "@/hooks/agendador/useGetAgendadores";

const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function AgendadoForm({ initialValues, onSubmit, onCancel, IsLoading }: AgendadorFormProps) {
  const formik = useFormik<AgendadorFormValues>({
    initialValues: initialValues || {
      nombreAlumno: "",
      diaContacto: "",
      mesContacto: "",
      quienAgendo: "",
      modalidad: "",
      anoSemana: `${getYear(new Date()).toString().replace("20","")}${getWeek(new Date())}`, // Año y semana del año por defecto
    },
    validationSchema: agendadorSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const { Agendadores } = useGetAgendadores();

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
        {/* Campo: Modalidad (Opcional) */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Modalidad (Opcional)</label>
          <Input
            name="modalidad"
            placeholder="Presencial/Online"
            value={formik.values.modalidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>



      {/* Campo: Horario de Presencial (Opcional) */}

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