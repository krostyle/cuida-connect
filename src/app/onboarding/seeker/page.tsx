import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/actions/user"
import { SeekerForm } from "@/components/onboarding/SeekerForm"

export default async function OnboardingSeekerPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)

  if (!user) redirect("/onboarding")
  if (user.caregiverProfile) redirect("/dashboard")
  if (user.seekerProfile) redirect("/feed")

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">Paso 2 de 2</p>
        <h1 className="text-2xl font-bold tracking-tight">
          Completa tu perfil
        </h1>
        <p className="text-muted-foreground">
          Cuéntanos sobre ti para conectarte con el cuidador ideal
        </p>
      </div>

      <SeekerForm />
    </div>
  )
}
