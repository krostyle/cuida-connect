"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { REGIONES_CHILE } from "@/data/chile-regions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ALL = "ALL"

const PROFILE_TYPE_LABELS: Record<string, string> = {
  ALL: "Cualquier tipo",
  PROFESSIONAL: "Con título",
  EXPERIENCED: "Con experiencia",
}

const AVAILABILITY_LABELS: Record<string, string> = {
  ALL: "Cualquier disponibilidad",
  FULL_TIME: "Jornada completa",
  PART_TIME: "Medio tiempo",
  SHIFTS_24H: "Turno 24 horas",
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
        {/* Región — el valor ya es el nombre completo, no necesita mapeo */}
        <Select
          value={region}
          onValueChange={(v) => updateFilter("region", v ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-50">
            <span className="flex-1 text-left text-sm">
              {region === ALL ? (
                <span className="text-muted-foreground">Todas las regiones</span>
              ) : (
                region
              )}
            </span>
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

        {/* Tipo de perfil */}
        <Select
          value={profileType}
          onValueChange={(v) => updateFilter("profileType", v ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-45">
            <span className="flex-1 text-left text-sm">
              {profileType === ALL ? (
                <span className="text-muted-foreground">Cualquier tipo</span>
              ) : (
                PROFILE_TYPE_LABELS[profileType]
              )}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Cualquier tipo</SelectItem>
            <SelectItem value="PROFESSIONAL">Con título</SelectItem>
            <SelectItem value="EXPERIENCED">Con experiencia</SelectItem>
          </SelectContent>
        </Select>

        {/* Disponibilidad */}
        <Select
          value={availability}
          onValueChange={(v) => updateFilter("availability", v ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-50">
            <span className="flex-1 text-left text-sm">
              {availability === ALL ? (
                <span className="text-muted-foreground">
                  Cualquier disponibilidad
                </span>
              ) : (
                AVAILABILITY_LABELS[availability]
              )}
            </span>
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
