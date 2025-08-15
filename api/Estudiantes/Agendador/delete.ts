import { deleteItem } from "@/lib/firebaseService";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const deleteStudent = async (id: string): Promise<{ id: string }> => {
    return await deleteItem(DB_COLLECCTIONS.AGENDADOR, id);
};