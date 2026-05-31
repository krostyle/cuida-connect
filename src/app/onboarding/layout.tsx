import Link from "next/link"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-5 px-6 border-b border-border/50">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-bold text-xl text-primary">
            CuidaConnect
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  )
}
