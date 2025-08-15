import { fetchItems } from "@/lib/firebaseService";
import { ClasePrubeaAgendadorType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const getAllStudents = async (): Promise<ClasePrubeaAgendadorType[]> => {
    return await fetchItems<ClasePrubeaAgendadorType>(DB_COLLECCTIONS.AGENDADOR);
};