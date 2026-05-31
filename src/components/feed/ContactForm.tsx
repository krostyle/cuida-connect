"use client"

import { useState, useTransition } from "react"
import { sendContactRequest } from "@/actions/requests"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2 } from "lucide-react"

interface ContactFormProps {
  caregiverUserId: string
  caregiverName: string
}

export function ContactForm({ caregiverUserId, caregiverName }: ContactFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await sendContactRequest(caregiverUserId, message.trim() || undefined)
        setSent(true)
      } catch (err) {
        if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message)
        }
      }
    })
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-primary">¡Solicitud enviada!</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cuando {caregiverName} acepte, ambos recibirán el teléfono del otro.
            Puedes ver el estado en{" "}
            <a href="/requests" className="underline underline-offset-4">
              Mis solicitudes
            </a>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">
          Mensaje para {caregiverName}{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Cuéntale brevemente sobre la situación del adulto mayor, horarios preferidos u otras consideraciones..."
          className="resize-none"
          rows={4}
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground text-right">
          {message.length}/500
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Enviando solicitud...
          </span>
        ) : (
          "Solicitar contacto"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Tu teléfono solo será visible si {caregiverName} acepta la solicitud.
      </p>
    </form>
  )
}
