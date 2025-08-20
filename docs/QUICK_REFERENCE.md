# Quick Reference Guide

Fast reference for common development patterns in the CRM system.

## Table of Contents

- [🔥 Quick Start](#-quick-start)
- [📁 File Structure](#-file-structure)
- [🔧 Common Commands](#-common-commands)
- [📝 Code Snippets](#-code-snippets)
- [🎯 Best Practices](#-best-practices)
- [🚨 Common Mistakes](#-common-mistakes)
- [🔍 Troubleshooting](#-troubleshooting)

---

## 🔥 Quick Start

### Creating a New Feature (5-minute setup)

1. **Define the feature name**: `FeatureName` (PascalCase)
2. **Add collection constant**: In `/lib/constants.ts`
3. **Create basic structure**:

```bash
# API
touch api/FeatureName/index.ts

# Types
# Add to /types/index.ts

# Hooks
touch hooks/queries/useFeatureNames.ts

# Components
mkdir components/featurename
touch components/featurename/FeatureNameCard.tsx
touch components/featurename/FeatureNameList.tsx
touch components/featurename/FeatureNameForm.tsx

# Page
mkdir app/admin/featurenames
touch app/admin/featurenames/page.tsx
```

4. **Use templates**: Copy from `/docs/templates/COMPREHENSIVE_TEMPLATES.md`
5. **Find and replace**: `[FeatureName]` → `YourFeature`, `[featurename]` → `yourfeature`

---

## 📁 File Structure

```
├── api/[FeatureName]/index.ts         # Firebase operations
├── app/admin/[featurename]s/page.tsx  # Admin pages
├── components/[featurename]/          # Feature components
├── hooks/queries/use[FeatureName]s.ts # TanStack Query hooks
├── lib/
│   ├── constants.ts                   # Collection names
│   ├── firebaseService.ts             # Centralized Firebase
│   ├── queryKeys.ts                   # Cache keys
│   └── schemas.ts                     # Validation schemas
├── types/index.ts                     # All TypeScript types
└── __tests__/[featurename]/          # Tests
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev                 # Start dev server
npm run dev:turbo          # Faster compilation
npm run build              # Production build
npm run type-check         # TypeScript check
npm run lint:fix           # Fix linting
```

### Testing
```bash
npm run test               # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
npm run test:e2e           # End-to-end tests
```

### Database
```bash
npm run firebase:emulators # Start Firebase emulators
```

---

## 📝 Code Snippets

### API Module Template

```typescript
// api/[FeatureName]/index.ts
import { fetchItems, fetchItem, addItem, updateItem, deleteItem } from '@/lib/firebaseService'
import { [FeatureName]DataType } from '@/types'

const COLLECTION = 'collection_name'

export const getAll[FeatureName]s = () => fetchItems<[FeatureName]DataType>(COLLECTION)
export const get[FeatureName]ById = (id: string) => fetchItem<[FeatureName]DataType>(COLLECTION, id)
export const create[FeatureName] = (data: Omit<[FeatureName]DataType, 'id'>) => addItem(COLLECTION, data)
export const update[FeatureName] = (id: string, data: Partial<[FeatureName]DataType>) => updateItem(COLLECTION, id, data)
export const delete[FeatureName] = (id: string) => deleteItem(COLLECTION, id)
```

### Hook Template

```typescript
// hooks/queries/use[FeatureName]s.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { getAll[FeatureName]s, create[FeatureName] } from '@/api/[FeatureName]'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'

export const useGet[FeatureName]s = (filters?: FilterType) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.[featurename]sList(filters),
    queryFn: () => getAll[FeatureName]s(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useCreate[FeatureName] = () => {
  return useServerOptimizedMutation({
    mutationFn: create[FeatureName],
    invalidateQueries: getInvalidationKeys.on[FeatureName]Create(),
  })
}
```

### Component Template

```typescript
// components/[featurename]/[FeatureName]Card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { [FeatureName]DataType } from '@/types'

interface [FeatureName]CardProps {
  [featurename]: [FeatureName]DataType & { id: string }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function [FeatureName]Card({ [featurename], onEdit, onDelete }: [FeatureName]CardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{[featurename].name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{[featurename].description}</p>
        <div className="flex gap-2 mt-4">
          {onEdit && <Button onClick={() => onEdit([featurename].id)}>Edit</Button>}
          {onDelete && <Button variant="destructive" onClick={() => onDelete([featurename].id)}>Delete</Button>}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Form Template

```typescript
// components/[featurename]/[FeatureName]Form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface [FeatureName]FormProps {
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<FormData>
  isLoading?: boolean
}

export function [FeatureName]Form({ onSubmit, onCancel, initialData, isLoading }: [FeatureName]FormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { name: '', description: '' }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
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

### Type Definition Template

```typescript
// types/index.ts
export interface [FeatureName]DataType {
  id?: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt?: string
}

export interface Create[FeatureName]FormData {
  name: string
  description?: string
  status: 'active' | 'inactive'
}

export interface [FeatureName]CardProps {
  [featurename]: [FeatureName]DataType & { id: string }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  variant?: 'default' | 'compact'
}
```

### Query Keys Template

```typescript
// lib/queryKeys.ts
[featurename]s: (filters?: FilterType) => [
  ...queryKeys.all,
  '[featurename]s',
  ...(filters ? [filters] : [])
] as const,
[featurename]: (id: string) => [...queryKeys.[featurename]s(), 'detail', id] as const,

// Invalidation keys
on[FeatureName]Create: () => [
  queryKeys.[featurename]sList(),
  queryKeys.analyticsOverview(),
],
on[FeatureName]Update: (id: string) => [
  queryKeys.[featurename](id),
  queryKeys.[featurename]sList(),
],
```

### Page Template

```typescript
// app/admin/[featurename]s/page.tsx
import { Metadata } from 'next'
import { [FeatureName]Manager } from '@/components/[featurename]/[FeatureName]Manager'

export const metadata: Metadata = {
  title: '[FeatureName] Management | CRM',
  description: 'Manage [featurename]s in the CRM system',
}

export default function [FeatureName]sPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">[FeatureName] Management</h1>
      <[FeatureName]Manager />
    </div>
  )
}
```

---

## 🎯 Best Practices

### ✅ DO

- **Use centralized Firebase service**: Always import from `/lib/firebaseService.ts`
- **Follow naming conventions**: PascalCase for components, camelCase for functions
- **Add proper TypeScript types**: Define all types in `/types/index.ts`
- **Use TanStack Query**: For all server state management
- **Implement loading states**: Show skeletons and loading indicators
- **Handle errors gracefully**: Use error boundaries and user-friendly messages
- **Write tests**: Test components and hooks
- **Use Radix UI**: For accessible components

### ❌ DON'T

- **Direct Firebase imports**: Don't import Firebase SDK directly in components
- **Skip error handling**: Always handle loading and error states
- **Use `any` type**: Always use proper TypeScript types
- **Ignore accessibility**: Use proper ARIA labels and semantic HTML
- **Skip validation**: Always validate user inputs
- **Hardcode strings**: Use constants and i18n for text
- **Forget to invalidate cache**: Update cache after mutations

---

## 🚨 Common Mistakes

### 1. Import Issues

```typescript
// ❌ Wrong
import { collection, getDocs } from 'firebase/firestore'

// ✅ Correct
import { getAllCursos } from '@/lib/firebaseService'
```

### 2. Hook Return Patterns

```typescript
// ❌ Wrong
return { courses, loading, error }

// ✅ Correct
return { data: courses, isLoading: loading, error }
```

### 3. Query Key Management

```typescript
// ❌ Wrong
useQuery(['courses'], fetchCourses)

// ✅ Correct
useQuery(queryKeys.cursosList(), fetchCourses)
```

### 4. Error Handling

```typescript
// ❌ Wrong
if (error) return <div>Error occurred</div>

// ✅ Correct
if (error) return <ErrorState error={error.message} onRetry={refetch} />
```

### 5. Form Validation

```typescript
// ❌ Wrong - No validation
<Input {...field} />

// ✅ Correct - With validation
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Title</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## 🔍 Troubleshooting

### Build Errors

| Error | Solution |
|-------|----------|
| `Type '...' is not assignable` | Check type definitions in `/types/index.ts` |
| `Cannot find module '@/...'` | Check path mapping in `tsconfig.json` |
| `Property does not exist` | Add property to interface definition |

### Runtime Errors

| Error | Solution |
|-------|----------|
| `Firebase: Permission denied` | Check Firestore security rules |
| `Hook called outside component` | Move hook call inside React component |
| `Cannot read property of undefined` | Add null checks and loading states |

### Performance Issues

| Issue | Solution |
|-------|----------|
| Slow page load | Implement code splitting and lazy loading |
| Excessive re-renders | Use `useMemo` and `useCallback` |
| Large bundle size | Check import statements and remove unused code |

### Common Dev Environment Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset Next.js cache
rm -rf .next

# Check TypeScript configuration
npx tsc --noEmit

# Verify Firebase configuration
npm run firebase:emulators
```

---

## 📊 Performance Targets

| Metric | Target | Tools |
|--------|--------|-------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Bundle Size | < 500KB | webpack-bundle-analyzer |
| TypeScript Compile | < 30s | tsc |
| Test Suite | < 60s | Jest |

---

## 🔗 Quick Links

- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- [Comprehensive Templates](./templates/COMPREHENSIVE_TEMPLATES.md)
- [Practical Examples](./PRACTICAL_EXAMPLES.md)
- [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)
- [Component Architecture](./COMPONENT_ARCHITECTURE.md)

---

## 💡 Pro Tips

1. **Use VS Code snippets**: Create custom snippets for common patterns
2. **Install recommended extensions**: ESLint, Prettier, TypeScript
3. **Set up Git hooks**: Pre-commit linting and type checking
4. **Use React DevTools**: Debug component performance
5. **Monitor bundle size**: Keep an eye on build outputs
6. **Test on real devices**: Don't just use dev tools simulation
7. **Profile performance**: Use Chrome DevTools Performance tab
8. **Keep components small**: Follow single responsibility principle

This quick reference should be your go-to guide for daily development in the CRM system!