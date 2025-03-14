import { useMutation } from "@tanstack/react-query";
import { deleteStudent } from "@/api/Estudiantes/clase-prueba/delete";

export const useDeleteStudent = () => {
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteStudent(id),
    onSuccess: () => {
      console.log("Estudiante eliminado con éxito");
    },
    onError: (error) => {
      console.error("Error al eliminar estudiante:", error);
    },
  });
};