import VideoCard from '@/components/card/video-card'
import { courses, modules } from '@/lib/utils'
import React from 'react'

const VideosDestacados = () => {
    const featuredVideos = modules
        .flatMap((module) =>
            module.content
                .filter((content) => content.type === "video")
                .map((video) => ({
                    ...video,
                    moduleTitle: module.title,
                    courseId: module.courseId,
                    courseName: courses.find((c) => c.id === module.courseId)?.title || "",
                })),
        )
        .slice(0, 4)
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
                <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2">
                    {featuredVideos.map((video, index) => (
                        <VideoCard key={index} video={video} type='cliente'/>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default VideosDestacados
