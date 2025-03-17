import { Timestamp } from 'firebase/firestore';
import { ROLES } from '../lib/constants';
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
    moduleId: string;
    moduleTitle: string;
    courseId: string;
    courseName: string;
    moduleStatus: string;
    id: string;
    type: string;
    title: string;
    duration: string;
    url: string;
    questions?: undefined;
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
    role: typeof ROLES[number];
    avatar: string;
    createdAt?: string;
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

export interface AgendadoFormProps {
    initialValues?: AgendadoFormValues;
    onSubmit: (values: AgendadoFormValues) => void;
    onCancel: () => void;
    IsLoading?: boolean;
}

export interface ClasePrubeaType {
    id?: string;
    nombreAlumno: string;
    numero: string;
    dia: string;
    horario: string;
    observaciones: string;
    fecha: Timestamp;
    maestro: string | undefined;
    nivel: string;
    subNivel: string;
}

export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role: typeof ROLES[number]; // Agregar el campo "role"
}

export interface UpdateUserData {
    id: string; // ID del usuario a actualizar
    name?: string;
    email?: string;
    role?: typeof ROLES[number];
    avatar?: string;
}

export interface RefetchState {
    shouldRefetch: boolean;
    triggerRefetch: () => void;
    resetRefetch: () => void;
  }