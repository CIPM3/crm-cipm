import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "@/api/Estudiantes/clase-prueba/update";
import { ClasePrubeaType } from "@/types";

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; estudiante: Partial<ClasePrubeaType> }>({
    mutationFn: async ({ id, estudiante }: { id: string; estudiante: Partial<ClasePrubeaType> }) => await updateStudent(id, estudiante),
    onSuccess: () => {
      // Invalida y refetch la query de estudiantes para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ["getAllStudents"] });
      console.log("Estudiante actualizado correctamente");
    },
    onError: (error: Error) => {
      console.error("Error al actualizar estudiante:", error.message);
    },
  });
};