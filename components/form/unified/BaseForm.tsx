"use client"

import { useFormik } from "formik"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export interface BaseFormProps<T = any> {
  initialValues: T
  validationSchema: any
  onSubmit: (values: T) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  submitText?: string
  cancelText?: string
  children: (formikProps: any) => ReactNode
}

export default function BaseForm<T>({
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = "Guardar",
  cancelText = "Cancelar",
  children
}: BaseFormProps<T>) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {children(formik)}
      
      <DialogFooter className="gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        )}
        
        <Button
          type="submit"
          disabled={isLoading || !formik.isValid}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </DialogFooter>
    </form>
  )
}