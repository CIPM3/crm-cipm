import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreateUserDialog from "@/components/dialog/usuarios/create-user.dialog";
import { useGetUsuarios } from "@/hooks/usuarios/useGetUsuarios";
import UsuarioCard from "@/components/card/usuario-card";
import { SkeletonDemo } from "@/components/card/usuario-skeleton";
import { useRefetchUsuariosStore } from "@/store/useRefetchUsuariosStore";

const UsuariosTab = () => {
    const [OpenCreateDialog, setOpenCreateDialog] = useState(false);
    const { data: Users, loading: LoadingUsers, refetch } = useGetUsuarios();
    const { shouldRefetch, resetRefetch } = useRefetchUsuariosStore();

    useEffect(() => {
        if (shouldRefetch) {
            refetch();
            resetRefetch();
        }
    }, [shouldRefetch, refetch, resetRefetch]);

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Usuarios del Sistema</h3>
                <Button onClick={() => setOpenCreateDialog(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Usuario
                </Button>
            </div>

            <CreateUserDialog open={OpenCreateDialog} setIsOpen={setOpenCreateDialog} />

            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">


                        {
                            LoadingUsers ? (
                                Array(3)
                                    .fill(null)
                                    .map((_, index) => <SkeletonDemo key={index} />)
                            ) : (
                                <>
                                    {(Users || []).filter((user) => user.role !== "cliente").map((user) => (
                                        <UsuarioCard key={user.id} user={user} />
                                    ))}</>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default UsuariosTab;