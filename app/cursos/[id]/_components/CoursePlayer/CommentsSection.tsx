import { useState } from "react"
import { MessageCircle } from "lucide-react"

interface Comment {
  id: number
  name: string
  time: string
  text: string
  likes: number
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    name: "María García",
    time: "hace 2 horas",
    text: "Excelente introducción, muy clara la explicación sobre los conceptos básicos.",
    likes: 5,
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    time: "hace 1 día",
    text: "¿Podrían profundizar más en la diferencia entre proyecto y operación?",
    likes: 2,
  },
]

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS)
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim().length === 0) return
    
    const newComment: Comment = {
      id: Date.now(),
      name: "Tú",
      time: "ahora",
      text: input,
      likes: 0,
    }
    
    setComments([newComment, ...comments])
    setInput("")
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold text-lg">
          Comentarios ({comments.length})
        </span>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full border rounded-lg p-3 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          placeholder="Escribe tu comentario o pregunta..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-primary/90 transition-colors"
            disabled={input.trim().length === 0}
          >
            Publicar comentario
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      {/* Comment Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center text-xs font-bold text-gray-500">
          {comment.name[0]}
        </div>
        <span className="font-semibold">{comment.name}</span>
        <span className="text-xs text-muted-foreground">{comment.time}</span>
      </div>

      {/* Comment Text */}
      <div className="mb-2">{comment.text}</div>

      {/* Comment Actions */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>👍 {comment.likes}</span>
        <button className="hover:underline">Responder</button>
      </div>
    </div>
  )
}