import { setItem } from "@/lib/firebaseService";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";
import { v4 as uuidv4 } from 'uuid';

export const createInstructor = async (instructor: ClasePrubeaType): Promise<ClasePrubeaType> => {
  const id = instructor.id || uuidv4();
  const instructorData = { ...instructor, id };
  
  await setItem<ClasePrubeaType>(DB_COLLECCTIONS.INSTRUCTOR, id, instructorData);
  return instructorData;
};