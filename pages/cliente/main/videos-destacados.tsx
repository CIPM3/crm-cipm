"use client"

import CursoCardSkeleton from '@/components/card/curso-skeleton-card'
import VideoCard from '@/components/card/video-card'
import { Button } from '@/components/ui/button'
import { useFetchVideos } from '@/hooks/videos'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const VideosDestacados = () => {
    const User = useAuthStore((state) => state.user)
    const Href = User ? "/videos" : "/register"

    const { videos, loading, error } = useFetchVideos()
    const filteredVideos = videos.filter((video) => video.featured === true)

    return (
        <section id="videos" className="w-full py-12 md:py-24 bg-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Videos Destacados</h2>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Contenido gratuito para que conozcas nuestra metodología
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <CursoCardSkeleton/>
                        ))
                    ) : error ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center w-full font-semibold py-8">

                            <h2 className='text-center text-gray-400'>Ocurrió un error al cargar los videos destacados.</h2>
                            
                        </div>
                    ) : filteredVideos.length === 0 ? (
                        <div className="col-span-2 text-center text-muted-foreground font-medium py-8">
                            No hay videos destacados disponibles en este momento.
                        </div>
                    ) : (
                        filteredVideos.map((video, index) => (
                            <VideoCard delay={index * 0.3} key={index} video={video} type='cliente' />
                        ))
                    )}
                </div>
                <div className="flex justify-center mt-12">
                    <Button variant="outline" size="lg" asChild>
                        <Link href={Href}>
                            Ver todos los videos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default VideosDestacados