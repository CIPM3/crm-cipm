import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, User } from 'lucide-react'
import { UsersType } from '@/types'
import EditUserDialog from '../dialog/usuarios/edit-user-dialog'
import DeleteUserDialog from '../dialog/usuarios/delete-user-dialog'

interface Props {
    user: UsersType
}

const UsuarioCard = ({ user }: Props) => {

    const [OPEN_EDIT, setOPEN_EDIT] = useState(false)
    const [OPEN_DELETE, setOPEN_DELETE] = useState(false)

    return (
        <div key={user.id} className="flex flex-col md:flex-row md:items-center gap-y-4 md:justify-between p-4">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <div className="flex items-center justify-between md:justify-start gap-4">
                <Badge>{user.role}</Badge>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <User className="h-4 w-4" />
                        <span className="sr-only">Perfil</span>
                    </Button>
                    <Button onClick={()=>setOPEN_EDIT(true)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button onClick={()=>setOPEN_DELETE(true)} variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                    </Button>
                </div>
            </div>
            <EditUserDialog
                user={user}
                open={OPEN_EDIT}
                setIsOpen={setOPEN_EDIT}
            />
            <DeleteUserDialog
                user={user}
                open={OPEN_DELETE}
                setIsOpen={setOPEN_DELETE}
            />
        </div>
    )
}

export default UsuarioCard
