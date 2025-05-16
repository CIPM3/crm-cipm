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
import { Loader2 } from "lucide-react"

// Esquema de validación para el formulario
const cursoFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  price: z.coerce.number().min(0, {
    message: "El precio debe ser un número positivo.",
  }),
  duration: z.string().min(1, {
    message: "La duración es requerida.",
  }),
  status: z.enum(["Activo", "Inactivo"]),
  type: z.enum(["Online", "Presencial", "Híbrido"]),
})

export type CursoFormValues = z.infer<typeof cursoFormSchema>

interface CursoFormProps {
  initialValues?: CursoFormValues
  onSubmit: (values: CursoFormValues) => void
  onCancel: () => void
}

export function CursoForm({ initialValues, onSubmit, onCancel }: CursoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Valores por defecto para un nuevo curso
  const defaultValues: Partial<CursoFormValues> = {
    title: "",
    description: "",
    price: 0,
    duration: "",
    status: "Activo",
    type: "Online",
  }

  // Configurar el formulario con react-hook-form
  const form = useForm<CursoFormValues>({
    resolver: zodResolver(cursoFormSchema),
    defaultValues: initialValues || defaultValues,
  })

  // Manejar el envío del formulario
  const handleSubmit = async (values: CursoFormValues) => {
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
              <FormLabel>Título del Curso</FormLabel>
              <FormControl>
                <Input placeholder="Introducción a la Gestión de Proyectos" {...field} />
              </FormControl>
              <FormDescription>Nombre completo del curso como aparecerá para los estudiantes.</FormDescription>
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
                  placeholder="Describe el contenido y objetivos del curso..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Una descripción detallada que ayude a los estudiantes a entender el curso.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (MXN)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Precio del curso en pesos mexicanos.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input placeholder="4 semanas" {...field} />
                </FormControl>
                <FormDescription>Duración estimada del curso (ej. 4 semanas, 2 meses).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FormDescription>Un curso activo es visible para los estudiantes.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Curso</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Modalidad en la que se impartirá el curso.</FormDescription>
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
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Guardando...
              </span>
            ) : initialValues ? "Actualizar Curso" : "Crear Curso"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

