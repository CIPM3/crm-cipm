// === REFACTORED FIREBASE SERVICES ===
// This file provides a unified interface to all domain-specific services

// Base service utilities
export * from './base/firebase-base'

// Domain-specific services
export * from './users'
export * from './courses'
export * from './comments'
export * from './formacion'
export * from './estudiantes'
export * from './instructores'
export * from './videos'

// Re-exports for backward compatibility
export {
  // User operations
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUser,
  registerUser
} from './users'

export {
  // Course operations  
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
} from './courses'

export {
  // Comment operations
  getAllCommentsForCourse,
  getCommentById,
  createCourseComment,
  updateCourseComment,
  deleteCourseComment,
  toggleCommentLike,
  toggleCommentPin,
  toggleCommentModeration
} from './comments'

export {
  // Formacion operations
  getAllStudentsFormacion,
  getStudentFormacionById,
  createStudentFormacion,
  createFormacionStudent,
  updateStudentFormacion,
  updateFormacionStudent,
  deleteStudentFormacion,
  deleteFormacionStudent,
  getFormacionStudentsByStatus,
  getFormacionStudentsByWeek,
  getFormacionStudentsByTeacher,
  getFormacionStudentsByNivel,
  searchFormacionStudents,
  getActiveFormacionStudents
} from './formacion'

export {
  // Estudiantes operations
  getAllEstudiantes,
  getEstudianteById,
  createEstudiante,
  createEstudianteWithId,
  updateEstudiante,
  deleteEstudiante,
  getEstudiantesByRole,
  getActiveEstudiantes,
  searchEstudiantes,
  getEstudiantesByStatus,
  getEstudianteDisplayName,
  getEstudianteInitials,
  isEstudianteActive
} from './estudiantes'

export {
  // Instructores operations
  getAllInstructores,
  getInstructorById,
  createInstructor,
  createInstructorWithId,
  updateInstructor,
  deleteInstructor,
  getActiveInstructores,
  searchInstructores,
  getInstructoresByStatus,
  getInstructorDisplayName,
  getInstructorInitials,
  isInstructorActive,
  getInstructorSpecialties
} from './instructores'

export {
  // Videos operations
  getAllVideos,
  getVideoById,
  createVideo,
  createVideoWithId,
  updateVideo,
  deleteVideo,
  getVideosByTag,
  getFeaturedVideos,
  searchVideos,
  getVideosByDuration,
  formatVideoDuration,
  parseVideoDuration,
  getVideoThumbnail,
  isVideoFeatured,
  getVideoTags,
  setVideoTags
} from './videos'