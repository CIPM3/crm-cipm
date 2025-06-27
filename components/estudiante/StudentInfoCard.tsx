import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, Calendar, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns";

export default function StudentInfoCard({ student }: { student: any }) {
  const CreatedAt = format(new Date(student.createdAt), "dd/MM/yyyy") || new Date().toISOString();
  
  return (
    <Card className="col-span-2 lg:col-span-3 xl:col-span-1">
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student.avatar} alt={student.name || "Avatar"} />
            <AvatarFallback>{student.name ? student.name.charAt(0) : "?"}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-medium">{student.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {student.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <InfoItem icon={<Mail className="size-4" />} label="Email" value={student.email} />
          <InfoItem icon={<Phone className="size-4"/>} label="Teléfono" value={student.phone} />
          <InfoItem icon={<Calendar className="size-4"/>} label="Último Acceso" value={CreatedAt|| "N/A"} />
          <InfoItem icon={<User className="size-4"/>} label="Estado" value={student.status} />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-primary/10 p-2">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}
