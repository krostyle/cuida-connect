import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getUserWithProfile } from "@/actions/user"
import { CaregiverForm } from "@/components/onboarding/CaregiverForm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function OnboardingCaregiverPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const [user, clerkUser] = await Promise.all([
    getUserWithProfile(clerkId),
    currentUser(),
  ])

  if (!user) redirect("/onboarding")
  if (user.seekerProfile) redirect("/feed")
  if (user.caregiverProfile) redirect("/dashboard")

  return (
    <div className="space-y-6">
      <Link
        href="/onboarding"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-2 w-full sm:w-auto"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a selección de rol
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

      <CaregiverForm
        defaultFirstName={clerkUser?.firstName ?? ""}
        defaultLastName={clerkUser?.lastName ?? ""}
      />
    </div>
  )
}
