import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CalendarEvent } from '@/types';
import React from 'react'
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void
    data: CalendarEvent;
}

const InfoClaseDialog = ({ open, setOpen, data }: Props) => {
    //console.log(data)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className='hidden'>
                    <DialogTitle>Informacion</DialogTitle>
                </DialogHeader>
                <div className="bg-white p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">{data?.title!!}</h2>
                    <p><strong>Estudiante:</strong> {data?.studentName!!}</p>
                    <p><strong>Hora:</strong> {data.time}</p>
                    <p><strong>Etiqueta:</strong> {data.anoSemana}</p>
                    <p><strong>Información adicional:</strong> {data?.level!!}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InfoClaseDialog
