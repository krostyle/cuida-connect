import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Send } from "lucide-react"
import { getUserWithProfile } from "@/actions/user"
import { getSentRequests } from "@/actions/requests"
import { AppHeader } from "@/components/layout/AppHeader"
import { SentRequestCard } from "@/components/requests/SentRequestCard"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function RequestsPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await getUserWithProfile(clerkId)
  if (!user || !user.seekerProfile) redirect("/onboarding")
  if (user.role === "CAREGIVER") redirect("/dashboard")

  const requests = await getSentRequests()

  return (
    <>
      <AppHeader role="SEEKER" />

      <main className="mx-auto w-full max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Mis solicitudes</h1>
            <p className="text-muted-foreground text-sm">
              {requests.length}{" "}
              {requests.length === 1
                ? "solicitud enviada"
                : "solicitudes enviadas"}
            </p>
          </div>
          <Link
            href="/feed"
            className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
          >
            Ver cuidadores
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center text-muted-foreground">
            <Send className="w-10 h-10 opacity-30" />
            <div>
              <p className="font-medium">Aún no has contactado a ningún cuidador</p>
              <p className="text-sm">
                Explora el feed y solicita contacto cuando encuentres el indicado.
              </p>
            </div>
            <Link href="/feed" className={cn(buttonVariants({ size: "sm" }))}>
              Explorar cuidadores
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <SentRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
