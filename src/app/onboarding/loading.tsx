import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-56" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border p-6 space-y-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
