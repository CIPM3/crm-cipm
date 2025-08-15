import { updateItem } from "@/lib/firebaseService";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateInstructor = async (id: string, instructor: Partial<ClasePrubeaType>): Promise<{ id: string }> => {
  return await updateItem<ClasePrubeaType>(DB_COLLECCTIONS.INSTRUCTOR, id, instructor);
};