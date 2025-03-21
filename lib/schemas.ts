// lib/schemas.ts
import * as Yup from "yup";
import { ROLES } from "@/lib/constants";

// Esquema de validación para la creación de usuarios
export const userFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .required("El nombre es requerido."),
  email: Yup.string()
    .email("Debe ser un correo electrónico válido.")
    .required("El correo electrónico es requerido."),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .required("La contraseña es requerida."),
  role: Yup.string()
    .oneOf(ROLES, "Rol no válido.")
    .required("El rol es requerido."),
  avatar: Yup.string(),
});

// Esquema de validación para la actualización de usuarios
export const userFormUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .required("El nombre es requerido."),
  email: Yup.string()
    .email("Debe ser un correo electrónico válido.")
    .required("El correo electrónico es requerido."),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .optional(), // Hacer el campo opcional
  role: Yup.string()
    .oneOf(ROLES, "Rol no válido.")
    .required("El rol es requerido."),
  avatar: Yup.string(),
});

export const agendadoSchema = Yup.object().shape({
  nombreAlumno: Yup.string().required('El nombre del alumno es requerido.'),
  numero: Yup.string().required('El número de teléfono es requerido.'),
  dia: Yup.string().required('El día es requerido.'),
  horario: Yup.string().required('El horario es requerido.'),
  observaciones: Yup.string().optional(),
  fecha: Yup.string().required('La fecha es requerida.'),
  maestro: Yup.string().required('El nombre del maestro es requerido.'),
  nivel: Yup.string().required('El nivel es requerido.'),
  subNivel: Yup.string().optional(),
});

export const agendadorSchema = Yup.object().shape({
  nombreAlumno: Yup.string().required("El nombre del alumno es obligatorio"),
  diaContacto: Yup.string().required("El día de contacto es obligatorio"),
  mesContacto: Yup.string().required("El mes de contacto es obligatorio"),
  quienAgendo: Yup.string().required("El nombre de quien agendó es obligatorio"),
  modalidad: Yup.string().optional(),
  horarioPresencial: Yup.string().optional(),
  anoSemana: Yup.string().required("El año y la semana son obligatorios"),
});