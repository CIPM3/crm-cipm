"use client"

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Edit, Trash } from 'lucide-react'
import DataTable, { TableColumn, TableAction } from './unified/DataTable'
import { useGetFormacionStudents } from '@/hooks/formacion/useGetStudentsFormacion'
import { useGetInstructores } from '@/hooks/usuarios/useGetInstructores'
import UpdateStudentDialog from '../dialog/formacion/update-student-dialog'
import DeleteStudentDialog from '../dialog/formacion/delete-student-dialog'
import { FormacionDataType } from '@/types'
import { Badge } from '../ui/badge'

const toDateObject = (fecha: any): Date | null => {
  if (!fecha) return null
  if (fecha.seconds && fecha.nanoseconds !== undefined) {
    return new Date(fecha.seconds * 1000)
  }
  if (typeof fecha === 'string' || fecha instanceof Date) {
    const date = new Date(fecha)
    return isNaN(date.getTime()) ? null : date
  }
  return null
}

const formatFirebaseDate = (timestamp: any): string => {
  const date = toDateObject(timestamp)
  return date ? format(date, "MM/dd/yyyy") : "Fecha inválida"
}

const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'activo': return 'default'
    case 'inactivo': return 'secondary'
    case 'pendiente': return 'outline'
    default: return 'secondary'
  }
}

const TableFormacion = () => {
  const { data: FormacionData = [], loading, error } = useGetFormacionStudents()
  const { data: Instructores = [] } = useGetInstructores()
  
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selected, setSelected] = useState<FormacionDataType>()

  // Get instructor name by ID
  const getInstructorName = (maestroId: string) => {
    const instructor = Instructores.find(inst => inst.id === maestroId)
    return instructor?.nombre || 'Sin asignar'
  }

  // Table columns configuration
  const columns: TableColumn<FormacionDataType>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      accessor: 'nombre',
      sortable: true,
      width: '200px'
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      accessor: 'telefono',
      width: '120px'
    },
    {
      key: 'status',
      header: 'Estado',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {value || 'Sin estado'}
        </Badge>
      ),
      width: '100px'
    },
    {
      key: 'week',
      header: 'Semana',
      accessor: 'week',
      sortable: true,
      width: '80px'
    },
    {
      key: 'horario',
      header: 'Horario',
      accessor: 'horario',
      sortable: true,
      width: '100px'
    },
    {
      key: 'maestro',
      header: 'Instructor',
      accessor: (item) => getInstructorName(item.maestro),
      sortable: true,
      width: '150px'
    },
    {
      key: 'modalidad',
      header: 'Modalidad',
      accessor: 'modalidad',
      width: '100px'
    },
    {
      key: 'nivel',
      header: 'Nivel',
      accessor: 'nivel',
      width: '80px'
    },
    {
      key: 'fecha',
      header: 'Fecha',
      accessor: (item) => formatFirebaseDate(item.fecha),
      sortable: true,
      width: '100px'
    }
  ]

  // Table actions
  const actions: TableAction<FormacionDataType>[] = [
    {
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => {
        setSelected(item)
        setOpenEdit(true)
      }
    },
    {
      label: 'Eliminar',
      icon: <Trash className="h-4 w-4" />,
      onClick: (item) => {
        setSelected(item)
        setOpenDelete(true)
      },
      variant: 'destructive'
    }
  ]

  return (
    <>
      <DataTable
        data={FormacionData}
        columns={columns}
        actions={actions}
        isLoading={loading}
        searchPlaceholder="Buscar estudiantes de formación..."
        emptyMessage="No hay estudiantes de formación registrados"
      />

      {/* Edit Dialog */}
      {selected && (
        <UpdateStudentDialog
          isOpen={openEdit}
          setIsOpen={setOpenEdit}
          Student={selected}
        />
      )}

      {/* Delete Dialog */}
      {selected && (
        <DeleteStudentDialog
          isOpen={openDelete}
          setIsOpen={setOpenDelete}
          Student={selected}
        />
      )}
    </>
  )
}

export default TableFormacion