import { Timestamp } from 'firebase/firestore';
import { ROLES_ARRAY, UserRole } from '../lib/constants';
export interface CursoType {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    status: string;
    enrollments: number;
    rating: number;
    modules: string[];
    type?: 'online'
}

export interface FiltersType {
    id?: string;
    value: string;
    name: string;
}

export interface VideoType {
    moduleId?: string;
    moduleTitle?: string;
    courseId?: string;
    courseName?: string;
    moduleStatus?: string;
    id: string;
    type: string;
    title: string;
    duration: string;
    url: string;
    questions?: undefined;
}

export interface CreateVideoForm {
  id:string
  title: string
  description: string
  url: string
  duration: string       // formato "mm:ss" o "hh:mm:ss"
  thumbnail?: string
  tags?: string          // etiquetas separadas por comas
  featured?: boolean
}

export interface ContenidoType {
    moduleId: string;
    moduleTitle: string;
    courseId: string;
    status: string;
    id: string;
    type: string;
    title: string;
    duration?: string;
    url?: string;
    questions?: number;
}

export interface allModules {
    id: string;
    courseId: string;
    title: string;
    order: number;
    status: string;
    content: {
        id: string;
        type: string;
        title: string;
        duration?: string;
        url?: string;
        questions?: number;
    }[];
}[]

export interface UsersType {
    id: string;
    name: string;
    email: string;
    role: typeof ROLES_ARRAY[number];
    avatar: string;
    createdAt?: string;
    phone?: string;
    status?: string; // Agregado para el estado del usuario
}

export type AgendadoFormValues = {
    nombreAlumno: string;
    numero: string;
    dia: string;
    horario: string;
    observaciones?: string;
    fecha: Date; // Cambiar a Date
    maestro: string;
    nivel: string;
    subNivel?: string;
};

export type AgendadorFormValues = {
    nombreAlumno: string;
    anoSemana: string;
    diaContacto: string;
    quienAgendo: string;
    modalidad: string;
    mesContacto: string;
    mayorEdad: string; // Nuevo campo
    nivel: string; // Nuevo campo
    horaClasePrueba: string; // Nuevo campo (formato "HH:MM")
    diaClasePrueba: string; // Nuevo campo (formato "HH:MM")
    maestro?: string
}

export interface AgendadoFormProps {
    initialValues?: AgendadoFormValues;
    onSubmit: (values: AgendadoFormValues) => void;
    onCancel: () => void;
    IsLoading?: boolean;
}

export interface AgendadorFormProps {
    initialValues?: AgendadorFormValues;
    onSubmit: (values: AgendadorFormValues) => Promise<void>;
    onCancel: () => void;
    IsLoading: boolean;
}

export interface ClasePrubeaType {
    id?: string;
    nombreAlumno: string;
    numero: string;
    dia: string;
    horario: string;
    observaciones: string;
    fecha?: Timestamp;
    maestro: string | undefined;
    nivel?: string;
    subNivel?: string;
    anoSemana?: string;
}

export interface ClasePrubeaAgendadorType {
    id?: string;
    nombreAlumno: string,
    diaContacto: string,
    mesContacto: string,
    quienAgendo: string,
    modalidad: string,
    anoSemana: string,
    nivel: string,
    mayorEdad: string,
    horaClasePrueba: string; // Nuevo campo (formato "HH:MM")
    diaClasePrueba: string;
}

export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role: typeof ROLES_ARRAY[number]; // Agregar el campo "role"
}

export interface UpdateUserData {
    id: string; // ID del usuario a actualizar
    name?: string;
    email?: string;
    role?: typeof ROLES_ARRAY[number];
    avatar?: string;
}

export interface RefetchState {
    shouldRefetch: boolean;
    triggerRefetch: () => void;
    resetRefetch: () => void;
}

export interface LoginUserData {
    email: string;
    password: string;
}

// Tipos para los eventos
export type EventStatus = "scheduled" | "missed" | "late" | "completed"

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    status: EventStatus;
    type: string;
    studentName: string;
    level: string;
    time: string;
    additionalInfo?: string;
    anoSemana: string
}

export type Instructor = {
    id: string;
    name: string;
};

export type TimeSlotAssignment = {
    instructors: Instructor[];
};

export type ScheduleData = {
    [day: string]: {
        [hour: string]: TimeSlotAssignment;
    };
};

