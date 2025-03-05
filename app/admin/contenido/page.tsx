"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modules, getCourseById } from "@/lib/utils"
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle, Video, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ContenidoForm, type ContenidoFormValues } from "@/components/form/contenido-form"

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [allModules, setAllModules] = useState<{ id: string; courseId: string; title: string; order: number; status: string; content: { id: string; type: string; title: string; duration?: string; url?: string; questions?: number }[] }[]>(modules)

  // Estados para los diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)

  // Flatten all content from all modules
  const allContent = allModules.flatMap((module) =>
    module.content.map((content) => ({
      ...content,
      moduleId: module.id,
      moduleTitle: module.title,
      courseId: module.courseId,
      status: module.status,
    })),
  )

  const filteredContent = allContent.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter === "all" || content.type === typeFilter) &&
      (statusFilter === "all" || content.status === statusFilter),
  )

  // Función para agregar nuevo contenido
  const handleCreateContent = (values: ContenidoFormValues) => {
    const targetModule = allModules.find((m) => m.id === values.moduleId)

    if (!targetModule) return

    const newContent = {
      id: `c${Date.now()}`,
      type: values.type,
      title: values.title,
      ...(values.type === "video" ? { duration: values.duration, url: values.url } : {}),
      ...(values.type === "document" ? { url: values.url } : {}),
      ...(values.type === "quiz" ? { questions: Number.parseInt(values.questions || "0") } : {}),
    }

    const updatedModules = allModules.map((module) => {
      if (module.id === values.moduleId) {
        return {
          ...module,
          content: [...module.content, newContent],
        }
      }
      return module
    })

    setAllModules(updatedModules)
    setIsCreateDialogOpen(false)
  }

  // Función para actualizar contenido existente
  const handleUpdateContent = (values: ContenidoFormValues) => {
    if (!selectedContent) return

    const updatedModules = allModules.map((module) => {
      if (module.id === selectedContent.moduleId) {
        const updatedContent = module.content.map((content) => {
          if (content.id === selectedContent.id) {
            return {
              ...content,
              title: values.title,
              type: values.type,
              ...(values.type === "video" ? { duration: values.duration, url: values.url } : {}),
              ...(values.type === "document" ? { url: values.url } : {}),
              ...(values.type === "quiz" ? { questions: Number.parseInt(values.questions || "0") } : {}),
            }
          }
          return content
        })

        return {
          ...module,
          content: updatedContent,
        }
      }
      return module
    })

    setAllModules(updatedModules)
    setIsEditDialogOpen(false)
    setSelectedContent(null)
  }

  // Función para eliminar contenido
  const handleDeleteContent = () => {
    if (!selectedContent) return

    const updatedModules = allModules.map((module) => {
      if (module.id === selectedContent.moduleId) {
        return {
          ...module,
          content: module.content.filter((content) => content.id !== selectedContent.id),
        }
      }
      return module
    })

    setAllModules(updatedModules)
    setIsDeleteDialogOpen(false)
    setSelectedContent(null)
  }

  // Función para cambiar el estado del contenido
  const toggleContentStatus = (content: any) => {
    const updatedModules = allModules.map((module) => {
      if (module.id === content.moduleId) {
        return {
          ...module,
          content: module.content.map((c) => {
            if (c.id === content.id) {
              return {
                ...c,
                status: c.status === "Activo" ? "Inactivo" : "Activo",
              }
            }
            return c
          }),
        }
      }
      return module
    })

    setAllModules(updatedModules)
  }

  // Función para abrir el diálogo de edición
  const openEditDialog = (content: any) => {
    setSelectedContent(content)
    setIsEditDialogOpen(true)
  }

  // Función para abrir el diálogo de eliminación
  const openDeleteDialog = (content: any) => {
    setSelectedContent(content)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contenido</h1>
          <p className="text-muted-foreground">Gestiona el contenido de tus cursos</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Contenido
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar contenido..."
            className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full md:w-auto"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Todos los tipos</option>
          <option value="video">Videos</option>
          <option value="document">Documentos</option>
          <option value="quiz">Evaluaciones</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full md:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filtrar</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredContent.map((content) => {
          const course = getCourseById(content.courseId)
          return (
            <Card key={content.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  {content.type === "video" && (
                    <div className="rounded-full bg-red-100 p-2">
                      <Video className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  {content.type === "document" && (
                    <div className="rounded-full bg-blue-100 p-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {content.type === "quiz" && (
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <CardTitle className="text-lg font-medium">{content.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={content.status === "Activo" ? "default" : "secondary"}>{content.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(content)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(content)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Más opciones</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="text-sm">
                    <span className="font-medium">Curso:</span> {course?.title}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Módulo:</span> {content.moduleTitle}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm">
                      <span className="font-medium">Tipo:</span> <span className="capitalize">{content.type}</span>
                      {content.type === "video" && content.duration && (
                        <span className="ml-2 text-muted-foreground">({content.duration})</span>
                      )}
                      {content.type === "quiz" && content.questions && (
                        <span className="ml-2 text-muted-foreground">({content.questions} preguntas)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Estado:</span>
                      <Switch
                        size="sm"
                        checked={content.status === "Activo"}
                        onCheckedChange={() => toggleContentStatus(content)}
                      />
                    </div>
                  </div>
                  {content.url && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">URL:</span>{" "}
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {content.url.length > 40 ? content.url.substring(0, 40) + "..." : content.url}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Diálogo para crear contenido */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Contenido</DialogTitle>
          </DialogHeader>
          <ContenidoForm
            modules={allModules}
            onSubmit={handleCreateContent}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar contenido */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Contenido</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <ContenidoForm
              modules={allModules}
              initialValues={{
                title: selectedContent.title,
                type: selectedContent.type,
                moduleId: selectedContent.moduleId,
                url: selectedContent.url || "",
                duration: selectedContent.duration || "",
                questions: selectedContent.questions ? String(selectedContent.questions) : "",
              }}
              onSubmit={handleUpdateContent}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar contenido */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el contenido
              <span className="font-semibold"> {selectedContent?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContent} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

