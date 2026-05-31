"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { put, del } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import type { CaregiverType, Availability, DocumentType } from "@/generated/prisma"

// ─── Obtener perfil con documentos ─────────────────────────────────────────

export async function getCaregiverProfileWithDocs() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  return prisma.user.findUnique({
    where: { clerkId },
    include: {
      caregiverProfile: {
        include: { documents: { orderBy: { createdAt: "asc" } } },
      },
    },
  })
}

// ─── Actualizar perfil ──────────────────────────────────────────────────────

export interface UpdateProfileInput {
  firstName: string
  lastName: string
  phone: string
  bio: string
  profileType: CaregiverType
  title?: string
  yearsExperience: number
  availability: Availability
  region: string
  comuna: string
}

export async function updateCaregiverProfile(input: UpdateProfileInput) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error("Usuario no encontrado")

  await prisma.caregiverProfile.update({
    where: { userId: user.id },
    data: {
      ...input,
      title: input.profileType === "PROFESSIONAL" ? input.title : null,
    },
  })

  revalidatePath("/profile")
  revalidatePath("/feed")
}

// ─── Toggle activo / inactivo ───────────────────────────────────────────────

export async function toggleCaregiverActive(isActive: boolean) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error("Usuario no encontrado")

  await prisma.caregiverProfile.update({
    where: { userId: user.id },
    data: { isActive },
  })

  revalidatePath("/profile")
  revalidatePath("/feed")
}

// ─── Subir documento ───────────────────────────────────────────────────────

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  TITLE: "Título",
  DIPLOMA: "Diploma",
  COURSE: "Curso",
  CERTIFICATE: "Certificado",
  OTHER: "Otro",
}

export async function uploadCaregiverDocument(formData: FormData) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { caregiverProfile: true },
  })
  if (!user?.caregiverProfile) throw new Error("Perfil no encontrado")

  const file = formData.get("file") as File
  const docType = formData.get("docType") as DocumentType
  const name = (formData.get("name") as string) || DOC_TYPE_LABELS[docType]

  if (!file || file.size === 0) throw new Error("Selecciona un archivo")
  if (file.size > 10 * 1024 * 1024) throw new Error("El archivo no puede superar 10 MB")

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Solo se permiten PDF, JPG, PNG o WEBP")
  }

  const ext = file.name.split(".").pop()
  const filename = `cuida-connect/docs/${user.caregiverProfile.id}/${Date.now()}.${ext}`

  const blob = await put(filename, file, { access: "public" })

  await prisma.caregiverDocument.create({
    data: {
      profileId: user.caregiverProfile.id,
      name,
      url: blob.url,
      fileType: file.type.startsWith("image/") ? "image" : "pdf",
      docType,
    },
  })

  revalidatePath("/profile")
}

// ─── Eliminar documento ────────────────────────────────────────────────────

export async function deleteCaregiverDocument(documentId: string) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { caregiverProfile: true },
  })
  if (!user?.caregiverProfile) throw new Error("Perfil no encontrado")

  const doc = await prisma.caregiverDocument.findUnique({ where: { id: documentId } })
  if (!doc || doc.profileId !== user.caregiverProfile.id) {
    throw new Error("Documento no encontrado")
  }

  // Eliminar del Blob storage
  await del(doc.url)

  await prisma.caregiverDocument.delete({ where: { id: documentId } })

  revalidatePath("/profile")
}
