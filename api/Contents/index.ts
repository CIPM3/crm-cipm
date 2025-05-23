import { Content } from "@/types/"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"

const collectionName = "Content"

export const getAllContent = () => fetchItems<Content>(collectionName)
export const getContentById = (id: string) => fetchItem<Content>(collectionName, id)
export const createContent = (data: Omit<Content, 'id'>) => addItem<Content>(collectionName, data)
export const updateContent = (id: string, data: Partial<Content>) => updateItem<Content>(collectionName, id, data)
export const deleteContent = (id: string) => deleteItem(collectionName, id)
