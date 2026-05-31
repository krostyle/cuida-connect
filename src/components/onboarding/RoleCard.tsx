"use client"

import { useTransition } from "react"
import { Heart, HeartHandshake, CheckCircle2 } from "lucide-react"
import { setUserRole } from "@/actions/user"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RoleCardProps {
  role: "SEEKER" | "CAREGIVER"
  title: string
  description: string
  icon: "heart" | "hands"
  isSelected?: boolean
}

export function RoleCard({
  role,
  title,
  description,
  icon,
  isSelected = false,
}: RoleCardProps) {
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
      <Card
        className={cn(
          "h-full border-2 transition-all duration-200",
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "group-hover:border-primary/60 group-hover:shadow-md"
        )}
      >
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-primary/20"
                  : "bg-primary/10 group-hover:bg-primary/20"
              )}
            >
              {icon === "heart" ? (
                <Heart className="w-6 h-6 text-primary" />
              ) : (
                <HeartHandshake className="w-6 h-6 text-primary" />
              )}
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            )}
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-lg leading-tight">{title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
          {isSelected && !isPending && (
            <p className="text-primary text-sm font-medium">
              Seleccionado — haz clic para continuar →
            </p>
          )}
          {isPending && (
            <p className="text-muted-foreground text-sm">Cargando...</p>
          )}
        </CardContent>
      </Card>
    </button>
  )
}
