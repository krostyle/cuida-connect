import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Heart, HeartHandshake, Search, MessageCircle, Phone, CheckCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect("/onboarding")

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold text-primary">CuidaConnect</span>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 py-20 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              El cuidador ideal para tu ser querido,{" "}
              <span className="text-primary">cuando más lo necesitas</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              CuidaConnect conecta familias chilenas con cuidadores de confianza
              para adultos mayores. Busca, compara y contacta — sin
              intermediarios.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto px-8")}
              >
                Registrarse gratis
              </Link>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "w-full sm:w-auto px-8"
                )}
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </section>

        {/* Dos caminos */}
        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="mb-10 text-center text-2xl font-bold">
              ¿Cómo quieres usar CuidaConnect?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-8 space-y-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Busco un cuidador</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Para mí o para un familiar adulto mayor
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    Explora perfiles verificados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    Filtra por zona, disponibilidad y tipo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    Contacto directo sin costo
                  </li>
                </ul>
                <Link href="/sign-up" className={cn(buttonVariants(), "w-full justify-center")}>
                  Buscar cuidador
                </Link>
              </div>

              <div className="rounded-2xl border bg-card p-8 space-y-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Soy cuidador</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Profesional o con experiencia en adultos mayores
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    Publica tu perfil en minutos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    Recibe solicitudes de familias cercanas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    Tú decides a quién aceptas
                  </li>
                </ul>
                <Link href="/sign-up" className={cn(buttonVariants(), "w-full justify-center")}>
                  Publicar mi perfil
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-bold">Así funciona</h2>
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">1. Crea tu perfil</h3>
              <p className="text-sm text-muted-foreground">
                Regístrate y cuéntanos si buscas cuidado o lo ofreces. El
                asistente te guía paso a paso.
              </p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">2. Conecta</h3>
              <p className="text-sm text-muted-foreground">
                Las familias solicitan contacto al cuidador. Él acepta o rechaza
                según su disponibilidad.
              </p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">3. Habla directo</h3>
              <p className="text-sm text-muted-foreground">
                Al confirmar el match, ambas partes reciben el teléfono del otro
                para coordinar sin intermediarios.
              </p>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t bg-primary/5">
          <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
            <h2 className="text-2xl font-bold">¿Listo para comenzar?</h2>
            <p className="text-muted-foreground">
              Regístrate gratis — es rápido y sin compromiso.
            </p>
            <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }), "px-10")}>
              Crear cuenta gratis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CuidaConnect — Hecho con cuidado en Chile
      </footer>
    </div>
  )
}
