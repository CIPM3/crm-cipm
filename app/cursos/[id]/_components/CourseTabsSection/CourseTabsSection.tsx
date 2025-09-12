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
    <Tabs defaultValue="contenido" className="mb-6 md:mb-12">
      <TabsList className="w-full grid grid-cols-3 mb-4 md:mb-6 h-auto p-1">
        <TabsTrigger 
          value="contenido" 
          className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[40px]"
        >
          <span className="block sm:hidden">Contenido</span>
          <span className="hidden sm:block">Contenido del Curso</span>
        </TabsTrigger>
        <TabsTrigger 
          value="instructores" 
          className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[40px]"
        >
          Instructores
        </TabsTrigger>
        <TabsTrigger 
          value="opiniones" 
          className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[40px]"
        >
          Opiniones
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="contenido" className="mt-4 md:mt-6">
        <CourseContent
          modules={modules}
          course={course}
          contentsByModule={contentsByModule}
        />
      </TabsContent>
      
      <TabsContent value="instructores" className="mt-4 md:mt-6">
        <InstructorsTab />
      </TabsContent>
      
      <TabsContent value="opiniones" className="mt-4 md:mt-6">
        <ReviewsTab course={course} />
      </TabsContent>
    </Tabs>
  )
}