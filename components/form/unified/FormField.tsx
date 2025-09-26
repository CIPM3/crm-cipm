"use client"

import { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BaseFieldProps {
  name: string
  label: string
  formik: any
  required?: boolean
  disabled?: boolean
  className?: string
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string
  rows?: number
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

interface DateFieldProps extends BaseFieldProps {
  placeholder?: string
}

export function InputField({
  name,
  label,
  formik,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className
}: InputFieldProps) {
  const hasError = formik.touched[name] && formik.errors[name]

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled}
        className={hasError ? 'border-red-500' : ''}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">{formik.errors[name]}</p>
      )}
    </div>
  )
}

export function TextareaField({
  name,
  label,
  formik,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  className
}: TextareaFieldProps) {
  const hasError = formik.touched[name] && formik.errors[name]

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled}
        className={hasError ? 'border-red-500' : ''}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">{formik.errors[name]}</p>
      )}
    </div>
  )
}

export function SelectField({
  name,
  label,
  formik,
  options,
  placeholder = "Seleccionar...",
  required = false,
  disabled = false,
  className
}: SelectFieldProps) {
  const hasError = formik.touched[name] && formik.errors[name]

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={formik.values[name] || ''}
        onValueChange={(value) => formik.setFieldValue(name, value)}
        disabled={disabled}
      >
        <SelectTrigger className={hasError ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">{formik.errors[name]}</p>
      )}
    </div>
  )
}

export function DateField({
  name,
  label,
  formik,
  placeholder = "Seleccionar fecha",
  required = false,
  disabled = false,
  className
}: DateFieldProps) {
  const hasError = formik.touched[name] && formik.errors[name]
  const value = formik.values[name]
  const date = value ? new Date(value) : undefined

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              hasError ? 'border-red-500' : ''
            } ${!date && 'text-muted-foreground'}`}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => formik.setFieldValue(name, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">{formik.errors[name]}</p>
      )}
    </div>
  )
}

export function CustomField({
  name,
  label,
  formik,
  children,
  required = false,
  className
}: {
  name: string
  label: string
  formik: any
  children: ReactNode
  required?: boolean
  className?: string
}) {
  const hasError = formik.touched[name] && formik.errors[name]

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {hasError && (
        <p className="text-sm text-red-500 mt-1">{formik.errors[name]}</p>
      )}
    </div>
  )
}