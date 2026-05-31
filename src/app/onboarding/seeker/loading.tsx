import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingSeekerLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* ¿Para quién? */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        {[0, 1].map((i) => (
          <div key={i} className="rounded-lg border p-4 flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full" />

      {/* Tus datos */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormFieldSkeleton label="h-4 w-16" />
          <FormFieldSkeleton label="h-4 w-20" />
        </div>
        <FormFieldSkeleton label="h-4 w-36" />
      </div>

      <Skeleton className="h-px w-full" />

      {/* Ubicación */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormFieldSkeleton label="h-4 w-14" />
          <FormFieldSkeleton label="h-4 w-18" />
        </div>
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  )
}

function FormFieldSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Skeleton className={`${label} h-4`} />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  )
}
