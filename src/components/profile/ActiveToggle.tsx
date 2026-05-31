"use client"

import { useTransition } from "react"
import { toggleCaregiverActive } from "@/actions/profile"
import { Spinner } from "@/components/ui/spinner"

export function ActiveToggle({ isActive }: { isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    startTransition(async () => {
      await toggleCaregiverActive(!isActive)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-muted text-muted-foreground hover:bg-muted/80",
      ].join(" ")}
    >
      {isPending ? (
        <Spinner className="w-3.5 h-3.5" />
      ) : (
        <span
          className={[
            "w-2 h-2 rounded-full",
            isActive ? "bg-green-600" : "bg-muted-foreground/50",
          ].join(" ")}
        />
      )}
      {isActive ? "Visible en el feed" : "Oculto del feed"}
    </button>
  )
}
