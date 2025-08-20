// Template for creating form components with React Hook Form + Zod validation
// Copy this file and replace [Feature] placeholders with your feature name

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon, X, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { [Feature]DataType } from '@/types'

// === VALIDATION SCHEMA ===

const [feature]Schema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  
  status: z.enum(['active', 'inactive', 'draft', 'archived'], {
    required_error: 'Please select a status',
  }),
  
  category: z
    .string()
    .max(50, 'Category must not exceed 50 characters')
    .optional(),
  
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .optional(),
  
  tags: z
    .array(z.string().max(30, 'Tag must not exceed 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  
  assignedTo: z
    .string()
    .optional(),
  
  dueDate: z
    .date()
    .min(new Date(), 'Due date must be in the future')
    .optional(),
  
  settings: z.object({
    isPublic: z.boolean().default(true),
    allowComments: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
    autoArchive: z.boolean().default(false),
    archiveAfterDays: z
      .number()
      .min(1, 'Must be at least 1 day')
      .max(365, 'Cannot exceed 365 days')
      .optional(),
    notifications: z.object({
      onCreate: z.boolean().default(true),
      onUpdate: z.boolean().default(false),
      onComplete: z.boolean().default(true),
    }).optional(),
  }).optional(),
})

type [Feature]FormData = z.infer<typeof [feature]Schema>

// === FORM COMPONENT PROPS ===

interface [Feature]FormProps {
  initialData?: Partial<[Feature]DataType>
  mode: 'create' | 'edit' | 'view'
  onSubmit: (data: [Feature]FormData) => Promise<void>
  onCancel: () => void
  onDelete?: () => void
  isLoading?: boolean
  className?: string
  showAdvanced?: boolean
}

// === PREDEFINED OPTIONS ===

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', description: 'Work in progress' },
  { value: 'active', label: 'Active', description: 'Currently active' },
  { value: 'inactive', label: 'Inactive', description: 'Temporarily disabled' },
  { value: 'archived', label: 'Archived', description: 'No longer in use' },
] as const

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
] as const

// Sample categories - replace with your actual categories
const CATEGORY_OPTIONS = [
  'Development',
  'Design',
  'Marketing',
  'Support',
  'Operations',
  'Research',
] as const

// === MAIN FORM COMPONENT ===

export const [Feature]Form: React.FC<[Feature]FormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
  className,
  showAdvanced = false,
}) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(showAdvanced)
  const [tagInput, setTagInput] = React.useState('')

  const form = useForm<[Feature]FormData>({
    resolver: zodResolver([feature]Schema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'draft',
      category: initialData?.category ?? '',
      priority: initialData?.priority ?? 'medium',
      tags: initialData?.tags ?? [],
      assignedTo: initialData?.assignedTo ?? '',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      settings: {
        isPublic: initialData?.settings?.isPublic ?? true,
        allowComments: initialData?.settings?.allowComments ?? true,
        requireApproval: initialData?.settings?.requireApproval ?? false,
        autoArchive: initialData?.settings?.autoArchive ?? false,
        archiveAfterDays: initialData?.settings?.archiveAfterDays ?? undefined,
        notifications: {
          onCreate: initialData?.settings?.notifications?.onCreate ?? true,
          onUpdate: initialData?.settings?.notifications?.onUpdate ?? false,
          onComplete: initialData?.settings?.notifications?.onComplete ?? true,
        },
      },
    },
  })

  const { watch, setValue, getValues } = form
  const watchedTags = watch('tags') || []
  const watchedAutoArchive = watch('settings.autoArchive')
  const isViewMode = mode === 'view'

  // Handle form submission
  const handleSubmit = async (data: [Feature]FormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // Error handling is managed by the parent component
      console.error('Form submission error:', error)
    }
  }

  // Add tag functionality
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !watchedTags.includes(trimmedTag) && watchedTags.length < 10) {
      setValue('tags', [...watchedTags, trimmedTag])
      setTagInput('')
    }
  }

  // Remove tag functionality
  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                {mode === 'create' ? 'Create a new [feature]' : `${mode === 'edit' ? 'Edit' : 'View'} [feature] details`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter [feature] name" 
                        disabled={isViewMode || isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed as the [feature] title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter [feature] description"
                        className="resize-none"
                        disabled={isViewMode || isLoading}
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isViewMode || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isViewMode || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <div className={cn(
                                  'w-2 h-2 rounded-full',
                                  option.color.split(' ')[0]
                                )} />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isViewMode || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags Field */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {!isViewMode && (
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add tag and press Enter"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagInputKeyDown}
                              disabled={isLoading || watchedTags.length >= 10}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTag(tagInput)}
                              disabled={!tagInput.trim() || watchedTags.length >= 10}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {watchedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {watchedTags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {tag}
                                {!isViewMode && (
                                  <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                                    disabled={isLoading}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Press Enter or comma to add tags. Maximum 10 tags allowed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date Field */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isViewMode || isLoading}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          {(showAdvancedSettings || mode === 'view') && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure additional options and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* General Settings */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="settings.isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Public</FormLabel>
                          <FormDescription>
                            Make this [feature] visible to all users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.allowComments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Allow Comments</FormLabel>
                          <FormDescription>
                            Enable comments on this [feature]
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.requireApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Approval</FormLabel>
                          <FormDescription>
                            Changes require approval before going live
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.autoArchive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Auto Archive</FormLabel>
                          <FormDescription>
                            Automatically archive after specified days
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchedAutoArchive && (
                    <FormField
                      control={form.control}
                      name="settings.archiveAfterDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Archive After (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="365"
                              placeholder="30"
                              disabled={isViewMode || isLoading}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of days before auto-archiving (1-365)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Separator />

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  
                  <FormField
                    control={form.control}
                    name="settings.notifications.onCreate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>On Create</FormLabel>
                          <FormDescription>
                            Notify when [feature] is created
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.notifications.onUpdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>On Update</FormLabel>
                          <FormDescription>
                            Notify when [feature] is updated
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.notifications.onComplete"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isViewMode || isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>On Complete</FormLabel>
                          <FormDescription>
                            Notify when [feature] is completed
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isViewMode && !showAdvancedSettings && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvancedSettings(true)}
                  disabled={isLoading}
                >
                  Show Advanced Settings
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                {isViewMode ? 'Close' : 'Cancel'}
              </Button>
              
              {mode === 'view' && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
              
              {!isViewMode && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

// === EXPORTS ===

export type { [Feature]FormProps, [Feature]FormData }
export { [feature]Schema }

/* 
USAGE EXAMPLES:

// Create mode
<[Feature]Form
  mode="create"
  onSubmit={async (data) => {
    await createMutation.mutateAsync(data)
    navigate('/[feature]s')
  }}
  onCancel={() => navigate('/[feature]s')}
  isLoading={createMutation.isLoading}
/>

// Edit mode
<[Feature]Form
  mode="edit"
  initialData={existingData}
  onSubmit={async (data) => {
    await updateMutation.mutateAsync({ id: existingData.id, data })
  }}
  onCancel={() => setIsEditing(false)}
  isLoading={updateMutation.isLoading}
  showAdvanced={true}
/>

// View mode
<[Feature]Form
  mode="view"
  initialData={data}
  onSubmit={async () => {}} // Not used in view mode
  onCancel={() => navigate('/[feature]s')}
  onDelete={() => handleDelete(data.id)}
  showAdvanced={true}
/>

*/