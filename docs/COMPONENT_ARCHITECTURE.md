# Component Organization Strategy

## Domain-Driven Component Architecture

The CRM system follows a domain-driven component organization strategy that separates concerns by business domain and functionality, ensuring scalability and maintainability.

## Directory Structure

```
components/
├── ui/                     # Base UI components (Radix + Tailwind)
├── layout/                 # Layout and structural components
├── domain/                 # Domain-specific feature components
│   ├── auth/              # Authentication domain
│   ├── courses/           # Course management domain
│   ├── videos/            # Video content domain
│   ├── students/          # Student management domain
│   ├── scheduling/        # Class scheduling domain
│   ├── analytics/         # Analytics and reporting domain
│   └── system/            # System administration domain
├── shared/                # Cross-domain reusable components
│   ├── data-display/      # Tables, cards, charts
│   ├── forms/             # Form components and inputs
│   ├── feedback/          # Alerts, notifications, loading states
│   ├── navigation/        # Menus, breadcrumbs, pagination
│   └── modals/            # Dialogs, drawers, overlays
└── providers/             # Context providers and wrappers
```

## Component Classification

### 1. UI Components (`/ui/`)
**Purpose**: Base design system components built on Radix UI primitives
**Characteristics**:
- No business logic
- Fully reusable across domains
- Consistent styling with Tailwind CSS
- Accessibility-first design

```typescript
// Example: components/ui/button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  // ... other props
}
```

### 2. Layout Components (`/layout/`)
**Purpose**: Structural components for page layouts and navigation
**Examples**:
- `AdminLayout.tsx` - Admin panel layout with sidebar
- `PublicLayout.tsx` - Public site layout with header/footer
- `AuthLayout.tsx` - Authentication pages layout

### 3. Domain Components (`/domain/`)
**Purpose**: Feature-specific components organized by business domain

#### Authentication Domain (`/domain/auth/`)
```
auth/
├── LoginForm/
│   ├── LoginForm.tsx
│   ├── LoginForm.types.ts
│   ├── LoginForm.test.tsx
│   └── index.ts
├── RegisterForm/
├── PasswordReset/
└── index.ts
```

#### Course Management Domain (`/domain/courses/`)
```
courses/
├── CourseList/
│   ├── CourseList.tsx
│   ├── CourseCard.tsx
│   ├── CourseFilters.tsx
│   └── index.ts
├── CourseDetail/
│   ├── CourseDetail.tsx
│   ├── CourseHeader.tsx
│   ├── CourseModules.tsx
│   ├── CourseEnrollment.tsx
│   └── index.ts
├── CourseEditor/
├── CoursePlayer/
└── index.ts
```

#### Student Management Domain (`/domain/students/`)
```
students/
├── StudentList/
├── StudentDetail/
├── StudentProgress/
├── StudentEnrollment/
└── index.ts
```

### 4. Shared Components (`/shared/`)
**Purpose**: Reusable components that span multiple domains

#### Data Display (`/shared/data-display/`)
- `DataTable.tsx` - Generic data table with sorting, filtering
- `StatCard.tsx` - Metric display cards
- `Chart.tsx` - Reusable chart components
- `Timeline.tsx` - Activity timeline component

#### Forms (`/shared/forms/`)
- `FormField.tsx` - Standardized form field wrapper
- `SearchInput.tsx` - Search functionality
- `DatePicker.tsx` - Date selection component
- `FileUpload.tsx` - File upload handling

#### Feedback (`/shared/feedback/`)
- `LoadingSpinner.tsx` - Loading states
- `ErrorBoundary.tsx` - Error handling
- `Toast.tsx` - Notification system
- `ConfirmDialog.tsx` - Confirmation modals

## Component Design Patterns

### 1. Container/Presentation Pattern
```typescript
// Container Component (handles logic)
export const CourseListContainer = () => {
  const { data: courses, loading, error } = useFetchCourses()
  
  return (
    <CourseListPresentation 
      courses={courses}
      loading={loading}
      error={error}
    />
  )
}

// Presentation Component (handles display)
export const CourseListPresentation = ({ courses, loading, error }) => {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState error={error} />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

### 2. Compound Component Pattern
```typescript
// Compound component for complex interactions
export const CoursePlayer = ({ courseId }) => {
  return (
    <CoursePlayerProvider courseId={courseId}>
      <CoursePlayer.Header />
      <CoursePlayer.Content />
      <CoursePlayer.Sidebar />
      <CoursePlayer.Controls />
    </CoursePlayerProvider>
  )
}

