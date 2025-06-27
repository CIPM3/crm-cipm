"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OverviewTab from "./tabs/OverviewTab"
import CoursesTab from "./tabs/CoursesTab"
import TasksTab from "./tabs/TasksTab"
import HistoryTab from "./tabs/HistoryTab"

export default function StudentTabs({ student, initialEnrollments:enrollments }: { student: any; initialEnrollments: any[] }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex overflow-x-auto">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="courses">Cursos</TabsTrigger>
        <TabsTrigger value="tasks">Tareas</TabsTrigger>
        <TabsTrigger value="history">Historial</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab enrollments={enrollments} />
      </TabsContent>

      <TabsContent value="courses">
        <CoursesTab
          student={student}
          enrollments={enrollments}
          setEnrollments={()=>{}}
        />
      </TabsContent>

      <TabsContent value="tasks">
        <TasksTab />
      </TabsContent>

      <TabsContent value="history">
        <HistoryTab enrollments={enrollments} />
      </TabsContent>
    </Tabs>
  )
}
