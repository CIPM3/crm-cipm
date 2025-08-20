// Enhanced query keys factory with versioning and performance optimization
export const queryKeys = {
  // Base keys with versioning for cache busting
  all: ['crm', 'v2'] as const,
  
  // Users with filtering support
  users: (filters?: { role?: string; active?: boolean }) => [
    ...queryKeys.all, 
    'users', 
    ...(filters ? [filters] : [])
  ] as const,
  user: (id: string) => [...queryKeys.users(), 'detail', id] as const,
  usersList: (filters?: { role?: string; active?: boolean; search?: string }) => [
    ...queryKeys.users(filters), 
    'list'
  ] as const,
  userProfile: (id: string) => [...queryKeys.user(id), 'profile'] as const,
  
  // Estudiantes (Students)
  estudiantes: (filters?: { status?: string; course?: string }) => [
    ...queryKeys.all,
    'estudiantes',
    ...(filters ? [filters] : [])
  ] as const,
  estudiante: (id: string) => [...queryKeys.estudiantes(), 'detail', id] as const,
  estudiantesList: (filters?: { active?: boolean; search?: string }) => [
    ...queryKeys.estudiantes(filters), 
    'list'
  ] as const,
  estudianteCourses: (id: string) => [...queryKeys.estudiante(id), 'courses'] as const,
  estudianteProgress: (id: string) => [...queryKeys.estudiante(id), 'progress'] as const,
  
  // Instructores with schedule integration
  instructores: (filters?: { specialty?: string; active?: boolean }) => [
    ...queryKeys.all,
    'instructores',
    ...(filters ? [filters] : [])
  ] as const,
  instructor: (id: string) => [...queryKeys.instructores(), 'detail', id] as const,
  instructoresList: (filters?: { active?: boolean; search?: string }) => [
    ...queryKeys.instructores(filters), 
    'list'
  ] as const,
  instructorSchedule: (id: string, date?: string) => [
    ...queryKeys.instructor(id), 
    'schedule',
    ...(date ? [date] : [])
  ] as const,
  instructorAvailability: (id: string) => [...queryKeys.instructor(id), 'availability'] as const,
  
  // Formacion with group management
  formacion: (filters?: { group?: string; level?: string }) => [
    ...queryKeys.all,
    'formacion',
    ...(filters ? [filters] : [])
  ] as const,
  formacionStudents: (filters?: { active?: boolean }) => [
    ...queryKeys.formacion(filters), 
    'students'
  ] as const,
  formacionStudent: (id: string) => [...queryKeys.formacion(), 'student', id] as const,
  formacionGroup: (groupId: string) => [...queryKeys.formacion(), 'group', groupId] as const,
  
  // Cursos with enhanced content tracking
  cursos: (filters?: { category?: string; instructor?: string; status?: string }) => [
    ...queryKeys.all,
    'cursos',
    ...(filters ? [filters] : [])
  ] as const,
  curso: (id: string) => [...queryKeys.cursos(), 'detail', id] as const,
  cursosList: (filters?: { published?: boolean; search?: string }) => [
    ...queryKeys.cursos(filters), 
    'list'
  ] as const,
  cursoModulos: (cursoId: string) => [...queryKeys.curso(cursoId), 'modulos'] as const,
  cursoModulo: (cursoId: string, moduloId: string) => [
    ...queryKeys.cursoModulos(cursoId), 
    'detail', 
    moduloId
  ] as const,
  cursoContenido: (cursoId: string, moduloId: string, contentId?: string) => [
    ...queryKeys.cursoModulo(cursoId, moduloId), 
    'contenido',
    ...(contentId ? [contentId] : [])
  ] as const,
  cursoStats: (id: string) => [...queryKeys.curso(id), 'stats'] as const,
  cursoEnrollments: (id: string) => [...queryKeys.curso(id), 'enrollments'] as const,
  
  // Videos with analytics
  videos: (filters?: { category?: string; duration?: string }) => [
    ...queryKeys.all,
    'videos',
    ...(filters ? [filters] : [])
  ] as const,
  video: (id: string) => [...queryKeys.videos(), 'detail', id] as const,
  videosList: (filters?: { published?: boolean; search?: string }) => [
    ...queryKeys.videos(filters), 
    'list'
  ] as const,
  videoComments: (id: string) => [...queryKeys.video(id), 'comments'] as const,
  videoAnalytics: (id: string) => [...queryKeys.video(id), 'analytics'] as const,
  relatedVideos: (id: string) => [...queryKeys.video(id), 'related'] as const,
  
  // Enhanced Schedules with conflict detection
  schedules: (filters?: { instructor?: string; type?: string }) => [
    ...queryKeys.all,
    'schedules',
    ...(filters ? [filters] : [])
  ] as const,
  schedule: (date?: string) => [
    ...queryKeys.schedules(), 
    'current',
    ...(date ? [date] : [])
  ] as const,
  scheduleDay: (date: string) => [...queryKeys.schedules(), 'day', date] as const,
  scheduleWeek: (startDate: string) => [...queryKeys.schedules(), 'week', startDate] as const,
  scheduleConflicts: (instructorId: string, date: string) => [
    ...queryKeys.schedules(), 
    'conflicts', 
    instructorId, 
    date
  ] as const,
  
  // Agendados with enhanced filtering
  agendados: (filters?: { instructor?: string; date?: string; status?: string }) => [
    ...queryKeys.all,
    'agendados',
    ...(filters ? [filters] : [])
  ] as const,
  agendado: (id: string) => [...queryKeys.agendados(), 'detail', id] as const,
  agendadosList: (filters?: { date?: string; instructor?: string }) => [
    ...queryKeys.agendados(filters), 
    'list'
  ] as const,
  
  // Enrollments with progress tracking
  enrollments: (filters?: { status?: string; course?: string }) => [
    ...queryKeys.all,
    'enrollments',
    ...(filters ? [filters] : [])
  ] as const,
  enrollment: (id: string) => [...queryKeys.enrollments(), 'detail', id] as const,
  enrollmentsList: (filters?: { active?: boolean; search?: string }) => [
    ...queryKeys.enrollments(filters), 
    'list'
  ] as const,
  studentEnrollments: (studentId: string) => [
    ...queryKeys.enrollments(), 
    'student', 
    studentId
  ] as const,
  courseEnrollments: (courseId: string) => [
    ...queryKeys.enrollments(), 
    'course', 
    courseId
  ] as const,
  
  // Enhanced Comentarios with threading
  comentarios: (filters?: { type?: string; status?: string }) => [
    ...queryKeys.all,
    'comentarios',
    ...(filters ? [filters] : [])
  ] as const,
  comentario: (id: string) => [...queryKeys.comentarios(), 'detail', id] as const,
  comentariosByVideo: (videoId: string) => [
    ...queryKeys.comentarios(), 
    'video', 
    videoId
  ] as const,
  comentariosByCurso: (cursoId: string) => [
    ...queryKeys.comentarios(), 
    'curso', 
    cursoId
  ] as const,
  comentarioReplies: (parentId: string) => [
    ...queryKeys.comentario(parentId), 
    'replies'
  ] as const,
  
  // Enhanced Auth with session management
  auth: () => [...queryKeys.all, 'auth'] as const,
  currentUser: () => [...queryKeys.auth(), 'current'] as const,
  userSession: (userId: string) => [...queryKeys.auth(), 'session', userId] as const,
  userPermissions: (userId: string) => [...queryKeys.auth(), 'permissions', userId] as const,
  
  // Analytics and reporting
  analytics: () => [...queryKeys.all, 'analytics'] as const,
  analyticsOverview: () => [...queryKeys.analytics(), 'overview'] as const,
  analyticsStudents: (timeRange?: string) => [
    ...queryKeys.analytics(), 
    'students',
    ...(timeRange ? [timeRange] : [])
  ] as const,
  analyticsCourses: (timeRange?: string) => [
    ...queryKeys.analytics(), 
    'courses',
    ...(timeRange ? [timeRange] : [])
  ] as const,
  analyticsInstructors: (timeRange?: string) => [
    ...queryKeys.analytics(), 
    'instructors',
    ...(timeRange ? [timeRange] : [])
  ] as const,
  
  // System configuration
  config: () => [...queryKeys.all, 'config'] as const,
  systemConfig: () => [...queryKeys.config(), 'system'] as const,
  userConfig: (userId: string) => [...queryKeys.config(), 'user', userId] as const,
} as const;

