import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const PerfilTab = () => {
  const currentUser = useAuthStore((state) => state.user);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Perfil</CardTitle>
        <CardDescription>Actualiza tu información personal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser?.avatar!!} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Cambiar Imagen
            </Button>
          </div>

          <div className="flex-1 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre Completo
              </label>
              <input
                id="name"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={currentUser?.name}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={currentUser?.email}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Biografía
          </label>
          <textarea
            id="bio"
            rows={4}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Escribe una breve biografía..."
          ></textarea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PerfilTab;