import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/actions/user"
import { getCaregivers } from "@/actions/caregiver"
import { getSentRequests } from "@/actions/requests"
import { CaregiverCard } from "@/components/cards/CaregiverCard"
import { FeedFilters } from "@/components/feed/FeedFilters"
import { AppHeader } from "@/components/layout/AppHeader"
import { Users } from "lucide-react"
import type { CaregiverType, Availability, RequestStatus } from "@/generated/prisma"

type SearchParams = {
  region?: string
  profileType?: string
  availability?: string
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)
  if (!user || !user.seekerProfile) redirect("/onboarding")
  if (user.role === "CAREGIVER") redirect("/dashboard")

  const params = await searchParams

  const [caregivers, sentRequests] = await Promise.all([
    getCaregivers({
      region: params.region,
      profileType: params.profileType as CaregiverType | undefined,
      availability: params.availability as Availability | undefined,
    }),
    getSentRequests(),
  ])

  // Map User.id del cuidador → estado de la solicitud
  const requestStatusMap = new Map<string, RequestStatus>(
    sentRequests.map((req) => [req.caregiverId, req.status])
  )

  return (
    <>
      <AppHeader role="SEEKER" />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Encuentra tu cuidador</h1>
          <p className="text-muted-foreground text-sm">
            Revisa los perfiles, filtra por zona y solicita contacto cuando
            encuentres al indicado.
          </p>
        </div>

        <Suspense>
          <FeedFilters counts={caregivers.length} />
        </Suspense>

        {caregivers.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <Users className="w-10 h-10 opacity-30" />
            <div>
              <p className="font-medium">Sin resultados</p>
              <p className="text-sm">
                No hay cuidadores disponibles con esos filtros. Prueba
                ampliando la búsqueda.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caregivers.map((profile) => (
              <CaregiverCard
                key={profile.id}
                profile={profile}
                requestStatus={requestStatusMap.get(profile.user.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
