import { BarChart, BookOpen, CalendarDays, FileText, LayoutDashboard, Settings, Users, Video } from "lucide-react";

// === FIREBASE COLLECTIONS CONFIGURATION ===

/**
 * Centralized Firebase collections with clear purpose and relationships
 * Each collection is documented with its purpose, relationships, and access patterns
 */
export const COLLECTIONS = {
  // === CORE ENTITIES ===
  USERS: 'Usuarios',                    // Central user management
  COURSES: 'Cursos',                    // Course catalog
  VIDEOS: 'Videos',                     // Video content library
  MODULES: 'Modulos',                   // Course modules
  CONTENTS: 'Contenidos',               // Module contents (videos, docs, quizzes)
  COURSE_COMMENTS: 'CourseComments',    // Course comments and discussions
  
  // === EDUCATIONAL MANAGEMENT ===
  TRIAL_CLASSES: 'Prueba',              // Trial class records
  ENROLLMENTS: 'Inscripciones',         // Student-course enrollments
  STUDENT_PROGRESS: 'ProgresoEstudiante', // Learning progress tracking
  
  // === SCHEDULING SYSTEM ===
  INSTRUCTOR_CLASSES: 'InstructorClasePrueba',     // Instructor-specific classes
  AGENDADOR_CLASSES: 'AgendadorClasePrueba',       // Scheduler-managed classes
  FORMACION_CLASSES: 'FORMACIONClasePrueba',       // Group formation classes
  INSTRUCTOR_SCHEDULE: 'HorarioInstructores',      // Instructor availability
  CLASS_SCHEDULE: 'HorarioClases',                 // Class timetables
  
  // === SYSTEM MANAGEMENT ===
  USER_SESSIONS: 'SesionesUsuario',     // User authentication sessions
  SYSTEM_CONFIG: 'ConfiguracionSistema', // System-wide configuration
  AUDIT_LOGS: 'RegistrosAuditoria',     // System activity logs
  NOTIFICATIONS: 'Notificaciones',      // User notifications
  
  // === ANALYTICS & REPORTING ===
  ANALYTICS: 'Analiticas',              // Usage analytics
  REPORTS: 'Reportes',                  // Generated reports
  FEEDBACK: 'Retroalimentacion',        // User feedback and reviews
} as const

/**
 * Legacy collection names for backward compatibility
 * @deprecated Use COLLECTIONS instead
 */
export const DB_COLLECCTIONS = {
  PRUEBA: COLLECTIONS.TRIAL_CLASSES,
  USUARIOS: COLLECTIONS.USERS,
  INSTRUCTOR: COLLECTIONS.INSTRUCTOR_CLASSES,
  AGENDADOR: COLLECTIONS.AGENDADOR_CLASSES,
  FORMACION_GRUPO: COLLECTIONS.FORMACION_CLASSES,
  HORARIO: COLLECTIONS.INSTRUCTOR_SCHEDULE
} as const

/**
 * Collection relationships and data flow patterns
 */
export const COLLECTION_RELATIONSHIPS = {
  // User-centric relationships
  USER_TO_ENROLLMENTS: `${COLLECTIONS.USERS} -> ${COLLECTIONS.ENROLLMENTS}`,
  USER_TO_PROGRESS: `${COLLECTIONS.USERS} -> ${COLLECTIONS.STUDENT_PROGRESS}`,
  USER_TO_SESSIONS: `${COLLECTIONS.USERS} -> ${COLLECTIONS.USER_SESSIONS}`,
  
  // Course-centric relationships
  COURSE_TO_MODULES: `${COLLECTIONS.COURSES} -> ${COLLECTIONS.MODULES}`,
  MODULE_TO_CONTENTS: `${COLLECTIONS.MODULES} -> ${COLLECTIONS.CONTENTS}`,
  COURSE_TO_ENROLLMENTS: `${COLLECTIONS.COURSES} -> ${COLLECTIONS.ENROLLMENTS}`,
  COURSE_TO_COMMENTS: `${COLLECTIONS.COURSES} -> ${COLLECTIONS.COURSE_COMMENTS}`,
  USER_TO_COMMENTS: `${COLLECTIONS.USERS} -> ${COLLECTIONS.COURSE_COMMENTS}`,
  
  // Scheduling relationships
  INSTRUCTOR_TO_SCHEDULE: `${COLLECTIONS.USERS} -> ${COLLECTIONS.INSTRUCTOR_SCHEDULE}`,
  SCHEDULE_TO_CLASSES: `${COLLECTIONS.INSTRUCTOR_SCHEDULE} -> ${COLLECTIONS.CLASS_SCHEDULE}`,
  
  // Progress tracking
  ENROLLMENT_TO_PROGRESS: `${COLLECTIONS.ENROLLMENTS} -> ${COLLECTIONS.STUDENT_PROGRESS}`,
  CONTENT_TO_PROGRESS: `${COLLECTIONS.CONTENTS} -> ${COLLECTIONS.STUDENT_PROGRESS}`,
} as const

