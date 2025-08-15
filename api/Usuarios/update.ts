import { updateItem, fetchItem } from "@/lib/firebaseService";
import { UpdateUserData, UsersType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateUser = async ({ id, ...userData }: UpdateUserData): Promise<UsersType> => {
  await updateItem<UsersType>(DB_COLLECCTIONS.USUARIOS, id, userData);
  return await fetchItem<UsersType>(DB_COLLECCTIONS.USUARIOS, id);
};