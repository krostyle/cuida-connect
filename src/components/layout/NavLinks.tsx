"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLink {
  href: string
  label: string
}

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors",
            pathname.startsWith(link.href)
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}
