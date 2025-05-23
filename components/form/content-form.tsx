"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getCourseById, modules as ModulesData } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Esquema de validación para el formulario
const contentFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres.",
  }),
  type: z.enum(["video", "document", "quiz"]),
  moduleId: z.string().min(1, {
    message: "Debes seleccionar un módulo.",
  }),
  url: z.string().optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  questions: z.string().optional(),
})

export type ContentFormValues = z.infer<typeof contentFormSchema>

interface ContentFormProps {
  initialValues?: ContentFormValues
  onSubmit: (values: ContentFormValues) => void
  onCancel: () => void
  modules: any[]
  courseId?: string // ID del curso si se está añadiendo desde la página de detalles del curso
}

export function ContentForm({ initialValues, onSubmit, onCancel, modules, courseId }: ContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedType, setSelectedType] = useState(initialValues?.type || "video")
  const [filteredModules, setFilteredModules] = useState(modules)

  // Valores por defecto para un nuevo contenido
  const defaultValues: Partial<ContentFormValues> = {
    title: "",
    type: "video",
    moduleId: "",
    url: "",
    duration: "",
    description: "",
    questions: "",
  }

  // Configurar el formulario con react-hook-form
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: initialValues || defaultValues,
  })

  // Filtrar módulos por curso si se proporciona un courseId
  useEffect(() => {
    if (courseId) {
      setFilteredModules(modules)
    } else {
      setFilteredModules(modules)
    }
  }, [courseId, modules])

  // Obtener los módulos agrupados por curso
  const modulesByCourse: Record<string, { courseTitle: string; modules: typeof modules }> = filteredModules.reduce(
    (acc, module) => {
      const course = getCourseById(module.courseId)
      if (!course) return acc

      if (!acc[course.id]) {
        acc[course.id] = {
          courseTitle: course.title,
          modules: [],
        }
      }

      acc[course.id].modules.push(module)
      return acc
    },
    {},
  )

  // Manejar el envío del formulario
  const handleSubmit = async (values: ContentFormValues) => {
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
              <FormLabel>Título del Contenido</FormLabel>
              <FormControl>
                <Input placeholder="Introducción al tema" {...field} />
              </FormControl>
              <FormDescription>Nombre del contenido como aparecerá para los estudiantes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Contenido</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="quiz">Evaluación</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>El tipo de contenido determina cómo se presentará a los estudiantes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Módulo</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || initialValues?.moduleId || ""}
                defaultValue={field.value || initialValues?.moduleId || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un módulo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    filteredModules.filter(modulo => modulo.courseId === courseId).map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormDescription>El módulo al que pertenecerá este contenido.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "video" && (
          <>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Video</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/video.mp4" {...field} />
                  </FormControl>
                  <FormDescription>La URL donde se encuentra alojado el video.</FormDescription>
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
                    <Input placeholder="15:30" {...field} />
                  </FormControl>
                  <FormDescription>La duración del video (formato: MM:SS).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedType === "document" && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Documento</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/document.pdf" {...field} />
                </FormControl>
                <FormDescription>La URL donde se encuentra alojado el documento.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType === "quiz" && (
          <FormField
            control={form.control}
            name="questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Preguntas</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="10" {...field} />
                </FormControl>
                <FormDescription>El número de preguntas que tendrá la evaluación.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Breve descripción del contenido..." {...field} rows={3} />
              </FormControl>
              <FormDescription>Una breve descripción del contenido (opcional).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 
            <>
              <Loader2 className="animate-spin text-white mr-2"/>
              Guardando
            </> 
            : initialValues ? "Actualizar Contenido" : "Crear Contenido"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}