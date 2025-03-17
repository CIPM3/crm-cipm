import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Palette, Save } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const AparienciaTab = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("es");
  const [primaryColor, setPrimaryColor] = useState("#0066FF");
  const [accentColor, setAccentColor] = useState("#FFBB28");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalización de la Interfaz</CardTitle>
        <CardDescription>Ajusta la apariencia del sistema a tu gusto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Tema</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm">Modo Oscuro</p>
              <p className="text-xs text-muted-foreground">Cambia entre modo claro y oscuro</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Idioma</h3>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-1"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Colores</h3>

          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <label htmlFor="primary-color" className="text-sm">
                Color Primario
              </label>
              <input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-8 w-8 rounded-md border border-input"
              />
            </div>

            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <label htmlFor="accent-color" className="text-sm">
                Color de Acento
              </label>
              <input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-8 w-8 rounded-md border border-input"
              />
            </div>
          </div>
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

export default AparienciaTab;