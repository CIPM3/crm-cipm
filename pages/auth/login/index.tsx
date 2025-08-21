"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import HeaderAuth from "@/components/header/header-auth";
import FooterAuth from "@/components/footer/footer-auth";
import { useLoginUser } from "@/hooks/login"; // Importa el hook de inicio de sesión
import AuthButtonGoogle from "@/components/button/auth-google-button";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const { login, loading } = useLoginUser();

  // Si ya está autenticado, redirigir según parámetro "redirect" o al dashboard
  useEffect(() => {
    if (user && !loading) {
      const redirectTo = (searchParams?.get('redirect') as any) || '/admin/dashboard';
      router.replace(redirectTo as any);
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    try {
      setIsLoading(true);

      // Iniciar sesión usando el hook de inicio de sesión
      await login({ email, password });
      // El redirect se maneja en el useEffect cuando user cambia
      // No hacer redirect aquí para evitar loops
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      console.error("Error al iniciar sesión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderAuth />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || loading}>
                {isLoading || loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-6 h-6 text-white" /> Iniciando Sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative my-4 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
              <AuthButtonGoogle />
            </div>
          </CardFooter>
        </Card>
      </main>

      <FooterAuth />
    </div>
  );
}