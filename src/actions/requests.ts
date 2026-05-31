"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function sendContactRequest(caregiverUserId: string, message?: string) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error("No autenticado")

  const seeker = await prisma.user.findUnique({ where: { clerkId } })
  if (!seeker) throw new Error("Usuario no encontrado")

  const existing = await prisma.contactRequest.findFirst({
    where: { seekerId: seeker.id, caregiverId: caregiverUserId },
  })
  if (existing) throw new Error("Ya enviaste una solicitud a este cuidador")

  return prisma.contactRequest.create({
    data: { seekerId: seeker.id, caregiverId: caregiverUserId, message },
  })
}

export async function respondToRequest(requestId: string, accept: boolean) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error("No autenticado")

  const caregiver = await prisma.user.findUnique({ where: { clerkId } })
  if (!caregiver) throw new Error("Usuario no encontrado")

  const request = await prisma.contactRequest.findUnique({ where: { id: requestId } })
  if (!request || request.caregiverId !== caregiver.id) throw new Error("Solicitud no encontrada")

  return prisma.contactRequest.update({
    where: { id: requestId },
    data: { status: accept ? "ACCEPTED" : "REJECTED" },
  })
}

export async function getSentRequests() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  return prisma.contactRequest.findMany({
    where: { seekerId: user.id },
    include: {
      caregiver: { include: { caregiverProfile: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getReceivedRequests() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  return prisma.contactRequest.findMany({
    where: { caregiverId: user.id },
    include: {
      seeker: { include: { seekerProfile: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
