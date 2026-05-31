"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import type { Role } from "@/generated/prisma"

export async function getUserWithProfile(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    include: { seekerProfile: true, caregiverProfile: true },
  })
}

export async function setUserRole(role: Role) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  await prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, role },
    update: { role },
  })

  redirect(role === "SEEKER" ? "/onboarding/seeker" : "/onboarding/caregiver")
}
