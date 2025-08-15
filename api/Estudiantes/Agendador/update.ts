import { updateItem } from "@/lib/firebaseService";
import { ClasePrubeaAgendadorType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateStudent = async (id: string, estudiante: Partial<ClasePrubeaAgendadorType>): Promise<{ id: string }> => {
  return await updateItem<ClasePrubeaAgendadorType>(DB_COLLECCTIONS.AGENDADOR, id, estudiante);
};