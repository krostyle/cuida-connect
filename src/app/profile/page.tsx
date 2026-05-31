import { redirect } from "next/navigation"
import { Award, FileCheck } from "lucide-react"
import { getCaregiverProfileWithDocs } from "@/actions/profile"
import { AppHeader } from "@/components/layout/AppHeader"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { DocumentUpload } from "@/components/profile/DocumentUpload"
import { ActiveToggle } from "@/components/profile/ActiveToggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
  const user = await getCaregiverProfileWithDocs()

  if (!user || !user.caregiverProfile) redirect("/onboarding")
  if (user.role === "SEEKER") redirect("/feed")

  const profile = user.caregiverProfile
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()

  return (
    <>
      <AppHeader role="CAREGIVER" />

      <main className="mx-auto w-full max-w-2xl px-4 py-6 space-y-8">
        {/* Cabecera */}
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile.profileType === "PROFESSIONAL"
                  ? `${profile.title ?? "Profesional de salud"}`
                  : "Cuidador/a con experiencia"}
                {" · "}
                {profile.comuna}, {profile.region}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ActiveToggle isActive={profile.isActive} />
              {profile.isVerified && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 text-xs">
                  ✓ Verificado
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Editar datos del perfil */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Editar perfil</h2>
          </div>
          <ProfileForm profile={profile} />
        </section>

        <Separator />

        {/* Documentos y credenciales */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-semibold text-lg">Títulos y credenciales</h2>
              <p className="text-sm text-muted-foreground">
                Sube tus certificados, diplomas y títulos. Las familias podrán
                verlos en tu perfil.
              </p>
            </div>
          </div>
          <DocumentUpload documents={profile.documents} />
        </section>
      </main>
    </>
  )
}
