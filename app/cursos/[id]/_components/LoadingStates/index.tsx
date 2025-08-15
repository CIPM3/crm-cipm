import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import HeaderCliente from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"

export function CourseDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center flex flex-col items-center mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-12">
              {/* Skeleton izquierda */}
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 bg-muted rounded w-2/3 animate-pulse" />
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex gap-4">
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
              {/* Skeleton derecha */}
              <div>
                <div className="rounded-lg overflow-hidden shadow-lg bg-muted animate-pulse">
                  <div className="aspect-video bg-gray-300" />
                  <div className="p-6">
                    <div className="h-8 w-32 bg-gray-300 rounded mb-4" />
                    <div className="h-10 w-full bg-gray-300 rounded mb-4" />
                    <div className="h-4 w-2/3 bg-gray-300 rounded mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 bg-gray-300 rounded" />
                      <div className="h-4 w-1/2 bg-gray-300 rounded" />
                      <div className="h-4 w-1/2 bg-gray-300 rounded" />
                      <div className="h-4 w-1/2 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Skeleton tabs */}
            <div className="mb-12">
              <div className="flex gap-4 mb-6">
                <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                <div className="h-8 w-40 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
            {/* Skeleton cursos relacionados */}
            <div className="mt-16">
              <div className="h-8 w-1/3 bg-muted rounded mb-8 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-64 bg-muted rounded-lg animate-pulse" />
                <div className="h-64 bg-muted rounded-lg animate-pulse" />
                <div className="h-64 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = "Error al cargar el curso" }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center flex flex-col items-center mb-12">
            <h1 className="text-3xl font-bold">{message}</h1>
            <Link href="/cursos">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Cursos
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function PlayerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[80vh]">
      {/* Skeleton sidebar */}
      <div className="hidden lg:block w-80 border-r bg-background p-4">
        <div className="h-8 w-2/3 bg-muted rounded mb-4 animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded mb-2 animate-pulse" />
        <div className="h-2 w-full bg-muted rounded mb-2 animate-pulse" />
        <div className="space-y-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      {/* Skeleton main player */}
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl">
          <div className="aspect-video bg-muted rounded-lg mb-6 animate-pulse" />
          <div className="h-8 w-2/3 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded mb-2 animate-pulse" />
          <div className="h-4 w-full bg-muted rounded mb-2 animate-pulse" />
          <div className="flex gap-4 mt-4">
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}