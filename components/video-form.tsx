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
import { Switch } from "@/components/ui/switch"
import { DialogFooter } from "@/components/ui/dialog"

// Esquema de validación para el formulario
const videoFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  url: z.string().url({
    message: "Debe ser una URL válida.",
  }),
  thumbnail: z.string().optional(),
  duration: z.string().min(1, {
    message: "La duración es requerida.",
  }),
  category: z.string().min(1, {
    message: "La categoría es requerida.",
  }),
  tags: z.string(),
  status: z.enum(["Publicado", "Borrador"]),
  featured: z.boolean().default(false),
})

export type VideoFormValues = z.infer<typeof videoFormSchema>

interface VideoFormProps {
  initialValues?: VideoFormValues
  onSubmit: (values: VideoFormValues) => void
  onCancel: () => void
}

export function VideoForm({ initialValues, onSubmit, onCancel }: VideoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Valores por defecto para un nuevo video
  const defaultValues: Partial<VideoFormValues> = {
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    duration: "",
    category: "Fundamentos",
    tags: "",
    status: "Borrador",
    featured: false,
  }

  // Configurar el formulario con react-hook-form
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: initialValues || defaultValues,
  })

  // Manejar el envío del formulario
  const handleSubmit = async (values: VideoFormValues) => {
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
              <FormLabel>Título del Video</FormLabel>
              <FormControl>
                <Input placeholder="Introducción a la Gestión de Proyectos" {...field} />
              </FormControl>
              <FormDescription>Nombre del video como aparecerá para los usuarios.</FormDescription>
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
                <Textarea placeholder="Describe el contenido del video..." className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Una descripción detallada que ayude a los usuarios a entender el contenido del video.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Video</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/video.mp4" {...field} />
                </FormControl>
                <FormDescription>URL donde se encuentra alojado el video.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la Miniatura</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                </FormControl>
                <FormDescription>URL de la imagen de miniatura (opcional).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input placeholder="15:30" {...field} />
                </FormControl>
                <FormDescription>Duración del video (formato: MM:SS).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fundamentos">Fundamentos</SelectItem>
                    <SelectItem value="Metodologías">Metodologías</SelectItem>
                    <SelectItem value="Herramientas">Herramientas</SelectItem>
                    <SelectItem value="Liderazgo">Liderazgo</SelectItem>
                    <SelectItem value="Certificaciones">Certificaciones</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Categoría a la que pertenece el video.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiquetas</FormLabel>
              <FormControl>
                <Input placeholder="gestión, proyectos, introducción" {...field} />
              </FormControl>
              <FormDescription>Etiquetas separadas por comas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    <SelectItem value="Publicado">Publicado</SelectItem>
                    <SelectItem value="Borrador">Borrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Un video publicado es visible para los usuarios.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Destacado</FormLabel>
                  <FormDescription>Marcar este video como destacado.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : initialValues ? "Actualizar Video" : "Crear Video"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

