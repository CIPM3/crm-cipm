import type { AppProps } from 'next/app'
import '../app/globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from "@/components/ui/toaster"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
      <Toaster />
    </QueryProvider>
  )
}