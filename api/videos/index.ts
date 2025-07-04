import { CreateVideoForm } from "@/types"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"

const collectionName = "Videos"

export const getAllVideos = () => fetchItems<CreateVideoForm>(collectionName)
export const getVideoById = (id: string) => fetchItem<CreateVideoForm>(collectionName, id)
export const createVideo = (data: Omit<CreateVideoForm, 'id'>) => addItem<CreateVideoForm>(collectionName, data)
export const updateVideo = (id: string, data: Partial<CreateVideoForm>) => updateItem<CreateVideoForm>(collectionName, id, data)
export const deleteVideo = (id: string) => deleteItem(collectionName, id)
