import { Enrollment } from "@/types"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

const collectionName = "Enrollments"

export const getAllEnrollments = () => fetchItems<Enrollment>(collectionName)
export const getEnrollmentById = (id: string) => fetchItem<Enrollment>(collectionName, id)
export const createEnrollment = (data: Omit<Enrollment, 'id'>) => addItem<Enrollment>(collectionName, data)
export const updateEnrollment = (id: string, data: Partial<Enrollment>) => updateItem<Enrollment>(collectionName, id, data)

export const updateEnrollmentByStudentAndCourse = async (
  studentId: string, 
  courseId: string, 
  data: Partial<Enrollment>
): Promise<void> => {
  const q = query(
    collection(db, collectionName),
    where("studentId", "==", studentId),
    where("courseId", "==", courseId)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error(`No enrollment found for studentId: ${studentId} and courseId: ${courseId}`);
  }
  
  // Asumimos que solo hay un enrollment por studentId + courseId
  const enrollmentDoc = querySnapshot.docs[0];
  await updateItem<Enrollment>(collectionName, enrollmentDoc.id, data);
}

export const deleteEnrollment = (id: string) => deleteItem(collectionName, id)
export const getEnrollmentsByCourseId = async (courseId: string): Promise<Enrollment[]> => {
  const q = query(
    collection(db, collectionName),
    where("courseId", "==", courseId)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Enrollment[]
}

export const getEnrollmentsByStudentId = async (studentId: string): Promise<Enrollment[]> => {
  const q = query(
    collection(db, collectionName),
    where("studentId", "==", studentId)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Enrollment[]
}