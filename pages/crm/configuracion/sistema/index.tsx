import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, HelpCircle, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SistemaTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Sistema</CardTitle>
        <CardDescription>Detalles técnicos y versión del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Versión del Sistema</p>
            <p className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_VERSION_SOFT}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Última Actualización</p>
            <p className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_LAST_UPDATE}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Licencia</p>
            <p className="text-sm text-muted-foreground">CIPM</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Soporte Técnico</p>
            <p className="text-sm text-muted-foreground">soporte@cipm.com</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Base de Datos</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm">Última copia de seguridad</p>
              <p className="text-xs text-muted-foreground">15 de octubre, 2023 - 03:45 AM</p>
            </div>
            <Button variant="outline" size="sm">
              <Database className="mr-2 h-4 w-4" />
              Crear Backup
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Mantenimiento</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm">Modo de Mantenimiento</p>
              <p className="text-xs text-muted-foreground">Poner el sistema en modo de mantenimiento</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Logs del Sistema</h3>
          <div className="h-32 overflow-y-auto rounded-md border p-2 text-xs font-mono">
            <p>[2023-10-15 08:45:12] INFO: Sistema iniciado correctamente</p>
            <p>[2023-10-15 09:12:34] INFO: Usuario admin@cipm.com inició sesión</p>
            <p>[2023-10-15 10:23:45] INFO: Backup automático completado</p>
            <p>[2023-10-15 11:34:56] WARN: Alto uso de CPU detectado (78%)</p>
            <p>[2023-10-15 12:45:12] INFO: Usuario admin@cipm.com cerró sesión</p>
            <p>[2023-10-15 13:56:23] INFO: Usuario instructor@cipm.com inició sesión</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">
          <HelpCircle className="mr-2 h-4 w-4" />
          Soporte Técnico
        </Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Actualizar Sistema
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SistemaTab;