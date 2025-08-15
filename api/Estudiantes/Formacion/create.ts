import { setItem } from "@/lib/firebaseService";
import { FormacionDataType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";
import { v4 as uuidv4 } from 'uuid';

export const createFormacionStudent = async (estudiante: FormacionDataType): Promise<FormacionDataType> => {
  const id = estudiante.id || uuidv4();
  const studentData = { ...estudiante, id };
  
  await setItem<FormacionDataType>(DB_COLLECCTIONS.FORMACION_GRUPO, id, studentData);
  return studentData;
};