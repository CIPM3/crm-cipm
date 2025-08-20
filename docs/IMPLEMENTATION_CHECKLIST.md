# Development Implementation Checklist

A step-by-step checklist for implementing new features following the CRM system's development guidelines.

## Table of Contents

- [1. Pre-Development Setup](#1-pre-development-setup)
- [2. API Layer Implementation](#2-api-layer-implementation)
- [3. Type Definitions](#3-type-definitions)
- [4. Query Key Management](#4-query-key-management)
- [5. Hook Implementation](#5-hook-implementation)
- [6. Component Development](#6-component-development)
- [7. Form Implementation](#7-form-implementation)
- [8. Page Integration](#8-page-integration)
- [9. Testing Implementation](#9-testing-implementation)
- [10. Final Review](#10-final-review)

---

## 1. Pre-Development Setup

### Feature Planning Checklist

- [ ] **Feature Name Defined**: Choose consistent naming (e.g., `Curso`, `Video`, `Usuario`)
- [ ] **Collection Name**: Add to `/lib/constants.ts` in `FIREBASE_COLLECTIONS`
- [ ] **Data Model**: Design the data structure and relationships
- [ ] **User Roles**: Identify which roles can perform which actions
- [ ] **UI/UX Requirements**: Define the user interface requirements
- [ ] **Performance Needs**: Consider caching strategy and optimization needs

### Directory Structure Setup

- [ ] **Create API Directory**: `/api/[FeatureName]/index.ts`
- [ ] **Create Hook Directory**: `/hooks/queries/use[FeatureName]s.ts`
- [ ] **Create Component Directory**: `/components/[featurename]/`
- [ ] **Create Test Directory**: `__tests__/[featurename]/`
- [ ] **Create Page Directory** (if needed): `/app/admin/[featurename]s/`

---

## 2. API Layer Implementation

### Firebase Service Integration

- [ ] **Import Centralized Service**: Use `/lib/firebaseService.ts` functions
- [ ] **Collection Constant**: Use constant from `/lib/constants.ts`
- [ ] **Basic CRUD Operations**: Implement all required operations
- [ ] **Advanced Queries**: Add filtering and search capabilities
- [ ] **Pagination Support**: Implement if needed for large datasets
- [ ] **Type Safety**: Use proper TypeScript types for all operations

### API Implementation Template

```typescript
// ✅ Checklist Item: Basic CRUD Operations
export const getAll[FeatureName]s = () => fetchItems<[FeatureName]DataType>(COLLECTION_NAME)
export const get[FeatureName]ById = (id: string) => fetchItem<[FeatureName]DataType>(COLLECTION_NAME, id)
export const create[FeatureName] = (data: Omit<[FeatureName]DataType, 'id'>) => addItem(COLLECTION_NAME, data)
export const update[FeatureName] = (id: string, data: Partial<[FeatureName]DataType>) => updateItem(COLLECTION_NAME, id, data)
export const delete[FeatureName] = (id: string) => deleteItem(COLLECTION_NAME, id)

// ✅ Checklist Item: Advanced Queries
export const getActive[FeatureName]s = () => fetchItems<[FeatureName]DataType>(COLLECTION_NAME, {
  where: [{ field: 'status', operator: '==', value: 'active' }],
  orderBy: [{ field: 'createdAt', direction: 'desc' }]
})
```

### API Validation

- [ ] **Input Validation**: Validate all input parameters
- [ ] **Error Handling**: Properly handle and throw appropriate errors
- [ ] **Documentation**: Add JSDoc comments for all functions
- [ ] **Testing**: Write unit tests for all API functions

---

## 3. Type Definitions

### Type Definition Checklist

- [ ] **Add to `/types/index.ts`**: Centralize all type definitions
- [ ] **Base Entity Interface**: Include common fields (id, createdAt, updatedAt)
- [ ] **Form Data Types**: Create form-specific types
- [ ] **Component Prop Types**: Define component interface types
- [ ] **API Response Types**: Define response structure types
- [ ] **Validation Schema**: Create Zod/Yup validation schemas

### Type Implementation Template

```typescript
// ✅ Checklist Item: Base Entity Interface
export interface [FeatureName]DataType {
  id?: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt?: string
}

// ✅ Checklist Item: Form Data Types
export interface Create[FeatureName]FormData {
  name: string
  description?: string
  status: 'active' | 'inactive'
}

// ✅ Checklist Item: Component Prop Types
export interface [FeatureName]CardProps {
  [featurename]: [FeatureName]DataType & { id: string }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  variant?: 'default' | 'compact'
}

// ✅ Checklist Item: Validation Schema
export const [FeatureName]Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})
```

### Type Validation

- [ ] **Type Exports**: Ensure all types are properly exported
- [ ] **Import Usage**: Verify types are imported correctly in other files
- [ ] **Validation Schema**: Test schema validation with sample data
- [ ] **Type Coverage**: Ensure TypeScript strict mode passes

---

## 4. Query Key Management

### Query Keys Implementation

- [ ] **Add to `/lib/queryKeys.ts`**: Add hierarchical query keys
- [ ] **List Keys**: Create keys for list queries with filters
- [ ] **Detail Keys**: Create keys for individual item queries
- [ ] **Related Keys**: Add keys for related data queries
- [ ] **Invalidation Keys**: Add to `getInvalidationKeys` object

### Query Keys Template

```typescript
// ✅ Checklist Item: Hierarchical Query Keys
[featurename]s: (filters?: FilterType) => [
  ...queryKeys.all,
  '[featurename]s',
  ...(filters ? [filters] : [])
] as const,
[featurename]: (id: string) => [...queryKeys.[featurename]s(), 'detail', id] as const,
[featurename]Analytics: (id: string) => [...queryKeys.[featurename](id), 'analytics'] as const,

// ✅ Checklist Item: Invalidation Keys
on[FeatureName]Create: () => [
  queryKeys.[featurename]sList(),
  queryKeys.analyticsOverview(),
],
on[FeatureName]Update: (id: string) => [
  queryKeys.[featurename](id),
  queryKeys.[featurename]sList(),
  queryKeys.[featurename]Analytics(id),
],
```

### Query Keys Validation

- [ ] **Key Hierarchy**: Ensure proper parent-child relationships
- [ ] **Filter Support**: Test keys with different filter combinations
- [ ] **Invalidation Logic**: Verify invalidation patterns work correctly
- [ ] **Performance**: Check for unnecessary invalidations

---

## 5. Hook Implementation

### Hook Development Checklist

- [ ] **Query Hooks**: Implement list and detail query hooks
- [ ] **Mutation Hooks**: Implement create, update, delete mutation hooks
- [ ] **Optimistic Updates**: Add optimistic updates where appropriate
- [ ] **Error Handling**: Use `useServerOptimizedQuery/Mutation`
- [ ] **Performance**: Add memoization and filtering
- [ ] **Utility Hooks**: Add bulk operations if needed

### Hook Implementation Template

```typescript
// ✅ Checklist Item: Query Hooks
export const useGet[FeatureName]s = (filters?: FilterType) => {
  const memoizedFilters = useMemo(() => filters, [/* dependencies */])

  return useServerOptimizedQuery({
    queryKey: queryKeys.[featurename]sList(memoizedFilters),
    queryFn: async () => {
      const data = await getAll[FeatureName]s()
      // Apply client-side filtering if needed
      return filterData(data, memoizedFilters)
    },
    staleTime: 10 * 60 * 1000,
    select: useCallback((data) => {
      return data.map(item => ({
        ...item,
        // Add computed properties
      }))
    }, [])
  })
}

// ✅ Checklist Item: Mutation Hooks
export const useCreate[FeatureName] = () => {
  return useServerOptimizedMutation({
    mutationFn: async (data) => {
      // Input validation
      if (!data.name?.trim()) {
        throw new Error('Name is required')
      }
      return await create[FeatureName](data)
    },
    invalidateQueries: getInvalidationKeys.on[FeatureName]Create(),
    optimisticUpdate: {
      queryKey: queryKeys.[featurename]sList(),
      updater: (oldData, variables) => {
        // Optimistic update logic
      }
    }
  })
}
```

### Hook Validation

- [ ] **Return Signature**: Follow standard `{ data, loading, error }` pattern
- [ ] **Input Validation**: Validate all inputs before API calls
- [ ] **Cache Invalidation**: Test that cache invalidation works correctly
- [ ] **Error States**: Test error handling and user feedback
- [ ] **Loading States**: Verify loading states work properly

---

## 6. Component Development

### Component Structure Checklist

- [ ] **Card Component**: Create item display component
- [ ] **List Component**: Create list/grid display component
- [ ] **Loading States**: Implement skeleton loading components
- [ ] **Error States**: Create error display components
- [ ] **Empty States**: Create empty state components
- [ ] **Responsive Design**: Ensure mobile-first responsive design

### Component Implementation Template

```typescript
// ✅ Checklist Item: Card Component
export function [FeatureName]Card({ [featurename], onEdit, onDelete, onView }: [FeatureName]CardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{[featurename].name}</CardTitle>
          <DropdownMenu>
            {/* Actions menu */}
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">
          {[featurename].description}
        </p>
      </CardContent>
    </Card>
  )
}

// ✅ Checklist Item: List Component
export function [FeatureName]List({ [featurename]s, loading, error, ...handlers }: [FeatureName]ListProps) {
  if (loading) return <[FeatureName]ListSkeleton />
  if (error) return <ErrorState error={error} />
  if (![featurename]s.length) return <EmptyState />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[featurename]s.map([featurename] => (
        <[FeatureName]Card key={[featurename].id} [featurename]={[featurename]} {...handlers} />
      ))}
    </div>
  )
}
```

### Component Validation

- [ ] **Accessibility**: Test with screen readers and keyboard navigation
- [ ] **Responsive Design**: Test on different screen sizes
- [ ] **Loading States**: Verify all loading states display correctly
- [ ] **Error Handling**: Test error state displays
- [ ] **Performance**: Check for unnecessary re-renders
- [ ] **Props Validation**: Ensure all props are properly typed

---

## 7. Form Implementation

### Form Development Checklist

- [ ] **Validation Schema**: Define Zod/Yup validation schema
- [ ] **Form Component**: Create form with React Hook Form
- [ ] **Field Components**: Implement all required form fields
- [ ] **Validation Messages**: Add user-friendly validation messages
- [ ] **Loading States**: Handle form submission loading
- [ ] **Error Handling**: Display form submission errors
- [ ] **Auto-save**: Implement draft saving if needed

### Form Implementation Template

```typescript
// ✅ Checklist Item: Validation Schema
const [featurename]Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

// ✅ Checklist Item: Form Component
export function [FeatureName]Form({ initialData, onSubmit, onCancel, isLoading }: [FeatureName]FormProps) {
  const form = useForm<[FeatureName]FormData>({
    resolver: zodResolver([featurename]Schema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'active',
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

### Form Validation

- [ ] **Field Validation**: Test all form field validations
- [ ] **Submission Handling**: Verify form submission works
- [ ] **Error Display**: Check validation error messages display
- [ ] **Loading State**: Test form loading and disabled states
- [ ] **Reset Functionality**: Verify form reset works correctly
- [ ] **Accessibility**: Test form accessibility features

---

## 8. Page Integration

### Page Development Checklist

- [ ] **Admin Page**: Create page in `/app/admin/[featurename]s/`
- [ ] **Metadata**: Add proper page metadata
- [ ] **Manager Component**: Create comprehensive management component
- [ ] **Dialog Integration**: Add create/edit/delete dialogs
- [ ] **Filters**: Implement filtering and search functionality
- [ ] **Stats Display**: Add statistics cards if applicable
- [ ] **Navigation**: Update navigation menus

### Page Implementation Template

```typescript
// ✅ Checklist Item: Admin Page
export const metadata: Metadata = {
  title: '[FeatureName] Management | CRM System',
  description: 'Manage [featurename]s in the CRM system',
}

export default function [FeatureName]sPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">[FeatureName] Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage [featurename]s.
          </p>
        </div>
      </div>
      <[FeatureName]Manager />
    </div>
  )
}

// ✅ Checklist Item: Manager Component
export function [FeatureName]Manager() {
  const [filters, setFilters] = useState<FilterState>({})
  const { data, isLoading, error, refetch } = useGet[FeatureName]s(filters)
  
  return (
    <div className="space-y-6">
      {/* Stats cards, filters, list, dialogs */}
    </div>
  )
}
```

### Page Validation

- [ ] **Page Loading**: Verify page loads correctly
- [ ] **Navigation**: Check navigation links work
- [ ] **Metadata**: Verify SEO metadata is correct
- [ ] **Responsive**: Test page on different devices
- [ ] **Permissions**: Test role-based access control
- [ ] **Performance**: Check page load performance

---

## 9. Testing Implementation

### Testing Checklist

- [ ] **Component Tests**: Write tests for all components
- [ ] **Hook Tests**: Write tests for all custom hooks
- [ ] **API Tests**: Write tests for API functions
- [ ] **Integration Tests**: Test component integration
- [ ] **Form Tests**: Test form validation and submission
- [ ] **Error Tests**: Test error handling scenarios

### Testing Template

```typescript
// ✅ Checklist Item: Component Tests
describe('[FeatureName]Card', () => {
  const mockItem = {
    id: '1',
    name: 'Test [FeatureName]',
    status: 'active'
  }

  it('renders [featurename] information correctly', () => {
    render(<[FeatureName]Card [featurename]={mockItem} />)
    expect(screen.getByText(mockItem.name)).toBeInTheDocument()
  })

  it('calls onEdit when edit is clicked', () => {
    const onEdit = jest.fn()
    render(<[FeatureName]Card [featurename]={mockItem} onEdit={onEdit} />)
    // Test edit functionality
  })
})

// ✅ Checklist Item: Hook Tests
describe('use[FeatureName]s hooks', () => {
  it('fetches [featurename]s successfully', async () => {
    const { result } = renderHook(() => useGet[FeatureName]s(), {
      wrapper: createQueryWrapper(),
    })
    // Test hook functionality
  })
})
```

### Testing Validation

- [ ] **Test Coverage**: Ensure adequate test coverage
- [ ] **Test Reliability**: Tests pass consistently
- [ ] **Error Scenarios**: Test error conditions
- [ ] **Edge Cases**: Test boundary conditions
- [ ] **User Interactions**: Test user workflows
- [ ] **Performance**: Test with large datasets

---

## 10. Final Review

### Code Quality Checklist

- [ ] **Linting**: Run `npm run lint` and fix all issues
- [ ] **Type Checking**: Run `npm run type-check` and fix errors
- [ ] **Testing**: Run `npm run test` and ensure all tests pass
- [ ] **Build**: Run `npm run build` and verify successful build
- [ ] **Manual Testing**: Test all functionality manually
- [ ] **Performance**: Check performance with browser dev tools

### Documentation Checklist

- [ ] **API Documentation**: Document all API functions
- [ ] **Component Documentation**: Add JSDoc to components
- [ ] **Hook Documentation**: Document custom hooks
- [ ] **README Updates**: Update relevant documentation
- [ ] **Migration Guide**: Create migration guide if needed
- [ ] **Changelog**: Update changelog with new features

### Security Checklist

- [ ] **Input Validation**: Validate all user inputs
- [ ] **Authorization**: Check user permissions
- [ ] **Data Sanitization**: Sanitize data before storage
- [ ] **Error Messages**: Don't expose sensitive information
- [ ] **Audit Logging**: Log important actions
- [ ] **Security Testing**: Test for common vulnerabilities

### Performance Checklist

- [ ] **Bundle Size**: Check impact on bundle size
- [ ] **Loading Performance**: Optimize loading times
- [ ] **Runtime Performance**: Check for performance bottlenecks
- [ ] **Memory Usage**: Monitor memory consumption
- [ ] **Caching Strategy**: Implement appropriate caching
- [ ] **Mobile Performance**: Test on mobile devices

### Deployment Checklist

- [ ] **Environment Variables**: Update environment variables if needed
- [ ] **Database Migration**: Create migration scripts if needed
- [ ] **Feature Flags**: Implement feature flags if needed
- [ ] **Rollback Plan**: Prepare rollback strategy
- [ ] **Monitoring**: Set up monitoring for new features
- [ ] **Documentation**: Update deployment documentation

---

## Quick Start Commands

```bash
# Development
npm run dev                 # Start development server
npm run dev:turbo          # Start with Turbo mode

# Code Quality
npm run lint               # Run linting
npm run lint:fix           # Fix linting issues
npm run type-check         # Check TypeScript
npm run format             # Format code

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run with coverage

# Build
npm run build              # Build for production
npm run build:analyze      # Build with analysis
```

---

## Pre-Commit Checklist

Before committing your changes:

- [ ] All linting issues fixed (`npm run lint:fix`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] All tests pass (`npm run test`)
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Code reviewed by peer (if required)

---

## Example Implementation Timeline

1. **Day 1**: API Layer + Types (Steps 1-3)
2. **Day 2**: Query Keys + Hooks (Steps 4-5)
3. **Day 3**: Components (Step 6)
4. **Day 4**: Forms + Dialogs (Step 7)
5. **Day 5**: Pages + Integration (Step 8)
6. **Day 6**: Testing (Step 9)
7. **Day 7**: Review + Polish (Step 10)

This checklist ensures consistent, high-quality implementation following all the development guidelines established for the CRM system.