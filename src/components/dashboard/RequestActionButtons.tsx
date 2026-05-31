"use client"

import { useTransition } from "react"
import { Check, X } from "lucide-react"
import { respondToRequest } from "@/actions/requests"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function RequestActionButtons({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition()

  const handle = (accept: boolean) => {
    startTransition(async () => {
      await respondToRequest(requestId, accept)
    })
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="flex-1 gap-1.5"
        onClick={() => handle(true)}
        disabled={isPending}
      >
        {isPending ? (
          <Spinner className="w-3.5 h-3.5" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
        Aceptar
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex-1 gap-1.5"
        onClick={() => handle(false)}
        disabled={isPending}
      >
        <X className="w-3.5 h-3.5" />
        Rechazar
      </Button>
    </div>
  )
}
