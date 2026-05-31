import type { ContactRequest } from "@/generated/prisma"

interface RequestCardProps {
  request: ContactRequest
  role: "SEEKER" | "CAREGIVER"
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
}

export function RequestCard({ request, role, onAccept, onReject }: RequestCardProps) {
  // Implementado en módulo: Solicitudes
  return null
}
