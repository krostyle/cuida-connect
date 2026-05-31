"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
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
  if (!clerkId) redirect("/sign-in")

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error("Usuario no encontrado. Vuelve a /onboarding.")

  await prisma.seekerProfile.create({
    data: {
      userId: user.id,
      forSelf: input.forSelf,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      elderFirstName: input.forSelf ? undefined : input.elderFirstName,
      elderLastName: input.forSelf ? undefined : input.elderLastName,
      elderAge: input.forSelf ? undefined : input.elderAge,
      elderCondition: input.forSelf ? undefined : input.elderCondition,
      region: input.region,
      comuna: input.comuna,
    },
  })

  redirect("/feed")
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
