import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mt-16 grid grid-cols-1 gap-6 px-8 py-16 sm:grid-cols-2 sm:px-16 lg:grid-cols-3 lg:px-24 xl:grid-cols-5 xl:px-40">
      {Array.from({ length: 20 }).map((_, idx) => (
        <div key={idx}>
          <div className="flex flex-col overflow-hidden rounded-xl border p-0 shadow-sm">
            <div className="relative flex aspect-[3/2] w-full items-center justify-center p-4">
              <Skeleton className="h-6 w-6" />
            </div>
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="mt-2 h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
