import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BreadcrumbNavProps } from "@/types"

export default function BreadcrumbNav({ videoTitle }: BreadcrumbNavProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
      <Button variant="outline" size="icon" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Link>
      </Button>
      
      <nav className="flex">
        <ol className="flex flex-col md:flex-row md:items-center gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>/</li>
            </div>
            <div className="flex items-center gap-1">
              <li>
                <Link href="/videos" className="hover:text-foreground">
                  Videos
                </Link>
              </li>
              <li>/</li>
            </div>
          </div>
          <li className="font-medium text-foreground">
            {videoTitle}
          </li>
        </ol>
      </nav>
    </div>
  )
}