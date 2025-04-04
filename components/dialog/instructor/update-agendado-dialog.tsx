import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'
import { AgendadoForm } from '@/components/form/agendado-instructor-form';
import { AgendadoFormValues } from '@/types';
import { useUpdateStudent } from '@/hooks/estudiantes/clases-prueba/useUpdateStudent';
import { STATUS_VALS } from '@/lib/constants';
import { createStudent } from '@/api/Estudiantes/Formacion/create';

interface Props {
    open: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    estudiante: AgendadoFormValues,
    onSuccess: () => void
}

const UpdateAgendadoDialog = ({ open, setIsOpen, estudiante, onSuccess }: Props) => {
    const { update, loading } = useUpdateStudent();


    const handleSubmit = async (values: any) => {
        try {
            // Llamar a la mutación para crear el usuario
            await update(values.id, values);
            let FORMACION_DATA = {
                status: STATUS_VALS[2].value,
                week: values.anoSemana,
                nombre: values.nombreAlumno,
                telefono: values.numero,
                modalidad: values.dia,
                horario: values.horario,
                observaciones: values.observaciones,
                fecha: values.fecha,
                maestro: values.maestro,
                nivel: values.nivel,
                tipo: "Online"
            }
            await createStudent(FORMACION_DATA)
            onSuccess();
            setIsOpen(false)
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    const handleCancel = () => {
        // Lógica para cancelar el formulario
        console.log("Formulario cancelado");
        setIsOpen(false)
    };

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] px-4">
                <DialogHeader>
                    <DialogTitle>Nuevo estudiante clase prueba</DialogTitle>
                </DialogHeader>
                <AgendadoForm
                    initialValues={estudiante}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    IsLoading={loading}
                />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAgendadoDialog
