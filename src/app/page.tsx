import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          CuidaConnect
        </h1>
        <p className="text-xl text-muted-foreground">
          Conectamos familias con cuidadores de confianza en Chile
        </p>
      </div>

      <p className="max-w-xl text-muted-foreground">
        Encuentra el cuidador ideal para tu adulto mayor o muestra tu
        experiencia como cuidador profesional. Simple, directo, confiable.
      </p>

      <div className="flex gap-4">
        <Link
          href="/sign-up"
          className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Comenzar
        </Link>
        <Link
          href="/sign-in"
          className="rounded-md border border-input px-6 py-3 text-sm font-semibold hover:bg-accent"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  )
}
