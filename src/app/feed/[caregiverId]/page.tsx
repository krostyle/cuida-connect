import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Award, Phone } from "lucide-react"
import { getUserWithProfile } from "@/actions/user"
import { getCaregiverById } from "@/actions/caregiver"
import { getSentRequests } from "@/actions/requests"
import { ContactForm } from "@/components/feed/ContactForm"
import { AppHeader } from "@/components/layout/AppHeader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const AVAILABILITY_LABELS: Record<string, string> = {
  FULL_TIME: "Jornada completa",
  PART_TIME: "Medio tiempo",
  SHIFTS_24H: "Turno 24 horas",
}

export default async function CaregiverProfilePage({
  params,
}: {
  params: Promise<{ caregiverId: string }>
}) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)
  if (!user || !user.seekerProfile) redirect("/onboarding")
  if (user.role === "CAREGIVER") redirect("/dashboard")

  const { caregiverId } = await params
  const profile = await getCaregiverById(caregiverId)
  if (!profile) notFound()

  const sentRequests = await getSentRequests()
  const existingRequest = sentRequests.find(
    (req) => req.caregiverId === profile.user.id
  )

  const initials =
    `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()

  return (
    <>
      <AppHeader role="SEEKER" />

      <main className="mx-auto w-full max-w-2xl px-4 py-6 space-y-6">
        {/* Volver */}
        <Link
          href="/feed"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2 w-full sm:w-auto"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>

        {/* Cabecera del perfil */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Avatar className="w-20 h-20 shrink-0">
            <AvatarImage src={profile.photoUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {profile.profileType === "PROFESSIONAL"
                  ? "Con título"
                  : "Con experiencia"}
              </Badge>
              {profile.title && (
                <Badge variant="outline">{profile.title}</Badge>
              )}
              {profile.isVerified && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
                  ✓ Verificado
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Disponibilidad
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              {AVAILABILITY_LABELS[profile.availability]}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Experiencia
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Award className="w-4 h-4 text-primary" />
              {profile.yearsExperience}{" "}
              {profile.yearsExperience === 1 ? "año" : "años"}
            </div>
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Ubicación
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              {profile.comuna}, {profile.region}
            </div>
          </div>
        </div>

        <Separator />

        {/* Bio */}
        <div className="space-y-2">
          <h2 className="font-semibold">Sobre {profile.firstName}</h2>
          <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
        </div>

        <Separator />

        {/* Contacto */}
        <div className="space-y-4">
          <h2 className="font-semibold">Solicitar contacto</h2>

          {!existingRequest && (
            <ContactForm
              caregiverUserId={profile.user.id}
              caregiverName={profile.firstName}
            />
          )}

          {existingRequest?.status === "PENDING" && (
            <div className="rounded-xl border bg-muted/40 p-5 text-center space-y-1">
              <p className="font-semibold">Solicitud enviada</p>
              <p className="text-sm text-muted-foreground">
                Tu solicitud está pendiente de respuesta. Te avisaremos cuando{" "}
                {profile.firstName} responda.
              </p>
              <Link href="/requests" className="text-sm text-primary underline underline-offset-4">
                Ver mis solicitudes
              </Link>
            </div>
          )}

          {existingRequest?.status === "ACCEPTED" && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
              <p className="font-semibold text-primary">¡Solicitud aceptada!</p>
              <p className="text-sm text-muted-foreground">
                {profile.firstName} aceptó tu solicitud. Puedes contactarle
                directamente:
              </p>
              <div className="flex items-center gap-2 text-base font-semibold">
                <Phone className="w-4 h-4 text-primary" />
                {profile.phone}
              </div>
            </div>
          )}

          {existingRequest?.status === "REJECTED" && (
            <div className="rounded-xl border bg-muted/40 p-5 text-center space-y-1">
              <p className="font-semibold">Solicitud no aceptada</p>
              <p className="text-sm text-muted-foreground">
                {profile.firstName} no está disponible en este momento.
              </p>
              <Link href="/feed" className="text-sm text-primary underline underline-offset-4">
                Ver otros cuidadores
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
