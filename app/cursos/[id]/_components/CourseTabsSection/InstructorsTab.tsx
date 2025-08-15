import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Instructor {
  name: string
  role: string
  description: string
  rating: number
  reviews: number
  image: string
}

const INSTRUCTORS: Instructor[] = [
  {
    name: "Adrian Leal",
    role: "CEO de Cursos Personalizados Monterrey",
    description: "Con más de 15 años de experiencia en clases de inglés, Adrian es un experto en la enseñanza de idiomas y habilidades empresariales.",
    rating: 4.9,
    reviews: 120,
    image: "https://firebasestorage.googleapis.com/v0/b/cipmbilling-24963.appspot.com/o/cursoImages%2F215c23359a99c235fe999204b%2F215c23359a99c235fe999204b.jpg?alt=media&token=3d735907-1ce2-462d-a6c4-8715aa1d198a"
  }
]

export default function InstructorsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Conoce a tus instructores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INSTRUCTORS.map((instructor, index) => (
          <InstructorCard key={index} instructor={instructor} />
        ))}
      </div>
    </div>
  )
}

interface InstructorCardProps {
  instructor: Instructor
}

function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Instructor Image */}
          <img
            src={instructor.image}
            alt={instructor.name}
            className="rounded-full h-32 w-32 object-cover mx-auto sm:mx-0 flex-shrink-0"
          />
          
          {/* Instructor Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
            <p className="text-primary mb-2 font-medium">{instructor.role}</p>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {instructor.description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{instructor.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({instructor.reviews} valoraciones)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}