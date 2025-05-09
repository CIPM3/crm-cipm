import { BarChart, BookOpen, CalendarDays, FileText, LayoutDashboard, Settings, Users, Video } from "lucide-react";

export const DB_COLLECCTIONS = {
    PRUEBA: 'Prueba',
    USUARIOS: 'Usuarios',
    INSTRUCTOR: 'InstructorClasePrueba',
    AGENDADOR: 'AgendadorClasePrueba',
    FORMACION_GRUPO: 'FORMACIONClasePrueba',
    HORARIO:"HorarioInstructores"
}

export const ROLES = ["admin", "instructor", "formacion de grupo", "agendador", "base", "cliente"] as const;

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
    //   {
    //     title: "Estudiantes",
    //     href: "/admin/estudiantes",
    //     icon: Users,s
    //   },
      {
        title: "Cursos",
        href: "/admin/cursos",
        icon: BookOpen,
      },
    //   {
    //     title: "Contenido",
    //     href: "/admin/contenido",
    //     icon: FileText,
    //   },
    //   {
    //     title: "Videos",
    //     href: "/admin/videos",
    //     icon: Video,
    //   },
    //   {
    //     title: "Reportes",
    //     href: "/admin/reportes",
    //     icon: BarChart,
    //   },
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
    // {
    //     title: "Cursos",
    //     href: "/cursos",
    // },
    // {
    //     title: "Videos",
    //     href: "/videos",
    // },
    // {
    //     title: "Testimonios",
    //     href: "/#testimonios",
    // },
    // {
    //     title: "Contacto",
    //     href: "/#contacto",
    // },
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