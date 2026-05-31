import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getUserWithProfile } from "@/actions/user"
import { SeekerForm } from "@/components/onboarding/SeekerForm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function OnboardingSeekerPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)

  if (!user) redirect("/onboarding")
  if (user.caregiverProfile) redirect("/dashboard")
  if (user.seekerProfile) redirect("/feed")

  return (
    <div className="space-y-6">
      {/* Botón volver — prominente y mobile-first */}
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
          Paso 2 de 2 — Buscador de cuidador
        </p>
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
