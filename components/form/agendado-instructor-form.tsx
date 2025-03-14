"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { AgendadoFormProps, AgendadoFormValues } from "@/types";
import { agendadoSchema } from "@/lib/schemas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DIA_VALS, HORARIO_VALS, NIVELES_NAVS, SUB_NIVELES_NAVS } from "@/lib/constants";
import { getQueryClient } from "../provider/get-query-client";
import { Get } from "@/api/Usuarios/get";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DatePickerDemo } from "../datePicker";
import { Loader2 } from "lucide-react";

export function AgendadoForm({ initialValues, onSubmit, onCancel,IsLoading }: AgendadoFormProps) {
  const formik = useFormik<AgendadoFormValues>({
    initialValues: initialValues || {
      nombreAlumno: "",
      numero: "",
      dia: "",
      horario: "",
      observaciones: "",
      fecha: new Date(),
      maestro: "",
      nivel: "",
      subNivel: "",
    },
    validationSchema: agendadoSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(Get)
  const { data: Instructores,isPending:Loading } = useSuspenseQuery(Get);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-h-[80dvh] overflow-y-auto">
      {/* Campo: Nombre del Alumno */}
      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Nombre del Alumno</label>
          <Input
            name="nombreAlumno"
            className="outline-none ring-0 ring-offset-0"
            placeholder="Juan Pérez"
            value={formik.values.nombreAlumno}
            onChange={formik.handleChange}
            onBlur={() => formik.handleBlur}
          />
        </div>

        {/* Campo: Número de Teléfono */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Número de Teléfono</label>
          <Input
            name="numero"
            placeholder="+52 55 1234 5678"
            value={formik.values.numero}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Día */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Día</label>
          <Select
            name="dia"
            value={formik.values.dia}
            onValueChange={(value) => formik.setFieldValue('dia', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un día" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {DIA_VALS.map((dia) => (
                  <SelectItem key={dia.value} value={dia.value}>
                    {dia.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Campo: Horario */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Horario</label>

          <Select
            name="horario"
            value={formik.values.horario}
            onValueChange={(value) => formik.setFieldValue('horario', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un horario" />
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

      {/* Campo: Observaciones */}
      <div className="px-1">
        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <Input
          name="observaciones"
          placeholder="Asistió puntual"
          value={formik.values.observaciones}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.observaciones && formik.errors.observaciones ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.observaciones}</p>
        ) : null}
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Fecha */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          
          <DatePickerDemo
            value={formik.values.fecha}
            onChange={(date) => formik.setFieldValue("fecha", date)}
            onBlur={() => formik.setFieldTouched("fecha", true)}
          />
        </div>

        {/* Campo: Maestro */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Maestro</label>

          <Select
            name="maestro"
            value={formik.values.maestro}
            onValueChange={(value) => formik.setFieldValue('maestro', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Maestro" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Instructores.filter((instructor => instructor.role === "instructor")).map((nivel) => (
                  <SelectItem key={nivel.id} value={nivel.id}>
                    {nivel.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
        {/* Campo: Nivel */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Nivel</label>

          <Select
            name="nivel"
            value={formik.values.nivel}
            onValueChange={(value) => formik.setFieldValue('nivel', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Basico" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {NIVELES_NAVS.map((nivel) => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Campo: Sub Nivel (solo Intermedio) */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Sub Nivel (solo Intermedio)</label>

          <Select
            name="subNivel"
            value={formik.values.subNivel}
            onValueChange={(value) => formik.setFieldValue('subNivel', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="NO BASICS" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUB_NIVELES_NAVS.map((nivel) => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
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
          
         {IsLoading ? (<><Loader2 className="animate-spin size-5 mr-2" /> Guardando...</>): ("Guardar")}     
        </Button>
      </DialogFooter>
    </form>
  );
}