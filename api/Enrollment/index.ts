import { Enrollment } from "@/types"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

const collectionName = "Enrollments"

export const getAllEnrollments = () => fetchItems<Enrollment>(collectionName)
export const getEnrollmentById = (id: string) => fetchItem<Enrollment>(collectionName, id)
export const createEnrollment = (data: Omit<Enrollment, 'id'>) => addItem<Enrollment>(collectionName, data)
export const updateEnrollment = (id: string, data: Partial<Enrollment>) => updateItem<Enrollment>(collectionName, id, data)
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