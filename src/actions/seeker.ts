"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface CreateSeekerProfileInput {
  forSelf: boolean
  firstName: string
  lastName: string
  phone: string
  elderFirstName?: string
  elderLastName?: string
  elderAge?: number
  elderCondition?: string
  region: string
  comuna: string
}

export async function createSeekerProfile(input: CreateSeekerProfileInput) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error("No autenticado")

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error("Usuario no encontrado")

  return prisma.seekerProfile.create({
    data: { ...input, userId: user.id },
  })
}

export async function getSeekerProfile() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { seekerProfile: true },
  })

  return user?.seekerProfile ?? null
}
