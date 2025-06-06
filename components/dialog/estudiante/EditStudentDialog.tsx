"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import { useState } from "react"
import { useUpdateUsuarios } from "@/hooks/usuarios/useUpdateUsuarios"
import { useUpdateCliente } from "@/hooks/estudiantes/clientes"

export default function EditStudentDialog({
  student,
  open,
  onOpenChange,
}: {
  student: any
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    status: student.status,
  })

  const {update} = useUpdateCliente()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedData = {
      id: student.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status === "Activo" ? "Activo" : "Inactivo",
    }
    update(updatedData.id, updatedData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Estudiante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name">Nombre Completo</label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Correo Electrónico</label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">Teléfono</label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Estado Activo</p>
                <p className="text-xs text-muted-foreground">El estudiante puede acceder a la plataforma</p>
              </div>
              <Switch checked={form.status === "Activo" ? true : false} onCheckedChange={(value) => setForm({ ...form, status: value })} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="notes">Notas Adicionales</label>
              <Textarea id="notes" placeholder="Notas adicionales..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit"><Save className="mr-2 h-4 w-4" />Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