// Enhanced invalidation patterns with granular control and performance optimization
export const getInvalidationKeys = {
  // User operations with role-specific invalidation
  onUserCreate: (role?: string) => [
    queryKeys.usersList(),
    queryKeys.analyticsOverview(),
    ...(role === 'instructor' ? [queryKeys.instructoresList()] : []),
    ...(role === 'cliente' ? [queryKeys.estudiantesList()] : []),
  ],
  
  onUserUpdate: (id: string, role?: string) => [
    queryKeys.user(id),
    queryKeys.userProfile(id),
    queryKeys.usersList(),
    ...(role === 'instructor' ? [
      queryKeys.instructoresList(),
      queryKeys.instructorSchedule(id),
      queryKeys.instructorAvailability(id)
    ] : []),
    ...(role === 'cliente' ? [
      queryKeys.estudiantesList(),
      queryKeys.estudianteCourses(id),
      queryKeys.estudianteProgress(id)
    ] : []),
  ],
  
  onUserDelete: (id: string, role?: string) => [
    queryKeys.usersList(),
    queryKeys.analyticsOverview(),
    ...(role === 'instructor' ? [
      queryKeys.instructoresList(),
      queryKeys.schedules(),
      queryKeys.analyticsInstructors()
    ] : []),
    ...(role === 'cliente' ? [
      queryKeys.estudiantesList(),
      queryKeys.analyticsStudents()
    ] : []),
  ],
  
  // Student operations
  onEstudianteCreate: () => [
    queryKeys.estudiantesList(),
    queryKeys.analyticsStudents(),
    queryKeys.analyticsOverview(),
  ],
  
  onEstudianteUpdate: (id: string) => [
    queryKeys.estudiante(id),
    queryKeys.estudiantesList(),
    queryKeys.estudianteCourses(id),
    queryKeys.estudianteProgress(id),
  ],
  
  // Instructor operations
  onInstructorCreate: () => [
    queryKeys.instructoresList(),
    queryKeys.analyticsInstructors(),
    queryKeys.analyticsOverview(),
  ],
  
  onInstructorUpdate: (id: string) => [
    queryKeys.instructor(id),
    queryKeys.instructoresList(),
    queryKeys.instructorSchedule(id),
    queryKeys.instructorAvailability(id),
    queryKeys.schedules(),
  ],
  
  // Course operations with content invalidation
  onCursoCreate: () => [
    queryKeys.cursosList(),
    queryKeys.analyticsCourses(),
    queryKeys.analyticsOverview(),
  ],
  
  onCursoUpdate: (id: string) => [
    queryKeys.curso(id),
    queryKeys.cursosList(),
    queryKeys.cursoStats(id),
    queryKeys.cursoEnrollments(id),
    queryKeys.analyticsCourses(),
  ],
  
  onCursoDelete: (id: string) => [
    queryKeys.cursosList(),
    queryKeys.enrollmentsList(),
    queryKeys.analyticsCourses(),
    queryKeys.analyticsOverview(),
  ],
  
  onCursoModuloChange: (cursoId: string, moduloId?: string) => [
    queryKeys.cursoModulos(cursoId),
    queryKeys.curso(cursoId),
    ...(moduloId ? [
      queryKeys.cursoModulo(cursoId, moduloId),
      queryKeys.cursoContenido(cursoId, moduloId)
    ] : []),
  ],
  
  // Video operations with related content
  onVideoCreate: () => [
    queryKeys.videosList(),
    queryKeys.analyticsOverview(),
  ],
  
  onVideoUpdate: (id: string) => [
    queryKeys.video(id),
    queryKeys.videosList(),
    queryKeys.videoAnalytics(id),
    queryKeys.relatedVideos(id),
  ],
  
  onVideoDelete: (id: string) => [
    queryKeys.videosList(),
    queryKeys.comentariosByVideo(id),
  ],
  
  // Formacion operations
  onFormacionCreate: () => [
    queryKeys.formacionStudents(),
    queryKeys.analyticsOverview(),
  ],
  
  onFormacionUpdate: (id: string, groupId?: string) => [
    queryKeys.formacionStudent(id),
    queryKeys.formacionStudents(),
    ...(groupId ? [queryKeys.formacionGroup(groupId)] : []),
  ],
  
  // Schedule and booking operations
  onScheduleChange: (instructorId?: string, date?: string) => [
    queryKeys.schedules(),
    queryKeys.schedule(),
    queryKeys.agendadosList(),
    ...(instructorId ? [
      queryKeys.instructorSchedule(instructorId),
      queryKeys.instructorAvailability(instructorId),
      ...(date ? [queryKeys.scheduleConflicts(instructorId, date)] : [])
    ] : []),
    ...(date ? [queryKeys.scheduleDay(date)] : []),
  ],
  
  onAgendadoCreate: (instructorId: string, studentId: string, date: string) => [
    queryKeys.agendadosList(),
    queryKeys.schedules(),
    queryKeys.schedule(),
    queryKeys.scheduleDay(date),
    queryKeys.instructorSchedule(instructorId),
    queryKeys.instructorAvailability(instructorId),
    queryKeys.scheduleConflicts(instructorId, date),
    queryKeys.estudianteCourses(studentId),
  ],
  
  onAgendadoUpdate: (id: string, instructorId: string, date: string) => [
    queryKeys.agendado(id),
    queryKeys.agendadosList(),
    queryKeys.schedules(),
    queryKeys.scheduleDay(date),
    queryKeys.instructorSchedule(instructorId),
    queryKeys.instructorAvailability(instructorId),
    queryKeys.scheduleConflicts(instructorId, date),
  ],
  
  onAgendadoDelete: (instructorId: string, date: string) => [
    queryKeys.agendadosList(),
    queryKeys.schedules(),
    queryKeys.scheduleDay(date),
    queryKeys.instructorSchedule(instructorId),
    queryKeys.instructorAvailability(instructorId),
  ],
  
  // Enrollment operations
  onEnrollmentCreate: (studentId: string, courseId: string) => [
    queryKeys.enrollmentsList(),
    queryKeys.studentEnrollments(studentId),
    queryKeys.courseEnrollments(courseId),
    queryKeys.estudiante(studentId),
    queryKeys.estudianteCourses(studentId),
    queryKeys.estudianteProgress(studentId),
    queryKeys.curso(courseId),
    queryKeys.cursoStats(courseId),
    queryKeys.cursoEnrollments(courseId),
    queryKeys.analyticsStudents(),
    queryKeys.analyticsCourses(),
  ],
  
  onEnrollmentUpdate: (enrollmentId: string, studentId: string, courseId: string) => [
    queryKeys.enrollment(enrollmentId),
    queryKeys.studentEnrollments(studentId),
    queryKeys.courseEnrollments(courseId),
    queryKeys.estudianteProgress(studentId),
    queryKeys.cursoStats(courseId),
  ],
  
  onEnrollmentDelete: (studentId: string, courseId: string) => [
    queryKeys.enrollmentsList(),
    queryKeys.studentEnrollments(studentId),
    queryKeys.courseEnrollments(courseId),
    queryKeys.estudiante(studentId),
    queryKeys.estudianteCourses(studentId),
    queryKeys.estudianteProgress(studentId),
    queryKeys.curso(courseId),
    queryKeys.cursoStats(courseId),
    queryKeys.cursoEnrollments(courseId),
  ],
  
  // Comment operations with threading support
  onComentarioCreate: (videoId?: string, cursoId?: string, parentId?: string) => {
    const keys = [queryKeys.comentarios()];
    if (videoId) keys.push(queryKeys.comentariosByVideo(videoId));
    if (cursoId) keys.push(queryKeys.comentariosByCurso(cursoId));
    if (parentId) keys.push(queryKeys.comentarioReplies(parentId));
    return keys;
  },
  
  onComentarioUpdate: (id: string, videoId?: string, cursoId?: string) => [
    queryKeys.comentario(id),
    queryKeys.comentarios(),
    ...(videoId ? [queryKeys.comentariosByVideo(videoId)] : []),
    ...(cursoId ? [queryKeys.comentariosByCurso(cursoId)] : []),
  ],
  
  onComentarioDelete: (id: string, videoId?: string, cursoId?: string) => [
    queryKeys.comentarios(),
    queryKeys.comentarioReplies(id), // Clear replies to deleted comment
    ...(videoId ? [queryKeys.comentariosByVideo(videoId)] : []),
    ...(cursoId ? [queryKeys.comentariosByCurso(cursoId)] : []),
  ],
  
  // Auth operations
  onUserLogin: (userId: string) => [
    queryKeys.currentUser(),
    queryKeys.userSession(userId),
    queryKeys.userPermissions(userId),
    queryKeys.userConfig(userId),
  ],
  
  onUserLogout: (userId: string) => [
    queryKeys.currentUser(),
    queryKeys.userSession(userId),
  ],
  
  // System operations
  onSystemConfigUpdate: () => [
    queryKeys.systemConfig(),
    queryKeys.analyticsOverview(),
  ],
  
  // Batch operations for performance
  onDataImport: () => [
    queryKeys.usersList(),
    queryKeys.estudiantesList(),
    queryKeys.instructoresList(),
    queryKeys.cursosList(),
    queryKeys.videosList(),
    queryKeys.enrollmentsList(),
    queryKeys.formacionStudents(),
    queryKeys.analyticsOverview(),
  ],
  
  // Analytics refresh
  onAnalyticsRefresh: (timeRange?: string) => [
    queryKeys.analyticsOverview(),
    queryKeys.analyticsStudents(timeRange),
    queryKeys.analyticsCourses(timeRange),
    queryKeys.analyticsInstructors(timeRange),
  ],
  
  // Nuclear option - clear all cache
  clearAll: () => [queryKeys.all],
};