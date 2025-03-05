import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoType } from '@/types'

interface Props {
    video:VideoType
}

const VideoCard = ({video}:Props) => {
    return (
        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <img
                    src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(video.title)}`}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
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
            <CardHeader>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{video.courseName}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Parte del módulo: {video.moduleTitle}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{video.duration}</span>
                </div>
                <Button variant="outline" size="sm">
                    Ver Video
                </Button>
            </CardFooter>
        </Card>
    )
}

export default VideoCard
