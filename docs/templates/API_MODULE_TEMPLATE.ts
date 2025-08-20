// Template for creating new API modules
// Copy this file and replace [Feature] placeholders with your feature name

import { 
  fetchItems, 
  fetchItem, 
  addItem, 
  updateItem, 
  deleteItem,
  fetchItemsPaginated,
  type QueryOptions,
  type PaginatedResult 
} from '@/lib/firebaseService'
import { [Feature]DataType } from '@/types'

// === COLLECTION CONFIGURATION ===
const COLLECTION_NAME = '[COLLECTION_NAME]' // e.g., 'cursos', 'usuarios'

// === BASIC CRUD OPERATIONS ===

// Get all items with optional filtering
export const getAll[Feature]s = (options?: QueryOptions) => 
  fetchItems<[Feature]DataType>(COLLECTION_NAME, options)

// Get single item by ID
export const get[Feature]ById = (id: string) => 
  fetchItem<[Feature]DataType>(COLLECTION_NAME, id)

// Create new item
export const create[Feature] = (data: Omit<[Feature]DataType, 'id'>) => 
  addItem(COLLECTION_NAME, data)

// Update existing item
export const update[Feature] = (id: string, data: Partial<[Feature]DataType>) => 
  updateItem(COLLECTION_NAME, id, data)

// Delete item
export const delete[Feature] = (id: string) => 
  deleteItem(COLLECTION_NAME, id)

// === ADVANCED QUERIES ===

// Get active/published items
export const getActive[Feature]s = () => 
  fetchItems<[Feature]DataType>(COLLECTION_NAME, {
    where: [{ field: 'status', operator: '==', value: 'active' }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

// Search by name/title
export const search[Feature]s = (searchTerm: string) => 
  fetchItems<[Feature]DataType>(COLLECTION_NAME, {
    where: [
      { field: 'name', operator: '>=', value: searchTerm },
      { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
    ],
    orderBy: [{ field: 'name', direction: 'asc' }],
    limit: 20
  })

// Get items with pagination
export const get[Feature]sPage = (pageSize: number = 10, cursor?: any): Promise<PaginatedResult<[Feature]DataType>> =>
  fetchItemsPaginated<[Feature]DataType>(COLLECTION_NAME, {
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit: pageSize,
    ...(cursor && { startAfter: cursor })
  })

// === COMPLEX FILTERING EXAMPLE ===
export const getFiltered[Feature]s = async (filters: {
  status?: string;
  category?: string;
  dateRange?: { start: Date; end: Date };
  createdBy?: string;
}) => {
  const whereConditions: Array<{ field: string; operator: any; value: any }> = []
  
  if (filters.status) {
    whereConditions.push({ field: 'status', operator: '==', value: filters.status })
  }
  
  if (filters.category) {
    whereConditions.push({ field: 'category', operator: '==', value: filters.category })
  }
  
  if (filters.createdBy) {
    whereConditions.push({ field: 'createdBy', operator: '==', value: filters.createdBy })
  }
  
  if (filters.dateRange) {
    whereConditions.push(
      { field: 'createdAt', operator: '>=', value: filters.dateRange.start },
      { field: 'createdAt', operator: '<=', value: filters.dateRange.end }
    )
  }

  return fetchItems<[Feature]DataType>(COLLECTION_NAME, {
    where: whereConditions,
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit: 100
  })
}

// === BATCH OPERATIONS ===
export const batchCreate[Feature]s = async (items: Omit<[Feature]DataType, 'id'>[]) => {
  const results = await Promise.all(
    items.map(item => create[Feature](item))
  )
  return results
}

export const batchUpdate[Feature]s = async (updates: { id: string; data: Partial<[Feature]DataType> }[]) => {
  const results = await Promise.all(
    updates.map(({ id, data }) => update[Feature](id, data))
  )
  return results
}

// === RELATIONSHIP QUERIES ===
// Example: Get features related to a specific user
export const get[Feature]sByUser = (userId: string) =>
  fetchItems<[Feature]DataType>(COLLECTION_NAME, {
    where: [{ field: 'userId', operator: '==', value: userId }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

// Example: Get features by multiple IDs
export const get[Feature]sByIds = (ids: string[]) =>
  fetchItems<[Feature]DataType>(COLLECTION_NAME, {
    where: [{ field: 'id', operator: 'in', value: ids }]
  })

/* 
USAGE EXAMPLES:

// Basic usage
const features = await getAll[Feature]s()
const feature = await get[Feature]ById('feature-id')
const newFeature = await create[Feature]({ name: 'New Feature', status: 'active' })

// Advanced filtering
const filteredFeatures = await getFiltered[Feature]s({
  status: 'active',
  category: 'education',
  dateRange: { start: new Date('2024-01-01'), end: new Date() }
})

// Pagination
const firstPage = await get[Feature]sPage(10)
const secondPage = await get[Feature]sPage(10, firstPage.nextPageCursor)

// Search
const searchResults = await search[Feature]s('typescript')

*/