// lib/firebase/index.ts
// Centralized exports for all Firebase services

// Base functionality
export * from './base'
export * from './auth'

// Domain-specific services
export * from './users'
export * from './instructors'
export * from './courses'
export * from './videos'
export * from './formacion'
export * from './comments'

// Legacy compatibility - re-export everything that was in the original firebaseService.ts
// This ensures backward compatibility for existing imports

// Base operations
export { 
  fetchItems, 
  fetchItem, 
  addItem, 
  updateItem, 
  deleteItem, 
  setItem,
  queryItems,
  batchUpdateItems,
  incrementField,
  fetchItemsPaginated
} from './base'

// Auth operations  
export { loginUser, registerUser } from './auth'

// Users
export {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getAllEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante
} from './users'

// Instructors
export {
  getAllInstructores,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor
} from './instructors'

// Formacion
export {
  getAllStudentsFormacion,
  getStudentFormacionById,
  createStudentFormacion,
  updateStudentFormacion,
  deleteStudentFormacion
} from './formacion'

// Courses
export {
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
} from './courses'

// Videos
export {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} from './videos'

// Comments
export {
  getCommentsByCourse,
  getAllCourseComments,
  getTopLevelComments,
  getCommentReplies,
  getUserComments,
  getPinnedComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  pinComment,
  moderateComment
} from './comments'