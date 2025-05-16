import { Enrollment } from "@/types"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"

const collectionName = "Enrollments"

export const getAllEnrollments = () => fetchItems<Enrollment>(collectionName)
export const getEnrollmentById = (id: string) => fetchItem<Enrollment>(collectionName, id)
export const createEnrollment = (data: Omit<Enrollment, 'id'>) => addItem<Enrollment>(collectionName, data)
export const updateEnrollment = (id: string, data: Partial<Enrollment>) => updateItem<Enrollment>(collectionName, id, data)
export const deleteEnrollment = (id: string) => deleteItem(collectionName, id)
