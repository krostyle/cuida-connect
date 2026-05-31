import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingCaregiverLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>

      {/* Tipo de perfil */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        {[0, 1].map((i) => (
          <div key={i} className="rounded-lg border p-4 flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full" />

      {/* Datos personales */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Disponibilidad */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Ubicación */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-18" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  )
}
