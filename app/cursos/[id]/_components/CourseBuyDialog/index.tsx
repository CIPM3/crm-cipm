import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { FacebookIcon, MessageCirclePlus, X } from 'lucide-react'
import React from 'react'

const whatsappNumber = "528121564610"
const facebookChatUrl = "https://m.me/olympusgroupmx"

interface CourseBuyDialogProps {
  courseName: string
}

const CourseBuyDialog: React.FC<CourseBuyDialogProps> = ({ courseName }) => {
  const whatsappMessage = encodeURIComponent(`Hola, quiero inscribirme al curso "${courseName}"`)

  return (
    <AlertDialog>
      <AlertDialogTrigger className='w-full mb-4'>
        <Button className="w-full">
          Inscribirse Ahora
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className='flex justify-end mb-2 absolute right-2 top-2'>
          <AlertDialogCancel className='py-0 px-2'>
            <X className='text-gray-500'/>
          </AlertDialogCancel>
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Quieres inscribirte al curso <br /> <span className="text-primary">{courseName}</span>?</AlertDialogTitle>
          <AlertDialogDescription>
            Para completar tu inscripción, contáctanos por WhatsApp o Facebook Messenger y te ayudaremos con el proceso de compra.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full flex items-center gap-2" variant="outline">
              <MessageCirclePlus className="text-green-500" /> Contactar por WhatsApp
            </Button>
          </a>
          <a
            href={facebookChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full flex items-center gap-2" variant="outline">
              <FacebookIcon className="text-blue-500" /> Contactar por Messenger
            </Button>
          </a>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CourseBuyDialog