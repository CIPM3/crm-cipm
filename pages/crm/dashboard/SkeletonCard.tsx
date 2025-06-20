const SkeletonCard = () => (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-muted rounded-xl shadow-md border p-6 min-h-[160px] animate-pulse">
        <div className="mb-2 h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
)

export default SkeletonCard;