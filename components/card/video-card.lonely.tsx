"use client"

import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Edit, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateVideoForm, VideoType } from '@/types'
import Link from 'next/link'
import { DeleteVideoDialog } from '../dialog/delete-video-dialog'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'

interface Props {
    video: CreateVideoForm | any;
    type: 'crm' | 'cliente',
    delay: number
}

const VideoCard = ({ video, type, delay = 0 }: Props) => {
    const cardRef = useRef<HTMLDivElement>(null)

    const router = useRouter()

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, delay, ease: "power2.out" }
            )
        }
    }, [delay])
    return (
        <Card ref={cardRef} key={video.id} className="overflow-hidden">
            <div onClick={()=>{
                router.push(`/admin/videos/${video.id}`)
            }} className="aspect-video cursor-pointer w-full overflow-hidden bg-muted relative">
                {
                    video?.thumbnail ? (
                        <img
                            src={`${video.thumbnail}`}
                            alt={video.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(video.title)}`}
                            alt={video.title}
                            className="h-full w-full object-cover"
                        />
                    )
                }

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
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                
                {
                    type === "crm" && (
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1">
                                <Link href={`/admin/videos/${video.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Opciones de video
                                </Link>
                            </Button>
                        </div>
                    )
                }


            </CardContent>
        </Card>
    )
}

export default VideoCard
