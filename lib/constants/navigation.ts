import { BarChart, BookOpen, CalendarDays, FileText, LayoutDashboard, Settings, Users, Video } from "lucide-react"
import { ROLES, type UserRole } from './roles'

// === ADMIN NAVIGATION WITH ROLE-BASED ACCESS ===

/**
 * Complete admin navigation structure with role-based visibility
 */
export const ADMIN_NAVIGATION = {
  // Dashboard - Available to all admin users
  DASHBOARD: {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.FORMACION, ROLES.AGENDADOR],
    description: "System overview and key metrics"
  },

  // Class Management - Role-specific access
  TRIAL_CLASSES: {
    title: "Clases Prueba",
    href: "/admin/clases/prueba",
    icon: CalendarDays,
    roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.FORMACION, ROLES.AGENDADOR],
    description: "Trial class scheduling and management",
    children: {
      AGENDADOR: {
        title: "Agendador",
        href: "/admin/clases/prueba/agendador",
        roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.AGENDADOR],
        description: "Schedule trial classes"
      },
      FORMACION: {
        title: "Formación",
        href: "/admin/clases/prueba/formacion",
        roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.FORMACION],
        description: "Group formation management"
      },
      INSTRUCTOR: {
        title: "Instructor",
        href: "/admin/clases/prueba/instructor",
        roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.INSTRUCTOR],
        description: "Instructor class management"
      }
    }
  },

  // Student Management
  STUDENTS: {
    title: "Estudiantes",
    href: "/admin/estudiantes",
    icon: Users,
    roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.FORMACION],
    description: "Student management and progress tracking"
  },

  // Course Management
  COURSES: {
    title: "Cursos",
    href: "/admin/cursos",
    icon: BookOpen,
    roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.INSTRUCTOR],
    description: "Course creation and management"
  },

  // Content Management
  CONTENT: {
    title: "Contenido",
    href: "/admin/contenido",
    icon: FileText,
    roles: [ROLES.DEVELOP, ROLES.ADMIN],
    description: "Content library management"
  },

  // Video Management
  VIDEOS: {
    title: "Videos",
    href: "/admin/videos",
    icon: Video,
    roles: [ROLES.DEVELOP, ROLES.ADMIN, ROLES.INSTRUCTOR],
    description: "Video content management"
  },

  // Reports and Analytics
  REPORTS: {
    title: "Reportes",
    href: "/admin/reportes",
    icon: BarChart,
    roles: [ROLES.DEVELOP, ROLES.ADMIN],
    description: "System reports and analytics"
  },

  // System Configuration
  CONFIGURATION: {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    roles: [ROLES.DEVELOP, ROLES.ADMIN],
    description: "System configuration and settings"
  }
} as const

/**
 * Helper function to get navigation items for a specific role
 */
export const getNavigationForRole = (userRole: UserRole) => {
  return Object.values(ADMIN_NAVIGATION).filter(nav => 
    (nav.roles as readonly string[]).includes(userRole as unknown as string)
  )
}

/**
 * Public client navigation
 */
export const NAVS = [
    {
        title: "Inicio",
        href: "/",
    },
    {
        title: "Cursos",
        href: "/cursos",
    },
    {
        title: "Videos",
        href: "/videos",
    },
    {
        title: "Contacto",
        href: "/#contacto",
    },
]

/**
 * Legacy navigation array for backward compatibility
 * @deprecated Use ADMIN_NAVIGATION instead
 */
export const ADMIN_NAVS = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clases Prueba",
    href: "/admin/clases/prueba",
    icon: CalendarDays,
  },
  {
    title: "Estudiantes",
    href: "/admin/estudiantes",
    icon: Users,
  },
  {
    title: "Cursos",
    href: "/admin/cursos",
    icon: BookOpen,
  },
  {
    title: "Videos",
    href: "/admin/videos",
    icon: Video,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]