// Firebase collections configuration
// Centralized Firebase collections with clear purpose and relationships

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
  CONTENTS: 'Content',                  // Module contents (videos, docs, quizzes)
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
    read: Object.values(COLLECTIONS),
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
      COLLECTIONS.COURSE_COMMENTS,
    ],
    description: 'Teaching and student management'
  },
  STUDENT: {
    read: [
      COLLECTIONS.COURSES,
      COLLECTIONS.MODULES,
      COLLECTIONS.CONTENTS,
      COLLECTIONS.ENROLLMENTS,
      COLLECTIONS.STUDENT_PROGRESS,
      COLLECTIONS.COURSE_COMMENTS,
    ],
    write: [
      COLLECTIONS.COURSE_COMMENTS,
    ],
    description: 'Learning content access and participation'
  }
} as const