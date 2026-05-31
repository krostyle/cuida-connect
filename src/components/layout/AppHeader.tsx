import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { NavLinks } from "./NavLinks"
import type { Role } from "@/generated/prisma"

const SEEKER_LINKS = [
  { href: "/feed", label: "Cuidadores" },
  { href: "/requests", label: "Mis solicitudes" },
]

const CAREGIVER_LINKS = [
  { href: "/dashboard", label: "Panel" },
  { href: "/profile", label: "Mi perfil" },
]

export function AppHeader({ role }: { role: Role }) {
  const links = role === "SEEKER" ? SEEKER_LINKS : CAREGIVER_LINKS
  const home = role === "SEEKER" ? "/feed" : "/dashboard"

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={home} className="font-bold text-lg text-primary">
          CuidaConnect
        </Link>

        <nav className="flex items-center gap-5">
          <NavLinks links={links} />
          <UserButton />
        </nav>
      </div>
    </header>
  )
}
