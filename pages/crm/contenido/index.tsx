"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { modules, getCourseById } from "@/lib/utils"
import { Plus, Search, Filter } from "lucide-react"
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
import { type ContenidoFormValues } from "@/components/form/contenido-form"
import ContenidoCard from "@/components/card/contenido-card"
import CreateContenidoDialog from "@/components/dialog/contenido/create-contenido-dialog"
import EditContenidoDialog from "@/components/dialog/contenido/edit-contenido-dialog"
import DeleteContenidoDialog from "@/components/dialog/contenido/delete-contenido-dialog"

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
                status: "Activo",
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
            <ContenidoCard
              key={content.id}
              contenido={content}
              openEditDialog={()=> openEditDialog(content)}
              openDeleteDialog={()=> openDeleteDialog(content)}
              toggleContentStatus={()=>toggleContentStatus(true)}
            />
          )
        })}
      </div>

      {/* Diálogo para crear contenido */}
      <CreateContenidoDialog
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        allModules={allModules}
        handleCreateContent={handleCreateContent}
      />

      {/* Diálogo para editar contenido */}
      <EditContenidoDialog
        allModules={allModules}
        handleUpdateContent={handleUpdateContent}
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
        selectedContent={selectedContent}
        setIsEditDialogOpen={()=>setIsEditDialogOpen(false)}
      />

      {/* Diálogo de confirmación para eliminar contenido */}
      
      <DeleteContenidoDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        handleDeleteContent={handleDeleteContent}
        selectedContent={selectedContent}
      />
    </div>
  )
}

