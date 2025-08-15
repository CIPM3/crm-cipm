import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header/header-cliente"
import Footer from "@/pages/cliente/main/footer"

export function VideoDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Video skeleton */}
              <div className="aspect-video bg-muted rounded-lg mb-6 animate-pulse" />
              
              {/* Title skeleton */}
              <div className="h-8 w-2/3 bg-muted rounded mb-4 animate-pulse" />
              
              {/* Info skeleton */}
              <div className="flex gap-4 mb-6">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
              
              {/* Description skeleton */}
              <div className="border-t pt-6 mb-8">
                <div className="h-6 w-1/4 bg-muted rounded mb-4 animate-pulse" />
                <div className="h-4 w-full bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              </div>
              
              {/* Related videos skeleton */}
              <div className="h-6 w-1/3 bg-muted rounded mb-4 animate-pulse" />
              <div className="space-y-4 mb-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-24 h-16 bg-muted rounded-md animate-pulse" />
                    <div>
                      <div className="h-4 w-32 bg-muted rounded mb-2 animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Comments skeleton */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-10 w-full bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              {/* Course info skeleton */}
              <div className="mb-6">
                <div className="h-6 w-1/2 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 w-full bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function NotFoundState() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold mb-2">Video no encontrado</h2>
            <p className="text-muted-foreground mb-6">
              El video que buscas no existe o ha sido removido.
            </p>
            <Button asChild>
              <Link href="/videos">Volver a videos</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}