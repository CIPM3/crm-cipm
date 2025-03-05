"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"

// Esquema de validación para el formulario
const moduloFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  order: z.coerce.number().min(1, {
    message: "El orden debe ser un número positivo.",
  }),
  status: z.enum(["Activo", "Inactivo"]),
})

export type ModuloFormValues = z.infer<typeof moduloFormSchema>

interface ModuloFormProps {
  courseId: string
  initialValues?: ModuloFormValues
  onSubmit: (values: ModuloFormValues) => void
  onCancel: () => void
}

export function ModuloForm({ courseId, initialValues, onSubmit, onCancel }: ModuloFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Valores por defecto para un nuevo módulo
  const defaultValues: Partial<ModuloFormValues> = {
    title: "",
    description: "",
    order: 1,
    status: "Activo",
  }

  // Configurar el formulario con react-hook-form
  const form = useForm<ModuloFormValues>({
    resolver: zodResolver(moduloFormSchema),
    defaultValues: initialValues || defaultValues,
  })

  // Manejar el envío del formulario
  const handleSubmit = async (values: ModuloFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Módulo</FormLabel>
              <FormControl>
                <Input placeholder="Introducción a la Gestión de Proyectos" {...field} />
              </FormControl>
              <FormDescription>Nombre del módulo como aparecerá para los estudiantes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe el contenido y objetivos del módulo..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Una descripción detallada que ayude a los estudiantes a entender el módulo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="1" {...field} />
                </FormControl>
                <FormDescription>Posición del módulo en el curso.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Un módulo activo es visible para los estudiantes.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : initialValues ? "Actualizar Módulo" : "Crear Módulo"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

