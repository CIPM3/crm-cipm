"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { ROLES_ARRAY } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

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

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar: string;
}

export function UserForm({ initialValues, onSubmit, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialValues?.role || "base");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      password: initialValues?.password || "",
      role: initialValues?.role || "base",
      avatar: initialValues?.avatar || "",
    },
  });

  const validateForm = (data: FormData): string | null => {
    if (!data.name || data.name.length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      return "Debe ser un correo electrónico válido.";
    }
    if (!initialValues?.id && (!data.password || data.password.length < 6)) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!data.role || !ROLES_ARRAY.includes(data.role as any)) {
      return "Rol no válido.";
    }
    return null;
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const validationError = validateForm(data);
      if (validationError) {
        toast({
          title: "Error de validación",
          description: validationError,
          variant: "destructive",
        });
        return;
      }

      // Incluir el ID si existe (para edición)
      const submitData = initialValues?.id 
        ? { ...data, id: initialValues.id }
        : data;

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error en el formulario:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el formulario.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nombre completo"
          {...register("name", { 
            required: "El nombre es requerido",
            minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" }
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          {...register("email", { 
            required: "El correo electrónico es requerido",
            pattern: { value: /\S+@\S+\.\S+/, message: "Debe ser un correo electrónico válido" }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Campo de contraseña condicional */}
      {!initialValues?.id && (
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            {...register("password", { 
              required: "La contraseña es requerida",
              minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="role">Rol</Label>
        <Select 
          value={selectedRole} 
          onValueChange={(value) => {
            setSelectedRole(value);
            setValue("role", value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {ROLES_ARRAY.map((rol) => (
              <SelectItem className="first-letter:uppercase" key={rol} value={rol}>
                {rol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="avatar">Avatar (URL)</Label>
        <Input
          id="avatar"
          type="text"
          placeholder="https://ejemplo.com/avatar.jpg"
          {...register("avatar")}
        />
        {errors.avatar && (
          <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initialValues?.id ? "Actualizar Usuario" : "Crear Usuario"}
        </Button>
      </DialogFooter>
    </form>
  );
}