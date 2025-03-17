import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const CuentaTab = () => {
  return (
    <Card>
        <CardHeader>
          <CardTitle>Seguridad de la Cuenta</CardTitle>
          <CardDescription>Actualiza tu contraseña y configuración de seguridad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="current-password" className="text-sm font-medium">
                Contraseña Actual
              </label>
              <input
                id="current-password"
                type="password"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                Nueva Contraseña
              </label>
              <input
                id="new-password"
                type="password"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Autenticación de Dos Factores</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm">Autenticación de Dos Factores</p>
                <p className="text-xs text-muted-foreground">Añade una capa adicional de seguridad a tu cuenta</p>
              </div>
              <Switch checked={false} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>
            <Lock className="mr-2 h-4 w-4" />
            Actualizar Seguridad
          </Button>
        </CardFooter>
      </Card>
  );
};

export default CuentaTab;