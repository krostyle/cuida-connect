"use client"

import { useTransition } from "react"
import { Heart, HeartHandshake } from "lucide-react"
import { setUserRole } from "@/actions/user"
import { Card, CardContent } from "@/components/ui/card"

interface RoleCardProps {
  role: "SEEKER" | "CAREGIVER"
  title: string
  description: string
  icon: "heart" | "hands"
}

export function RoleCard({ role, title, description, icon }: RoleCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await setUserRole(role)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-left w-full group disabled:opacity-60"
    >
      <Card className="h-full border-2 transition-all duration-200 group-hover:border-primary group-hover:shadow-md group-focus-visible:border-primary">
        <CardContent className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
            {icon === "heart" ? (
              <Heart className="w-6 h-6 text-primary" />
            ) : (
              <HeartHandshake className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-lg leading-tight">{title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
          {isPending && (
            <p className="text-primary text-sm font-medium">Cargando...</p>
          )}
        </CardContent>
      </Card>
    </button>
  )
}
