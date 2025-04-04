"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { FormacionDataType } from "@/types";
import { agendadorSchemaFormacion } from "@/lib/schemas"; // Necesitarás crear este schema
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { STATUS_VALS, HORARIO_VALS, DIA_VALS, NIVELES_NAVS } from "@/lib/constants";
import { DatePickerDemo } from "../datePicker";
import { Loader2 } from "lucide-react";
import { useGetInstructores } from "@/hooks/usuarios/useGetInstructores";
import { Timestamp } from "firebase/firestore";

interface FormacionFormProps {
    initialValues?: FormacionDataType;
    onSubmit: (values: FormacionDataType) => Promise<void>;
    onCancel: () => void;
    IsLoading: boolean;
}

export function FormacionForm({ initialValues, onSubmit, onCancel, IsLoading }: FormacionFormProps) {
    const formik = useFormik<FormacionDataType>({
        initialValues: initialValues || {
            status: "",
            week: "",
            nombre: "",
            telefono: "",
            modalidad: "",
            horario: "",
            observaciones: "",
            fecha: Timestamp.now(),
            maestro: "",
            nivel: "",
            tipo: ""
        },
        validationSchema: agendadorSchemaFormacion,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    const { Instructores } = useGetInstructores();

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 max-h-[80dvh] overflow-y-auto">
            {/* Campos principales */}
            <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
                {/* Campo: Nombre */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <Input
                        name="nombre"
                        placeholder="Nombre completo"
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                {/* Campo: Teléfono */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <Input
                        name="telefono"
                        placeholder="+52 55 1234 5678"
                        value={formik.values.telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </div>


            {/* Campos de estado y semana */}
            <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
                {/* Campo: Status */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                        name="status"
                        value={formik.values.status}
                        onValueChange={(value) => formik.setFieldValue('status', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {STATUS_VALS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Campo: Week */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Semana</label>
                    <Input
                        name="week"
                        placeholder="Ej: 2415 (año 24, semana 15)"
                        value={formik.values.week}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </div>

            {/* Campos de modalidad y horario */}
            <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
                {/* Campo: Modalidad */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Modalidad</label>
                    <Select
                        name="modalidad"
                        value={formik.values.modalidad}
                        onValueChange={(value) => formik.setFieldValue('modalidad', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {DIA_VALS.map((modalidad) => (
                                    <SelectItem key={modalidad.value} value={modalidad.value}>
                                        {modalidad.label}
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
                    placeholder="Observaciones importantes"
                    value={formik.values.observaciones}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            {/* Campos de fecha y maestro */}
            <div className="flex flex-col md:flex-row gap-y-6 px-1 md:gap-y-0 items-center justify-between gap-x-2">
                {/* Campo: Fecha */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <DatePickerDemo
                        value={formik.values.fecha.toDate()}
                        onChange={(date) => {
                            if (date) {
                                formik.setFieldValue("fecha", Timestamp.fromDate(date));
                            }
                        }}
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
                            <SelectValue placeholder="Selecciona maestro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Instructores.filter(instructor => instructor.role === "instructor").map((instructor) => (
                                    <SelectItem key={instructor.id} value={instructor.id}>
                                        {instructor.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Campos de nivel y tipo */}
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
                            <SelectValue placeholder="Selecciona nivel" />
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

                {/* Campo: Tipo */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <Select
                        name="tipo"
                        value={formik.values.tipo}
                        onValueChange={(value) => formik.setFieldValue('tipo', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={"Online"}>
                                    Online
                                </SelectItem>
                                <SelectItem value={"Presencial"}>
                                    Presencial
                                </SelectItem>
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
                <Button
                    type="submit"
                    disabled={IsLoading || formik.isSubmitting}
                    aria-disabled={IsLoading || formik.isSubmitting}
                >
                    {IsLoading || formik.isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin size-5 mr-2" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar"
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}