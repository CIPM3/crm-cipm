import { Course } from "@/types"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"

const collectionName = "Cursos"

export const getAllCourses = () => fetchItems<Course>(collectionName)
export const getCourseById = (id: string) => fetchItem<Course>(collectionName, id)
export const createCourse = (data: Omit<Course, 'id'>) => addItem<Course>(collectionName, data)
export const updateCourse = (id: string, data: Partial<Course>) => updateItem<Course>(collectionName, id, data)
export const deleteCourse = (id: string) => deleteItem(collectionName, id)
