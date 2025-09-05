import { fetchItems, fetchItem, addItem, updateItem, deleteItem, setItem } from './base/firebase-base'
import { CreateVideoForm, VideoType } from '@/types'
import { COLLECTIONS } from '@/lib/constants'
import { v4 as uuidv4 } from 'uuid'

// === VIDEO OPERATIONS ===

export const getAllVideos = () => 
  fetchItems<CreateVideoForm>(COLLECTIONS.VIDEOS)

export const getVideoById = (id: string) => 
  fetchItem<CreateVideoForm>(COLLECTIONS.VIDEOS, id)

export const createVideo = (data: Omit<CreateVideoForm, 'id'>) => 
  addItem<CreateVideoForm>(COLLECTIONS.VIDEOS, data)

export const createVideoWithId = (id: string, data: Omit<CreateVideoForm, 'id'>) => 
  setItem<CreateVideoForm>(COLLECTIONS.VIDEOS, id, data)

export const updateVideo = (id: string, data: Partial<CreateVideoForm>) => 
  updateItem<CreateVideoForm>(COLLECTIONS.VIDEOS, id, data)

export const deleteVideo = (id: string) => 
  deleteItem(COLLECTIONS.VIDEOS, id)

// === VIDEO QUERY OPERATIONS ===

export const getVideosByTag = (tag: string) =>
  fetchItems<CreateVideoForm>(COLLECTIONS.VIDEOS, {
    where: [{ field: 'tags', operator: 'array-contains', value: tag }]
  })

export const getFeaturedVideos = () =>
  fetchItems<CreateVideoForm>(COLLECTIONS.VIDEOS, {
    where: [{ field: 'featured', operator: '==', value: true }]
  })

export const searchVideos = (searchTerm: string) =>
  fetchItems<CreateVideoForm>(COLLECTIONS.VIDEOS, {
    where: [
      { field: 'title', operator: '>=', value: searchTerm },
      { field: 'title', operator: '<=', value: searchTerm + '\uf8ff' }
    ]
  })

export const getVideosByDuration = (minDuration: string, maxDuration: string) =>
  fetchItems<CreateVideoForm>(COLLECTIONS.VIDEOS, {
    where: [
      { field: 'duration', operator: '>=', value: minDuration },
      { field: 'duration', operator: '<=', value: maxDuration }
    ]
  })

// === VIDEO UTILITIES ===

export const formatVideoDuration = (duration: string): string => {
  // Expected format: "mm:ss" or "hh:mm:ss"
  return duration || '00:00'
}

export const parseVideoDuration = (duration: string): number => {
  // Convert duration string to seconds for calculations
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }
  return 0
}

export const getVideoThumbnail = (video: CreateVideoForm): string => {
  return video.thumbnail || '/default-video-thumbnail.jpg'
}

export const isVideoFeatured = (video: CreateVideoForm): boolean => {
  return video.featured === true
}

export const getVideoTags = (video: CreateVideoForm): string[] => {
  if (!video.tags) return []
  return video.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
}

export const setVideoTags = (tags: string[]): string => {
  return tags.join(', ')
}