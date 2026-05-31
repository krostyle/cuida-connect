import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            CuidaConnect
          </Link>
          {/* Siempre visible para poder cerrar sesión aunque no se haya completado el onboarding */}
          <UserButton />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  )
}
