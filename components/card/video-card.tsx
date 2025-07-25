"use client"

import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Edit, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoType } from '@/types'
import Link from 'next/link'
import { DeleteVideoDialog } from '../dialog/delete-video-dialog'
import gsap from 'gsap'

interface Props {
    video: VideoType | any;
    type: 'crm' | 'cliente',
    delay: number
}

const VideoCard = ({ video, type,delay=0 }: Props) => {
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, delay, ease: "power2.out" }
            )
        }
    }, [delay])

    const thumbnail = video.thumbnail ? video.thumbnail  : `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(video.title)}`
    return (
        <Card ref={cardRef} key={video.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <img
                    src={thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-primary/90 p-3 text-primary-foreground">
                        <Play className="h-6 w-6" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
                    {video.duration}
                </div>
            </div>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                    {
                        type === "crm" && (
                            <Badge variant={video.moduleStatus === "Activo" ? "default" : "secondary"}>{video.moduleStatus}</Badge>
                        )
                    }
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-1 mb-4">
                    
                    <div className="flex items-center justify-between gap-2">
                        <div className='flex items-center gap-2'>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{video.duration}</span>
                        </div>
                        {
                            type === "cliente" && (
                                <Link 
                                
                                //href={''}
                                //TODO: TERMINAR LA PAGINA DE VIDEOS
                                href={`/videos/${video.id}`}
                                >
                                 <Button variant="outline" size="sm">
                                    Ver Video
                                </Button>
                                </Link>
                               
                            )
                        }
                    </div>

                </div>
                {
                    type === "crm" && (
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1">
                                <Link href={`/admin/videos/${video.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                </Link>
                            </Button>
                            <DeleteVideoDialog
                                videoId={video.id}
                                videoTitle={video.title}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            />
                        </div>
                    )
                }


            </CardContent>
        </Card>
    )
}

export default VideoCard
