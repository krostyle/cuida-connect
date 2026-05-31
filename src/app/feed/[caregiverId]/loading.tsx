import { Skeleton } from "@/components/ui/skeleton"

export default function CaregiverProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      {/* Volver */}
      <Skeleton className="h-9 w-28 rounded-lg" />

      {/* Cabecera del perfil */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Skeleton className="w-24 h-24 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-48" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </div>

      {/* Botón de solicitud */}
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  )
}
