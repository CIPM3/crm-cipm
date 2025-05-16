import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./overview-tab"
import { ModulesTab } from "./modules-tab"
import { ContentTab } from "./content-tab"
import { StudentsTab } from "./students-tab"

export function CursoTabs({
  activeTab,
  handleTabChange,
  course,
  modules,
  enrollments,
}: {
  activeTab: string
  handleTabChange: (value: string) => void
  course: any
  modules: any[]
  enrollments: any[]
}) {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="flex overflow-x-auto">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="modules">Módulos</TabsTrigger>
        <TabsTrigger value="content">Contenido</TabsTrigger>
        <TabsTrigger value="students">Estudiantes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab
          course={course}
          modules={modules}
          enrollments={enrollments}
          handleTabChange={handleTabChange}
        />
      </TabsContent>
      <TabsContent value="modules">
        <ModulesTab
          modules={modules}
          params={{ id: course.id }}
          router={{ push: (path: string) => handleTabChange(path) }}
        />
      </TabsContent>
      <TabsContent value="content">
        <ContentTab
          modules={modules}
          courseId={course.id}
        />
      </TabsContent>
      <TabsContent value="students">
        <StudentsTab enrollments={enrollments} />
      </TabsContent>
    </Tabs>
  )
}