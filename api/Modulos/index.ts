import { Module } from "@/types/"
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from "@/lib/firebaseService"

const collectionName = "Modulos"

export const getAllModules = () => fetchItems<Module>(collectionName)
export const getModuleById = (id: string) => fetchItem<Module>(collectionName, id)
export const createModule = (data: Omit<Module, 'id'>) => addItem<Module>(collectionName, data)
export const updateModule = (id: string, data: Partial<Module>) => updateItem<Module>(collectionName, id, data)
export const deleteModule = (id: string) => deleteItem(collectionName, id)
