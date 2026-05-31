"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { CaregiverType, Availability } from "@/generated/prisma/client"

export interface CreateCaregiverProfileInput {
  firstName: string
  lastName: string
  phone: string
  bio: string
  profileType: CaregiverType
  title?: string
  titleDocUrl?: string
  yearsExperience: number
  availability: Availability
  region: string
  comuna: string
  photoUrl?: string
}

export async function createCaregiverProfile(input: CreateCaregiverProfileInput) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error("No autenticado")

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error("Usuario no encontrado")

  return prisma.caregiverProfile.create({
    data: { ...input, userId: user.id },
  })
}

export interface FeedFilters {
  region?: string
  comuna?: string
  profileType?: CaregiverType
  availability?: Availability
}

export async function getCaregivers(filters: FeedFilters = {}) {
  return prisma.caregiverProfile.findMany({
    where: {
      isActive: true,
      ...(filters.region && { region: filters.region }),
      ...(filters.comuna && { comuna: filters.comuna }),
      ...(filters.profileType && { profileType: filters.profileType }),
      ...(filters.availability && { availability: filters.availability }),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCaregiverById(caregiverId: string) {
  return prisma.caregiverProfile.findUnique({
    where: { id: caregiverId, isActive: true },
    include: { user: true },
  })
}
