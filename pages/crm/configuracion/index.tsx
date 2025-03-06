"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { users } from "@/lib/utils"
import {
  Save,
  User,
  Lock,
  Globe,
  Palette,
  Key,
  Plus,
  Trash2,
  Database,
  HelpCircle,
} from "lucide-react"

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("es")
  const [primaryColor, setPrimaryColor] = useState("#0066FF")
  const [accentColor, setAccentColor] = useState("#FFBB28")

  const currentUser = users[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Administra tus preferencias y configuración del sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>

        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
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
                      defaultValue={currentUser.name}
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
                      defaultValue={currentUser.email}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Rol
                    </label>
                    <select
                      id="role"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue={currentUser.role}
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Asistente">Asistente</option>
                    </select>
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
        </TabsContent>

        <TabsContent value="cuenta" className="space-y-6">
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
        </TabsContent>


        <TabsContent value="apariencia" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Usuarios del Sistema</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Usuario
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4">
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
                    <div className="flex items-center gap-4">
                      <Badge>{user.role}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4" />
                          <span className="sr-only">Permisos</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
              <CardDescription>Detalles técnicos y versión del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Versión del Sistema</p>
                  <p className="text-sm text-muted-foreground">1.2.5</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Última Actualización</p>
                  <p className="text-sm text-muted-foreground">15 de octubre, 2023</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Licencia</p>
                  <p className="text-sm text-muted-foreground">CIPM Enterprise</p>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

