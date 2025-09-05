export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-4">Página no encontrada</p>
        <a href="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}