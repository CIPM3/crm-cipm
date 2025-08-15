import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseContent from "./CourseContent"
import InstructorsTab from "./InstructorsTab"
import ReviewsTab from "./ReviewsTab"
import { ContentsByModule, Course, Module } from "@/types"

interface CourseTabsSectionProps {
  modules: Module[]
  course: Course
  contentsByModule: ContentsByModule
}

export default function CourseTabsSection({
  modules,
  course,
  contentsByModule
}: CourseTabsSectionProps) {
  return (
    <Tabs defaultValue="contenido" className="mb-12">
      <TabsList className="mb-6">
        <TabsTrigger value="contenido">Contenido del Curso</TabsTrigger>
        <TabsTrigger value="instructores">Instructores</TabsTrigger>
        <TabsTrigger value="opiniones">Opiniones</TabsTrigger>
      </TabsList>
      
      <TabsContent value="contenido">
        <CourseContent
          modules={modules}
          course={course}
          contentsByModule={contentsByModule}
        />
      </TabsContent>
      
      <TabsContent value="instructores">
        <InstructorsTab />
      </TabsContent>
      
      <TabsContent value="opiniones">
        <ReviewsTab course={course} />
      </TabsContent>
    </Tabs>
  )
}