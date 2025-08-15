import { updateItem } from "@/lib/firebaseService";
import { FormacionDataType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateFormacionStudent = async (id: string, estudiante: Partial<FormacionDataType>): Promise<{ id: string }> => {
  return await updateItem<FormacionDataType>(DB_COLLECCTIONS.FORMACION_GRUPO, id, estudiante);
};