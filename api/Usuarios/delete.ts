import { deleteItem } from "@/lib/firebaseService";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const deleteUser = async (userId: string): Promise<{ id: string }> => {
  return await deleteItem(DB_COLLECCTIONS.USUARIOS, userId);
};