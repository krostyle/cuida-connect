"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { REGIONES_CHILE } from "@/data/chile-regions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ALL = "ALL"

export interface FeedFiltersValue {
  region?: string
  profileType?: string
  availability?: string
}

export function FeedFilters({ counts }: { counts: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const region = searchParams.get("region") ?? ALL
  const profileType = searchParams.get("profileType") ?? ALL
  const availability = searchParams.get("availability") ?? ALL

  const hasFilters = region !== ALL || profileType !== ALL || availability !== ALL

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== ALL) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key === "region") params.delete("comuna")
    router.push(`/feed?${params.toString()}`)
  }

  const clearFilters = () => router.push("/feed")

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Select
          value={region}
          onValueChange={(v) => updateFilter("region", v ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-50">
            <SelectValue placeholder="Todas las regiones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las regiones</SelectItem>
            {REGIONES_CHILE.map((r) => (
              <SelectItem key={r.nombre} value={r.nombre}>
                {r.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={profileType}
          onValueChange={(v) => updateFilter("profileType", v ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Cualquier tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Cualquier tipo</SelectItem>
            <SelectItem value="PROFESSIONAL">Con título</SelectItem>
            <SelectItem value="EXPERIENCED">Con experiencia</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={availability}
          onValueChange={(v) => updateFilter("availability", v ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-50">
            <SelectValue placeholder="Cualquier disponibilidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Cualquier disponibilidad</SelectItem>
            <SelectItem value="FULL_TIME">Jornada completa</SelectItem>
            <SelectItem value="PART_TIME">Medio tiempo</SelectItem>
            <SelectItem value="SHIFTS_24H">Turno 24 horas</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5 text-muted-foreground"
            )}
          >
            <X className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {counts} {counts === 1 ? "cuidador disponible" : "cuidadores disponibles"}
        {hasFilters && " con estos filtros"}
      </p>
    </div>
  )
}
