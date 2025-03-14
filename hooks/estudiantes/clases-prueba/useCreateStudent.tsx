import { createStudent } from "@/api/Estudiantes/clase-prueba/create";
import { ClasePrubeaType } from "@/types";
import { useMutation } from "@tanstack/react-query";

// Hook para usar la mutación de registro
export const useCreateStudent = () => {
    return useMutation<ClasePrubeaType, Error, ClasePrubeaType>({
        mutationFn: createStudent, // Pasar la función de mutación aquí
        onSuccess: (user) => {
            console.log("Usuario registrado con éxito:", user);
        },
        onError: (error) => {
            console.error("Error al registrar usuario:", error);
        },
    });
};