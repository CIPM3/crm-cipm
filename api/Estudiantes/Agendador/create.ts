import { setItem } from "@/lib/firebaseService";
import { ClasePrubeaAgendadorType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";
import { v4 as uuidv4 } from 'uuid';

export const createStudent = async (estudiante: ClasePrubeaAgendadorType): Promise<ClasePrubeaAgendadorType> => {
  const id = estudiante.id || uuidv4();
  const studentData = { ...estudiante, id };
  
  await setItem<ClasePrubeaAgendadorType>(DB_COLLECCTIONS.AGENDADOR, id, studentData);
  return studentData;
};