export interface FormacionDataType {
    id?: string;
    status: string;
    week: string;
    nombre: string;
    telefono: string;
    modalidad: string;
    horario: string;
    observaciones?: string;
    fecha: Timestamp;
    maestro: string;
    nivel: string;
    tipo: string
}

// types/Course.ts
export interface Course {
    id: string
    title: string
    description: string
    price: number
    duration: string
    status: 'Activo' | 'Inactivo'
    enrollments: number
    rating: number
    modules: string[]
}

// types/Module.ts
export interface Module {
    id: string
    courseId: string
    title: string,
    description: string
    type: string, 
    order: number
    status: 'Activo' | 'Inactivo'
}

export type ContentItem =
    | {
        id: string
        type: 'video'
        title: string
        duration: string
        url: string
    }
    | {
        id: string
        type: 'document'
        title: string
        url: string
    }
    | {
        id: string
        type: 'quiz'
        title: string
        questions: number
    }

export type Content = {
    id: string
    title: string
    description: string
    type: "video" | "document" | "quiz",
    url?: string
    duration: string
    questions: number
    moduleId: string
    courseId:string
}
// types/Enrollment.ts
export interface Enrollment {
    id: string
    studentId: string
    courseId: string
    enrollmentDate: string // formato ISO string
    status: string
    progress: number
    lastAccessed: string; // formato ISO string (modifiqué lastAccess a lastAccessed para consistencia)
    completedContentIds: string[]; // array de IDs de contenidos completados
    lastContentCompleted?: string; // ID del último contenido completado (opcional)
}

export interface ContentsByModule {
  [moduleId: string]: Content[];
}


export interface Video {
  id: string;
  title: string;
  description?: string;
  duration: string;
  url?: string;
  thumbnail?: string;
  type?: string;
  moduleTitle?: string;
}

export interface VideoDetailData {
  videoData: Video | null;
  moduleData: Module | null;
  courseData: Course | null;
  relatedVideos: Video[];
}

export interface VideoPlayerProps {
  videoData: Video;
  courseData?: Course | null;
  moduleData?: Module | null;
}

export interface RelatedVideosProps {
  relatedVideos: Video[];
  videoId?: string;
  isLoading?: boolean;
  error?: string | null;
}

export interface CourseInfoProps {
  courseData: Course | null;
}

export interface BreadcrumbNavProps {
  videoTitle?: string;
}

// === COMMENTS SYSTEM TYPES ===

// Comment types for different contexts
export type CommentType = 'opinion' | 'video' | 'general';

export interface CourseComment {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar?: string;
  content: string;
  parentId: string | null; // null for top-level comments, ID for replies
  commentType: CommentType; // Type of comment: opinion, video, or general
  contentId?: string; // ID of the video/content (only for video comments)
  contentTitle?: string; // Title of the video/content (optional for better UX)
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this comment
  isPinned: boolean; // Admins can pin important comments
  isModerated: boolean; // For content moderation
  isEdited: boolean; // Track if comment was edited
  createdAt: Timestamp;
  updatedAt: Timestamp;
  editedAt?: Timestamp;
}

export interface CreateCommentData {
  courseId: string;
  content: string;
  parentId?: string | null;
  commentType: CommentType;
  contentId?: string; // Required for video comments
  contentTitle?: string; // Optional for better UX
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentWithReplies extends CourseComment {
  replies?: CourseComment[];
  replyCount: number;
}

export interface CommentsQueryOptions {
  courseId?: string;
  parentId?: string | null;
  userId?: string;
  isPinned?: boolean;
  limit?: number;
  orderBy?: 'createdAt' | 'likes' | 'updatedAt';
  order?: 'asc' | 'desc';
}

// Form interfaces for comment operations
export interface CommentFormValues {
  content: string;
}

export interface CommentFormProps {
  courseId: string;
  parentId?: string | null;
  initialContent?: string;
  onSubmit: (values: CommentFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

// Component props interfaces
export interface CommentsListProps {
  courseId: string;
  showReplies?: boolean;
  maxComments?: number;
  allowModeration?: boolean;
}

export interface CommentItemProps {
  comment: CourseComment;
  onReply?: (parentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  onPin?: (commentId: string) => void;
  onModerate?: (commentId: string) => void;
  canModerate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  showReplies?: boolean;
  level?: number; // For nested comment depth
}

export interface CommentStatsProps {
  totalComments: number;
  totalReplies: number;
  isLoading?: boolean;
}