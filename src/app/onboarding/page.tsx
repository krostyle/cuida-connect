import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/actions/user"
import { RoleCard } from "@/components/onboarding/RoleCard"
import type { Role } from "@/generated/prisma"

export default async function OnboardingPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)

  // Perfil ya completo → saltar al área correcta
  if (user?.seekerProfile) redirect("/feed")
  if (user?.caregiverProfile) redirect("/dashboard")

  // Si tiene rol pero sin perfil → mostrar selección con su rol actual destacado
  // (permite cambiar de rol antes de completar el formulario)
  const currentRole: Role | null = user?.role ?? null

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">Paso 1 de 2</p>
        <h1 className="text-3xl font-bold tracking-tight">
          {currentRole ? "Cambia tu tipo de perfil" : "¡Bienvenido/a a CuidaConnect!"}
        </h1>
        <p className="text-muted-foreground">
          {currentRole
            ? "Selecciona el tipo de perfil que quieres crear"
            : "¿Cómo quieres usar la plataforma?"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <RoleCard
          role="SEEKER"
          title="Busco un cuidador"
          description="Quiero encontrar un cuidador para mí o para un familiar adulto mayor"
          icon="heart"
          isSelected={currentRole === "SEEKER"}
        />
        <RoleCard
          role="CAREGIVER"
          title="Soy cuidador"
          description="Ofrezco mis servicios de cuidado a adultos mayores"
          icon="hands"
          isSelected={currentRole === "CAREGIVER"}
        />
      </div>
    </div>
  )
}
