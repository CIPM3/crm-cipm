// Query keys factory for consistent cache keys
export const queryKeys = {
  // Users
  users: ['users'] as const,
  user: (id: string) => [...queryKeys.users, id] as const,
  usersList: () => [...queryKeys.users, 'list'] as const,
  
  // Estudiantes
  estudiantes: ['estudiantes'] as const,
  estudiante: (id: string) => [...queryKeys.estudiantes, id] as const,
  estudiantesList: () => [...queryKeys.estudiantes, 'list'] as const,
  
  // Instructores
  instructores: ['instructores'] as const,
  instructor: (id: string) => [...queryKeys.instructores, id] as const,
  instructoresList: () => [...queryKeys.instructores, 'list'] as const,
  
  // Formacion
  formacion: ['formacion'] as const,
  formacionStudents: () => [...queryKeys.formacion, 'students'] as const,
  formacionStudent: (id: string) => [...queryKeys.formacion, 'student', id] as const,
  
  // Cursos
  cursos: ['cursos'] as const,
  curso: (id: string) => [...queryKeys.cursos, id] as const,
  cursosList: () => [...queryKeys.cursos, 'list'] as const,
  cursoModulos: (cursoId: string) => [...queryKeys.cursos, cursoId, 'modulos'] as const,
  cursoContenido: (cursoId: string, moduloId: string) => 
    [...queryKeys.cursos, cursoId, 'modulos', moduloId, 'contenido'] as const,
  
  // Videos
  videos: ['videos'] as const,
  video: (id: string) => [...queryKeys.videos, id] as const,
  videosList: () => [...queryKeys.videos, 'list'] as const,
  
  // Schedules
  schedules: ['schedules'] as const,
  schedule: () => [...queryKeys.schedules, 'current'] as const,
  
  // Comentarios
  comentarios: ['comentarios'] as const,
  comentariosByVideo: (videoId: string) => [...queryKeys.comentarios, 'video', videoId] as const,
  comentariosByCurso: (cursoId: string) => [...queryKeys.comentarios, 'curso', cursoId] as const,
  
  // Auth
  auth: ['auth'] as const,
  currentUser: () => [...queryKeys.auth, 'current'] as const,
} as const;

// Helper function to invalidate related queries
export const getInvalidationKeys = {
  onUserCreate: () => [queryKeys.users],
  onEstudianteCreate: () => [queryKeys.estudiantes],
  onInstructorCreate: () => [queryKeys.instructores],
  onCursoCreate: () => [queryKeys.cursos],
  onVideoCreate: () => [queryKeys.videos],
  onFormacionCreate: () => [queryKeys.formacion],
  onComentarioCreate: (videoId?: string, cursoId?: string) => {
    const keys = [queryKeys.comentarios];
    if (videoId) keys.push(queryKeys.comentariosByVideo(videoId));
    if (cursoId) keys.push(queryKeys.comentariosByCurso(cursoId));
    return keys;
  },
};