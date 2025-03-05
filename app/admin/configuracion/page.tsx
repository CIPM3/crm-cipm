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
  Bell,
  Globe,
  Palette,
  Mail,
  Key,
  Plus,
  Trash2,
  Database,
  FileText,
  CreditCard,
  Building,
  Shield,
  HelpCircle,
  BarChart,
  Zap,
  Eye,
} from "lucide-react"

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(true)
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
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="facturacion">Facturación</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
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

        <TabsContent value="notificaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo recibes notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Canales de Notificación</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <p className="text-sm">Notificaciones por Correo</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recibe notificaciones a través de correo electrónico
                    </p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <p className="text-sm">Notificaciones del Navegador</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Recibe notificaciones en tu navegador</p>
                  </div>
                  <Switch checked={browserNotifications} onCheckedChange={setBrowserNotifications} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Tipos de Notificaciones</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Nuevas inscripciones</p>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm">Comentarios en videos</p>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm">Actualizaciones del sistema</p>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm">Mensajes de estudiantes</p>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Guardar Preferencias
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

        <TabsContent value="empresa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>Actualiza los datos de tu organización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="company-name" className="text-sm font-medium">
                    Nombre de la Empresa
                  </label>
                  <input
                    id="company-name"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="CIPM Educación"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="tax-id" className="text-sm font-medium">
                    RFC / Identificación Fiscal
                  </label>
                  <input
                    id="tax-id"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="CIPM123456ABC"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="company-address" className="text-sm font-medium">
                    Dirección
                  </label>
                  <textarea
                    id="company-address"
                    rows={3}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="Av. Reforma 123, Col. Centro, Ciudad de México, CP 06000"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="company-phone" className="text-sm font-medium">
                      Teléfono
                    </label>
                    <input
                      id="company-phone"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="+52 55 1234 5678"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="company-email" className="text-sm font-medium">
                      Email de Contacto
                    </label>
                    <input
                      id="company-email"
                      type="email"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="contacto@cipm.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Building className="mr-2 h-4 w-4" />
                Guardar Información
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="facturacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Facturación</CardTitle>
              <CardDescription>Gestiona tus métodos de pago y facturación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Plan Actual</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Plan Empresarial</p>
                    <p className="text-sm text-muted-foreground">$999 MXN / mes</p>
                  </div>
                  <Button variant="outline">Cambiar Plan</Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Métodos de Pago</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Método
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expira: 12/2025</p>
                      </div>
                    </div>
                    <Badge>Predeterminado</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Historial de Facturación</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Factura #INV-001</p>
                      <p className="text-sm text-muted-foreground">15 de octubre, 2023</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">$999 MXN</Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Descargar</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Factura #INV-002</p>
                      <p className="text-sm text-muted-foreground">15 de noviembre, 2023</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">$999 MXN</Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Descargar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones y API</CardTitle>
              <CardDescription>Conecta con otras plataformas y servicios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Integraciones Activas</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Integración
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Zoom</p>
                        <p className="text-sm text-muted-foreground">Integración para videoconferencias</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <BarChart className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Google Analytics</p>
                        <p className="text-sm text-muted-foreground">Seguimiento de estadísticas</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">API Keys</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">API Key Principal</p>
                      <p className="text-sm text-muted-foreground">Creada: 15 de octubre, 2023</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Generar Nueva API Key
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Webhooks</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Webhook de Inscripciones</p>
                      <p className="text-sm text-muted-foreground">https://example.com/webhook/inscripciones</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Gestiona la seguridad y privacidad de tu plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Políticas de Contraseñas</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Longitud mínima de contraseña</p>
                      <p className="text-xs text-muted-foreground">Mínimo 8 caracteres recomendado</p>
                    </div>
                    <select
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="8"
                    >
                      <option value="6">6 caracteres</option>
                      <option value="8">8 caracteres</option>
                      <option value="10">10 caracteres</option>
                      <option value="12">12 caracteres</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Requerir caracteres especiales</p>
                      <p className="text-xs text-muted-foreground">Símbolos como @, #, $, etc.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Caducidad de contraseñas</p>
                      <p className="text-xs text-muted-foreground">Forzar cambio periódico</p>
                    </div>
                    <select
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="90"
                    >
                      <option value="never">Nunca</option>
                      <option value="30">30 días</option>
                      <option value="60">60 días</option>
                      <option value="90">90 días</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Autenticación</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">2FA para todos los usuarios</p>
                      <p className="text-xs text-muted-foreground">Requerir autenticación de dos factores</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Bloqueo de cuenta</p>
                      <p className="text-xs text-muted-foreground">Después de 5 intentos fallidos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Registro de Actividad</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Registro de inicios de sesión</p>
                      <p className="text-xs text-muted-foreground">Guardar historial de accesos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Notificar accesos sospechosos</p>
                      <p className="text-xs text-muted-foreground">Alertar sobre inicios de sesión inusuales</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </CardFooter>
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

