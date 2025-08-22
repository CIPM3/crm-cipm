// Generate static params for admin routes - return empty array to prevent build errors
export async function generateStaticParams() {
  // For admin routes, we don't pre-generate static pages since they require authentication
  // and the data is dynamic. Return empty array to satisfy Next.js static export requirement.
  return []
}

export {default} from '@/pages/crm/clases/prueba/agendador/tabla'