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
    role: string;
    avatar: string;
    createdAt:string;
}