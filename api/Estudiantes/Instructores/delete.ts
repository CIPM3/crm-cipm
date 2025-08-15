import { deleteItem } from "@/lib/firebaseService";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const deleteInstructor = async (id: string): Promise<{ id: string }> => {
    return await deleteItem(DB_COLLECCTIONS.INSTRUCTOR, id);
};