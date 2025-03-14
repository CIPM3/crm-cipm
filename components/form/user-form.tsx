"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { userFormSchema, userFormUpdateSchema } from "@/lib/schemas";
import { ROLES } from "@/lib/constants";

interface UserFormProps {
  initialValues?: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    avatar: string;
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export function UserForm({ initialValues, onSubmit, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores por defecto para un nuevo usuario
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    role: "base",
    avatar: "",
  };

  // Seleccionar el esquema de validación basado en si initialValues está presente
  const schema = initialValues?.id ? userFormUpdateSchema : userFormSchema;

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        try {
          // Si initialValues tiene un ID, incluir el ID en los valores enviados
          if (initialValues?.id) {
            await onSubmit({ ...values, id: initialValues.id });
          } else {
            await onSubmit(values);
          }
        } finally {
          setIsSubmitting(false);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-6">
          <div>
            <label htmlFor="name">Nombre</label>
            <Field
              name="name"
              type="text"
              placeholder="Nombre completo"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="email">Correo electrónico</label>
            <Field
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          </div>

          {/* Campo de contraseña condicional */}
          {!initialValues?.id && (
            <div>
              <label htmlFor="password">Contraseña</label>
              <Field
                name="password"
                type="password"
                placeholder="Contraseña"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
          )}

          <div>
            <label htmlFor="role">Rol</label>
            <Select
              onValueChange={(value) => setFieldValue("role", value)}
              defaultValue={values.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((rol) => (
                  <SelectItem className="first-letter:uppercase" key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="avatar">Avatar (URL)</label>
            <Field
              name="avatar"
              type="text"
              placeholder="https://ejemplo.com/avatar.jpg"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="avatar" component="div" className="text-red-500 text-sm" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : initialValues?.id ? "Actualizar Usuario" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </Form>
      )}
    </Formik>
  );
}