import ComentarioCard from "@/components/card/comentario-card"

export default function CommentsSection() {
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Comentarios</h2>
        <span className="text-sm text-muted-foreground">1 comentario</span>
      </div>
      
      {/* Comentario existente */}
      <ComentarioCard />
    </div>
  )
}