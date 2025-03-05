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
    id?:string;
    value:string;
    name:string;
}

export interface VideoType {
    moduleId: string;
    moduleTitle: string;
    courseId: string;
    courseName: string;
    id: string;
    type: string;
    title: string;
    duration: string;
    url: string;
    questions?: undefined;
}