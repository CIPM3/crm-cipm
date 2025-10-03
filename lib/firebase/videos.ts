// lib/firebase/videos.ts
import { VideoType as VideoDataType } from '@/types'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from './base'
import { getAllContent, isMigrationDataEnabled } from '../migration-data'

// ===== VIDEOS =====
export const getAllVideos = async () => {
  const firebaseVideos = await fetchItems<VideoDataType>('videos')

  if (isMigrationDataEnabled()) {
    return await getAllContent(firebaseVideos)
  }

  return firebaseVideos
}

export const getVideoById = (id: string) => fetchItem<VideoDataType>('videos', id)
export const createVideo = (data: Omit<VideoDataType, 'id'>) => addItem('videos', data)
export const updateVideo = (id: string, data: Partial<VideoDataType>) => updateItem('videos', id, data)
export const deleteVideo = (id: string) => deleteItem('videos', id)