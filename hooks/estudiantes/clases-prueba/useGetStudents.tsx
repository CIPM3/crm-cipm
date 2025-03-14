import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/api/Estudiantes/clase-prueba/get";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const useGetStudents = () => {
  return useQuery<ClasePrubeaType[], Error>({
    queryKey: [DB_COLLECCTIONS.CLASE_PRUEBA],
    queryFn: getAllStudents,
  });
};