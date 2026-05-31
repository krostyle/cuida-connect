import Link from "next/link"
import { Calendar, MapPin, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ContactRequest, User, CaregiverProfile } from "@/generated/prisma"

type SentRequest = ContactRequest & {
  caregiver: User & { caregiverProfile: CaregiverProfile | null }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function SentRequestCard({ request }: { request: SentRequest }) {
  const profile = request.caregiver.caregiverProfile
  if (!profile) return null

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()

  return (
    <Card className={request.status === "REJECTED" ? "opacity-60" : ""}>
      <CardContent className="p-4 space-y-3">
        {/* Cabecera */}
        <div className="flex items-start gap-3">
          <Link href={`/feed/${profile.id}`}>
            <Avatar className="w-12 h-12 shrink-0">
              <AvatarImage src={profile.photoUrl ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/feed/${profile.id}`}
                  className="font-semibold hover:text-primary transition-colors truncate block"
                >
                  {profile.firstName} {profile.lastName}
                </Link>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {profile.comuna}, {profile.region}
                </p>
              </div>

              {request.status === "PENDING" && (
                <Badge
                  variant="outline"
                  className="shrink-0 border-amber-300 bg-amber-50 text-amber-700 text-xs"
                >
                  Pendiente
                </Badge>
              )}
              {request.status === "ACCEPTED" && (
                <Badge className="shrink-0 bg-green-600 text-xs">
                  Aceptada ✓
                </Badge>
              )}
              {request.status === "REJECTED" && (
                <Badge variant="secondary" className="shrink-0 text-xs opacity-70">
                  No aceptada
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje enviado */}
        {request.message && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Tu mensaje
            </p>
            <p className="text-sm">{request.message}</p>
          </div>
        )}

        {/* Fecha */}
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3 shrink-0" />
          Enviada el {formatDate(request.createdAt)}
        </p>

        {/* Teléfono del cuidador (solo si aceptada) */}
        {request.status === "ACCEPTED" && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                ¡{profile.firstName} aceptó! Puedes contactarle directamente:
              </p>
              <p className="font-semibold text-primary">{profile.phone}</p>
            </div>
          </div>
        )}

        {/* Rechazada — acción alternativa */}
        {request.status === "REJECTED" && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {profile.firstName} no está disponible.
            </p>
            <Link
              href="/feed"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "shrink-0 text-xs")}
            >
              Ver otros cuidadores
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
