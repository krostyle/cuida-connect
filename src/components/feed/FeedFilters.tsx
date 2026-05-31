"use client"

export interface FeedFiltersValue {
  region?: string
  comuna?: string
  profileType?: "PROFESSIONAL" | "EXPERIENCED"
  availability?: "FULL_TIME" | "PART_TIME" | "SHIFTS_24H"
}

interface FeedFiltersProps {
  value: FeedFiltersValue
  onChange: (value: FeedFiltersValue) => void
}

export function FeedFilters({ value, onChange }: FeedFiltersProps) {
  // Implementado en módulo: Feed
  return null
}
