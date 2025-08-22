"use client"

import HeaderCliente from '@/components/header/header-cliente'
import Footer from '@/pages/cliente/main/footer'
import React from 'react'

interface CourseContentClientProps {
  params: { id: string }
}

export default function CourseContentClient({ params }: CourseContentClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderCliente />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Curso ID: {params.id}</h1>
          {/* Aquí puedes agregar más contenido relacionado con el curso */}
        </div>
      </main>
      <Footer />
    </div>
  )
}