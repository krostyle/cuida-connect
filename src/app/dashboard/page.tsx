import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Inbox } from "lucide-react"
import { getUserWithProfile } from "@/actions/user"
import { getReceivedRequests } from "@/actions/requests"
import { AppHeader } from "@/components/layout/AppHeader"
import { ReceivedRequestCard } from "@/components/dashboard/ReceivedRequestCard"

export default async function DashboardPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)
  if (!user || !user.caregiverProfile) redirect("/onboarding")
  if (user.role === "SEEKER") redirect("/feed")

  const requests = await getReceivedRequests()

  const pending = requests.filter((r) => r.status === "PENDING")
  const sorted = [
    ...pending,
    ...requests.filter((r) => r.status === "ACCEPTED"),
    ...requests.filter((r) => r.status === "REJECTED"),
  ]

  return (
    <>
      <AppHeader role="CAREGIVER" />

      <main className="mx-auto w-full max-w-2xl px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Panel del cuidador</h1>
          <p className="text-muted-foreground text-sm">
            Bienvenido/a,{" "}
            <span className="font-medium text-foreground">
              {user.caregiverProfile.firstName}
            </span>
            .{" "}
            {pending.length > 0 ? (
              <span className="text-primary font-medium">
                Tienes {pending.length} solicitud
                {pending.length !== 1 ? "es" : ""} pendiente
                {pending.length !== 1 ? "s" : ""}.
              </span>
            ) : (
              "Estás al día con todas tus solicitudes."
            )}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <Inbox className="w-10 h-10 opacity-30" />
            <div>
              <p className="font-medium">Sin solicitudes todavía</p>
              <p className="text-sm">
                Cuando una familia solicite tu contacto, aparecerá aquí.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((request) => (
              <ReceivedRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
