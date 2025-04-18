// lib/schemas.ts
import * as Yup from "yup";
import { ROLES } from "@/lib/constants";
import { Timestamp } from "firebase/firestore";

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


Yup.addMethod(Yup.mixed, 'isTimestamp', function(message) {
  return this.test('is-timestamp', message, function(value) {
    return (
      value instanceof Timestamp || 
      (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value)
    );
  });
});

export const agendadorSchemaFormacion = Yup.object().shape({
  status: Yup.string().required('Status es requerido'),
  week: Yup.string()
    .required('Semana es requerida')
    .matches(/^\d{4}$/, 'Formato de semana inválido (ej: 2415)'),
  nombre: Yup.string().required('Nombre es requerido'),
  telefono: Yup.string().required('Teléfono es requerido'),
  modalidad: Yup.string().required('Modalidad es requerida'),
  horario: Yup.string().required('Horario es requerido'),
  observaciones: Yup.string().optional(),
  fecha: Yup.mixed()
    .test('is-timestamp', 'Debe ser un Timestamp de Firebase', (value) => {
      return value instanceof Timestamp || 
             (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value);
    })
    .required('Fecha es requerida'),
  maestro: Yup.string().required('Maestro es requerido'),
  nivel: Yup.string().required('Nivel es requerido'),
  tipo: Yup.string().required('Tipo es requerido')
});

export const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('La contraseña actual es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  newPassword: Yup.string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .notOneOf([Yup.ref('currentPassword')], 'La nueva contraseña debe ser diferente a la actual'),
  confirmPassword: Yup.string()
    .required('Por favor confirma tu nueva contraseña')
    .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});