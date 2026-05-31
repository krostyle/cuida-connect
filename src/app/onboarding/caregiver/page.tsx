import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getUserWithProfile } from "@/actions/user"
import { CaregiverForm } from "@/components/onboarding/CaregiverForm"

export default async function OnboardingCaregiverPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)

  if (!user) redirect("/onboarding")
  if (user.seekerProfile) redirect("/feed")
  if (user.caregiverProfile) redirect("/dashboard")

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Cambiar tipo de perfil
        </Link>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            Paso 2 de 2 — Cuidador
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Crea tu perfil de cuidador
          </h1>
          <p className="text-muted-foreground">
            Tu perfil es lo que las familias verán al buscarte
          </p>
        </div>
      </div>

      <CaregiverForm />
    </div>
  )
}
