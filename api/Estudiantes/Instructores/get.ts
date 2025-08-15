import { fetchItems } from "@/lib/firebaseService";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const getAllInstructors = async (): Promise<ClasePrubeaType[]> => {
    return await fetchItems<ClasePrubeaType>(DB_COLLECCTIONS.INSTRUCTOR);
};