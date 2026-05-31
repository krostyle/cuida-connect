import { Calendar, MapPin, Phone, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RequestActionButtons } from "./RequestActionButtons"
import type { ContactRequest, User as PrismaUser, SeekerProfile } from "@/generated/prisma"

type ReceivedRequest = ContactRequest & {
  seeker: PrismaUser & { seekerProfile: SeekerProfile | null }
}

const STATUS_BADGE: Record<string, React.ReactNode> = {
  PENDING: (
    <Badge variant="outline" className="shrink-0 border-amber-300 bg-amber-50 text-amber-700 text-xs">
      Pendiente
    </Badge>
  ),
  ACCEPTED: (
    <Badge className="shrink-0 bg-green-600 text-xs">Aceptada ✓</Badge>
  ),
  REJECTED: (
    <Badge variant="secondary" className="shrink-0 opacity-60 text-xs">
      Rechazada
    </Badge>
  ),
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function ReceivedRequestCard({ request }: { request: ReceivedRequest }) {
  const profile = request.seeker.seekerProfile

  return (
    <Card className={request.status === "REJECTED" ? "opacity-60" : ""}>
      <CardContent className="p-4 space-y-3">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold truncate">
              {profile
                ? `${profile.firstName} ${profile.lastName}`
                : "Usuario"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 shrink-0" />
              {formatDate(request.createdAt)}
            </p>
          </div>
          {STATUS_BADGE[request.status]}
        </div>

        {/* Para quién es el cuidado */}
        {profile && (
          <div className="text-sm space-y-1">
            <p className="flex items-start gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {profile.forSelf ? (
                "El cuidado es para sí mismo/a"
              ) : (
                <span>
                  Gestiona el cuidado de{" "}
                  <span className="text-foreground font-medium">
                    {profile.elderFirstName
                      ? `${profile.elderFirstName}${profile.elderLastName ? " " + profile.elderLastName : ""}${profile.elderAge ? ", " + profile.elderAge + " años" : ""}`
                      : "un familiar"}
                  </span>
                </span>
              )}
            </p>
            {!profile.forSelf && profile.elderCondition && (
              <p className="text-xs text-muted-foreground pl-5">
                <span className="font-medium text-foreground">Condición: </span>
                {profile.elderCondition}
              </p>
            )}
            {profile.region && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                {profile.comuna}, {profile.region}
              </p>
            )}
          </div>
        )}

        {/* Mensaje */}
        {request.message && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">Mensaje</p>
            <p className="text-sm">{request.message}</p>
          </div>
        )}

        {/* Teléfono del seeker (solo si aceptada) */}
        {request.status === "ACCEPTED" && profile && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Contacto de {profile.firstName}
              </p>
              <p className="font-semibold text-primary">{profile.phone}</p>
            </div>
          </div>
        )}

        {/* Botones aceptar/rechazar */}
        {request.status === "PENDING" && (
          <RequestActionButtons requestId={request.id} />
        )}
      </CardContent>
    </Card>
  )
}