CoursePlayer.Header = CoursePlayerHeader
CoursePlayer.Content = CoursePlayerContent
CoursePlayer.Sidebar = CoursePlayerSidebar
CoursePlayer.Controls = CoursePlayerControls
```

### 3. Render Props Pattern
```typescript
// Flexible data fetching component
export const DataFetcher = ({ endpoint, children }) => {
  const { data, loading, error } = useApiCall(endpoint)
  
  return children({ data, loading, error })
}

// Usage
<DataFetcher endpoint="/api/courses">
  {({ data, loading, error }) => (
    <CourseList courses={data} loading={loading} error={error} />
  )}
</DataFetcher>
```

## Component Standards

### File Naming Conventions
- **PascalCase** for component files: `CourseList.tsx`
- **camelCase** for utility files: `courseHelpers.ts`
- **kebab-case** for CSS modules: `course-list.module.css`

### Component Structure Template
```typescript
// CourseCard.tsx
import React from 'react'
import { Card, Button } from '@/components/ui'
import { Course } from '@/types'
import { useCourseActions } from '@/hooks'

export interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
  variant?: 'default' | 'compact'
  className?: string
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  variant = 'default',
  className,
  ...props
}) => {
  const { handleEnroll, loading } = useCourseActions()
  
  const handleEnrollClick = () => {
    handleEnroll(course.id)
    onEnroll?.(course.id)
  }
  
  return (
    <Card className={cn('course-card', className)} {...props}>
      <Card.Header>
        <Card.Title>{course.title}</Card.Title>
        <Card.Description>{course.description}</Card.Description>
      </Card.Header>
      
      <Card.Content>
        <div className="course-meta">
          <span className="price">${course.price}</span>
          <span className="duration">{course.duration}</span>
        </div>
      </Card.Content>
      
      <Card.Footer>
        <Button 
          onClick={handleEnrollClick}
          loading={loading}
          disabled={loading}
        >
          Enroll Now
        </Button>
      </Card.Footer>
    </Card>
  )
}

// Export with display name for debugging
CourseCard.displayName = 'CourseCard'
```

### Testing Standards
Each component should include:
- **Unit tests** for component logic
- **Integration tests** for user interactions
- **Accessibility tests** for WCAG compliance

```typescript
// CourseCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CourseCard } from './CourseCard'
import { mockCourse } from '@/test-utils/mocks'

describe('CourseCard', () => {
  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} />)
    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument()
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument()
  })
  
  it('handles enrollment action', () => {
    const onEnroll = jest.fn()
    render(<CourseCard course={mockCourse} onEnroll={onEnroll} />)
    
    fireEvent.click(screen.getByText('Enroll Now'))
    expect(onEnroll).toHaveBeenCalledWith(mockCourse.id)
  })
})
```

## Component Documentation

### Storybook Integration
All shared and domain components should have Storybook stories:

```typescript
// CourseCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CourseCard } from './CourseCard'

const meta: Meta<typeof CourseCard> = {
  title: 'Domain/Courses/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    course: {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      price: 99,
      duration: '4 weeks',
    }
  }
}

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact'
  }
}
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
- Set up new directory structure
- Move UI components to `/ui` directory
- Create shared component library

### Phase 2: Domain Organization (Week 3-4)
- Reorganize existing components by domain
- Create domain-specific component modules
- Update import paths across the application

### Phase 3: Enhancement (Week 5-6)
- Implement compound components for complex features
- Add comprehensive testing coverage
- Create Storybook documentation

### Phase 4: Optimization (Week 7-8)
- Performance optimization
- Bundle size analysis and code splitting
- Accessibility audit and improvements

This component organization strategy ensures:
- **Scalability**: Easy to add new features and domains
- **Maintainability**: Clear separation of concerns
- **Reusability**: Shared components reduce duplication
- **Testability**: Isolated components are easier to test
- **Developer Experience**: Intuitive organization and clear patterns