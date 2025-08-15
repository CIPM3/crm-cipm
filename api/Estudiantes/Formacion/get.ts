import { fetchItems } from "@/lib/firebaseService";
import { FormacionDataType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const getAllStudentsFormacion = async (): Promise<FormacionDataType[]> => {
    return await fetchItems<FormacionDataType>(DB_COLLECCTIONS.FORMACION_GRUPO);
};