/**
 * Access patterns for different user roles
 */
export const COLLECTION_ACCESS_PATTERNS = {
  ADMIN: {
    READ: Object.values(COLLECTIONS),
    write: Object.values(COLLECTIONS),
    description: 'Full system access'
  },
  INSTRUCTOR: {
    read: [
      COLLECTIONS.USERS,
      COLLECTIONS.COURSES,
      COLLECTIONS.MODULES,
      COLLECTIONS.CONTENTS,
      COLLECTIONS.ENROLLMENTS,
      COLLECTIONS.STUDENT_PROGRESS,
      COLLECTIONS.INSTRUCTOR_SCHEDULE,
      COLLECTIONS.CLASS_SCHEDULE,
      COLLECTIONS.COURSE_COMMENTS,
    ],
    write: [
      COLLECTIONS.INSTRUCTOR_SCHEDULE,
      COLLECTIONS.STUDENT_PROGRESS,
      COLLECTIONS.FEEDBACK,
      COLLECTIONS.COURSE_COMMENTS,
    ],
    description: 'Course delivery and student management'
  },
  AGENDADOR: {
    read: [
      COLLECTIONS.USERS,
      COLLECTIONS.TRIAL_CLASSES,
      COLLECTIONS.AGENDADOR_CLASSES,
      COLLECTIONS.INSTRUCTOR_SCHEDULE,
    ],
    write: [
      COLLECTIONS.TRIAL_CLASSES,
      COLLECTIONS.AGENDADOR_CLASSES,
    ],
    description: 'Scheduling and trial class management'
  },
  FORMACION: {
    read: [
      COLLECTIONS.USERS,
      COLLECTIONS.FORMACION_CLASSES,
      COLLECTIONS.STUDENT_PROGRESS,
    ],
    write: [
      COLLECTIONS.FORMACION_CLASSES,
    ],
    description: 'Group formation and management'
  },
  CLIENTE: {
    read: [
      COLLECTIONS.COURSES,
      COLLECTIONS.VIDEOS,
      COLLECTIONS.MODULES,
      COLLECTIONS.CONTENTS,
      COLLECTIONS.COURSE_COMMENTS,
    ],
    write: [
      COLLECTIONS.FEEDBACK,
      COLLECTIONS.COURSE_COMMENTS,
    ],
    description: 'Course consumption and feedback'
  }
} as const

// === USER ROLES & PERMISSIONS SYSTEM ===

/**
 * System roles with hierarchical permissions
 * Each role inherits permissions from lower-level roles
 */
