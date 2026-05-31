import type { CaregiverProfile } from "@/generated/prisma"

interface CaregiverCardProps {
  profile: CaregiverProfile
  hasPendingRequest?: boolean
}

export function CaregiverCard({ profile, hasPendingRequest }: CaregiverCardProps) {
  // Implementado en módulo: Feed
  return null
}
