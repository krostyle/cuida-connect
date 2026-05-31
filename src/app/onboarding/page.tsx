import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/actions/user"
import { RoleCard } from "@/components/onboarding/RoleCard"

export default async function OnboardingPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)

  if (user) {
    if (user.seekerProfile) redirect("/feed")
    if (user.caregiverProfile) redirect("/dashboard")
    if (user.role === "SEEKER") redirect("/onboarding/seeker")
    if (user.role === "CAREGIVER") redirect("/onboarding/caregiver")
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Bienvenido/a a CuidaConnect!
        </h1>
        <p className="text-muted-foreground text-lg">
          Cuéntanos cómo quieres usar la plataforma
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <RoleCard
          role="SEEKER"
          title="Busco un cuidador"
          description="Quiero encontrar un cuidador para mí o para un familiar adulto mayor"
          icon="heart"
        />
        <RoleCard
          role="CAREGIVER"
          title="Soy cuidador"
          description="Ofrezco mis servicios de cuidado a adultos mayores"
          icon="hands"
        />
      </div>
    </div>
  )
}