export const ROLES = {
  ADMIN: "admin",
  DEVELOP: "develop",
  INSTRUCTOR: "instructor", 
  FORMACION: "formacion de grupo",
  AGENDADOR: "agendador",
  BASE: "base",
  CLIENTE: "cliente"
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

/**
 * Role hierarchy - higher roles inherit lower role permissions
 */
export const ROLE_HIERARCHY = {
  [ROLES.DEVELOP]: 110,      // Developer - above admin for debugging/maintenance
  [ROLES.ADMIN]: 100,        // Full system access
  [ROLES.INSTRUCTOR]: 80,    // Course delivery and student management
  [ROLES.FORMACION]: 60,     // Group formation and management
  [ROLES.AGENDADOR]: 40,     // Scheduling and trial classes
  [ROLES.BASE]: 20,          // Basic authenticated user
  [ROLES.CLIENTE]: 10        // Course consumption only
} as const

/**
 * Role-based permissions matrix
 */
export const ROLE_PERMISSIONS = {
  [ROLES.DEVELOP]: {
    collections: COLLECTION_ACCESS_PATTERNS.ADMIN,
    routes: ['/admin/**'],
    features: [
      'user-management',
      'course-management', 
      'video-management',
      'system-configuration',
      'analytics',
      'reports',
      'audit-logs'
    ],
    description: 'Developer role with full system administration'
  },
  [ROLES.ADMIN]: {
    collections: COLLECTION_ACCESS_PATTERNS.ADMIN,
    routes: ['/admin/**'],
    features: [
      'user-management',
      'course-management', 
      'video-management',
      'system-configuration',
      'analytics',
      'reports',
      'audit-logs'
    ],
    description: 'Full system administration'
  },
  [ROLES.INSTRUCTOR]: {
    collections: COLLECTION_ACCESS_PATTERNS.INSTRUCTOR,
    routes: ['/admin/clases/**', '/admin/estudiantes/**', '/admin/cursos/**'],
    features: [
      'course-delivery',
      'student-progress',
      'class-scheduling',
      'feedback-management',
      'comment-management',
      'comment-moderation'
    ],
    description: 'Teaching and student management'
  },
  [ROLES.FORMACION]: {
    collections: COLLECTION_ACCESS_PATTERNS.FORMACION,
    routes: ['/admin/clases/prueba/formacion/**'],
    features: [
      'group-formation',
      'student-classification',
      'group-management'
    ],
    description: 'Student grouping and classification'
  },
  [ROLES.AGENDADOR]: {
    collections: COLLECTION_ACCESS_PATTERNS.AGENDADOR,
    routes: ['/admin/clases/prueba/agendador/**'],
    features: [
      'trial-scheduling',
      'calendar-management',
      'instructor-assignment'
    ],
    description: 'Scheduling and calendar management'
  },
  [ROLES.BASE]: {
    collections: { read: [COLLECTIONS.USERS], write: [], description: 'Basic user profile' },
    routes: ['/profile/**'],
    features: ['profile-management'],
    description: 'Authenticated user with basic access'
  },
  [ROLES.CLIENTE]: {
    collections: COLLECTION_ACCESS_PATTERNS.CLIENTE,
    routes: ['/cursos/**', '/videos/**'],
    features: [
      'course-consumption',
      'video-viewing',
      'progress-tracking',
      'feedback-submission',
      'comment-creation',
      'comment-interaction'
    ],
    description: 'Course consumption and learning'
  }
} as const

/**
 * Legacy roles array for backward compatibility
 * @deprecated Use ROLES object instead
 */
export const ROLES_ARRAY = ["admin", "instructor", "formacion de grupo", "agendador", "base", "cliente"] as const

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
 * Helper function to check if user has access to a specific route
 */
export const hasRouteAccess = (userRole: UserRole, route: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return false
  
  return rolePermissions.routes.some(allowedRoute => {
    if (allowedRoute.endsWith('/**')) {
      const baseRoute = allowedRoute.slice(0, -3)
      return route.startsWith(baseRoute)
    }
    return route === allowedRoute
  })
}

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
        href: "/videos",// videos falta completar
    },
    // {
    //     title: "Testimonios",
    //     href: "/#testimonios",
    // },
    {
        title: "Contacto",
        href: "/#contacto",
    },
]

export const STATUS_VALS = [
    {value:'CERRO',label:"CERRO"},
    {value:'NO CERRO',label:"NO CERRO"},
    {value:'ESPERA',label:"ESPERA"},
]

export const HORARIO_VALS = [
    {
        value:"8:00 AM",label:"8:00 am",
    },
    {
        value:"9:00 AM",label:"9:00 am",
    },
    {
        value:"10:00 AM",label:"10:00 am",
    },
    {
        value:"11:00 AM",label:"11:00 am",
    },
    {
        value:"12:00 PM",label:"12:00 pm",
    },
    {
        value:"13:00 PM",label:"1:00 pm",
    },
    {
        value:"14:00 PM",label:"2:00 pm",
    },
    {
        value:"15:00 PM",label:"3:00 pm",
    },
    {
        value:"16:00 PM",label:"4:00 pm",
    },
    {
        value:"17:00 PM",label:"5:00 pm",
    },
    {
        value:"18:00 PM",label:"6:00 pm",
    },
    {
        value:"19:00 PM",label:"7:00 pm",
    },
    {
        value:"20:00 PM",label:"8:00 pm",
    },
    {
        value:"21:00 PM",label:"9:00 pm",
    },
    {
        value:"PENDIENTE",label:"Pendiente",
    },
]

export const DIA_VALS = [
    { value: "CURSO EN VIDEO", label: "Curso en video" },
    { value: "L-V", label: "Lunes a Viernes" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "SABADO", label: "Sabado" },
    { value: "DOMINGO", label: "Domingo" },
    { value: "INDIVIDUAL", label: "Individual" },
]

export const NIVELES_NAVS = [
    {
        value:"BASICO",label:"Básico",
    },
    {
        value:"INTERMEDIO",label:"Intermedio",
    },
    {
        value:"AVANZADO",label:"Avanzado",
    },
    {
        value:"LENTO",label:"Lento",
    },
]

export const SUB_NIVELES_NAVS = [
    {
        value:"NO-BASICS",label:"NO BASICS",
    },
    {
        value:"TRANSICIONES",label:"Transiciones",
    },
]