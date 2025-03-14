import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
    return (
        <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex-1  w-full h-full flex justify-end gap-3">
                <Skeleton className="size-12" />
                <Skeleton className="size-12" />
                <Skeleton className="size-12" />
            </div>
        </div>
    )
}
