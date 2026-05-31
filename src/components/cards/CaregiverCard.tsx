import Link from "next/link"
import { MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CaregiverProfile, User, RequestStatus } from "@/generated/prisma"

const AVAILABILITY_LABELS: Record<string, string> = {
  FULL_TIME: "Jornada completa",
  PART_TIME: "Medio tiempo",
  SHIFTS_24H: "Turno 24h",
}

interface CaregiverCardProps {
  profile: CaregiverProfile & { user: User }
  requestStatus?: RequestStatus
}

export function CaregiverCard({ profile, requestStatus }: CaregiverCardProps) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()

  return (
    <article className="rounded-xl border bg-card flex flex-col overflow-hidden">
      {/* Área clicable → lleva al perfil completo */}
      <Link
        href={`/feed/${profile.id}`}
        className="flex-1 block p-4 space-y-3 hover:bg-muted/30 transition-colors"
      >
        {/* Avatar + nombre */}
        <div className="flex items-start gap-3">
          <Avatar className="w-14 h-14 shrink-0">
            <AvatarImage src={profile.photoUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight truncate">
              {profile.firstName} {profile.lastName}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <Badge variant="secondary" className="text-xs">
                {profile.profileType === "PROFESSIONAL"
                  ? "Con título"
                  : "Con experiencia"}
              </Badge>
              {profile.isVerified && (
                <Badge className="text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
                  ✓ Verificado
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{AVAILABILITY_LABELS[profile.availability]}</span>
            <span className="text-border mx-0.5">·</span>
            <span>
              {profile.yearsExperience}{" "}
              {profile.yearsExperience === 1 ? "año" : "años"} exp.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {profile.comuna}, {profile.region}
            </span>
          </div>
        </div>
      </Link>

      {/* Botón de acción — separado del Link para no anidar anchors */}
      <div className="px-4 pb-4">
        {!requestStatus && (
          <Link
            href={`/feed/${profile.id}`}
            className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}
          >
            Solicitar contacto
          </Link>
        )}
        {requestStatus === "PENDING" && (
          <div
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center opacity-70 pointer-events-none"
            )}
          >
            Solicitud enviada
          </div>
        )}
        {requestStatus === "ACCEPTED" && (
          <Link
            href="/requests"
            className={cn(
              buttonVariants({ size: "sm" }),
              "w-full justify-center bg-green-600 hover:bg-green-700"
            )}
          >
            ✓ Contacto habilitado
          </Link>
        )}
        {requestStatus === "REJECTED" && (
          <div
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center opacity-40 pointer-events-none"
            )}
          >
            No disponible
          </div>
        )}
      </div>
    </article>
  )
}
