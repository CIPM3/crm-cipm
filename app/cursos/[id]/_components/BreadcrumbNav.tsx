import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BreadcrumbNavProps {
  title?: string
}

export default function BreadcrumbNav({ title }: BreadcrumbNavProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="outline" size="icon" asChild>
        <Link href="/cursos">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Link>
      </Button>
      <nav className="flex">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/cursos" className="hover:text-foreground">
              Cursos
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-foreground">{title}</li>
        </ol>
      </nav>
    </div>
  )
}