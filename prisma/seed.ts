/**
 * Seed de datos ficticios para desarrollo y demo.
 * Ejecutar: npm run seed
 *
 * Crea:
 * - 8 cuidadores ficticios (para el feed)
 * - 5 buscadores ficticios
 * - Solicitudes de contacto en distintos estados hacia TODOS
 *   los cuidadores reales que ya existen en la DB
 */

import { PrismaClient } from "../src/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

// ─── Datos ficticios ────────────────────────────────────────────────────────

const FAKE_CAREGIVERS = [
  {
    clerkId: "seed_cg_001",
    firstName: "Carmen",
    lastName: "Silva Rojas",
    phone: "+56 9 7821 3456",
    profileType: "PROFESSIONAL" as const,
    title: "TENS",
    bio: "Soy Técnico en Enfermería con 12 años de experiencia en el cuidado de adultos mayores. Me especializo en pacientes con Alzheimer y enfermedades crónicas. Mi enfoque es mantener la dignidad y calidad de vida de cada persona a mi cuidado.",
    yearsExperience: 12,
    availability: "FULL_TIME" as const,
    region: "Metropolitana de Santiago",
    comuna: "Las Condes",
    isVerified: true,
  },
  {
    clerkId: "seed_cg_002",
    firstName: "Rosa",
    lastName: "Morales Castro",
    phone: "+56 9 6543 2109",
    profileType: "EXPERIENCED" as const,
    bio: "Llevo 8 años cuidando adultos mayores en hogares particulares. Tengo gran vocación por el servicio y paciencia infinita. Me especializo en compañía, higiene y administración de medicamentos bajo supervisión médica.",
    yearsExperience: 8,
    availability: "PART_TIME" as const,
    region: "Metropolitana de Santiago",
    comuna: "Providencia",
    isVerified: false,
  },
  {
    clerkId: "seed_cg_003",
    firstName: "Patricia",
    lastName: "Vega Muñoz",
    phone: "+56 9 9123 4567",
    profileType: "PROFESSIONAL" as const,
    title: "Enfermera",
    bio: "Enfermera titulada con especialización en geriatría. Trabajo hace 15 años en el área de cuidados domiciliarios. Ofrezco atención integral: control de signos vitales, curaciones, sondas y acompañamiento emocional a la familia.",
    yearsExperience: 15,
    availability: "FULL_TIME" as const,
    region: "Metropolitana de Santiago",
    comuna: "Maipú",
    isVerified: true,
  },
  {
    clerkId: "seed_cg_004",
    firstName: "María",
    lastName: "González Pérez",
    phone: "+56 9 8234 5678",
    profileType: "EXPERIENCED" as const,
    bio: "He cuidado a mis propios padres y a tres familias más durante los últimos 6 años. Soy muy organizada, cariñosa y responsable. Manejo bien situaciones de emergencia y soy de fácil trato con personas mayores.",
    yearsExperience: 6,
    availability: "SHIFTS_24H" as const,
    region: "Metropolitana de Santiago",
    comuna: "Santiago",
    isVerified: false,
  },
  {
    clerkId: "seed_cg_005",
    firstName: "Ana",
    lastName: "Hernández López",
    phone: "+56 9 5678 9012",
    profileType: "PROFESSIONAL" as const,
    title: "TENS",
    bio: "TENS con 9 años de experiencia en hospitales y domicilios. Me apasiona acompañar a los adultos mayores en su día a día, brindando cuidados de salud y fomentando su autonomía. Tengo experiencia con pacientes con Parkinson y secuelas de ACV.",
    yearsExperience: 9,
    availability: "FULL_TIME" as const,
    region: "Metropolitana de Santiago",
    comuna: "Ñuñoa",
    isVerified: false,
  },
  {
    clerkId: "seed_cg_006",
    firstName: "José",
    lastName: "Muñoz Ramírez",
    phone: "+56 9 4321 0987",
    profileType: "EXPERIENCED" as const,
    bio: "Soy un cuidador masculino con 5 años de experiencia, especializado en el apoyo físico a adultos mayores con movilidad reducida. Realizo traslados, ejercicios de rehabilitación y acompañamiento a controles médicos. Tengo formación en primeros auxilios.",
    yearsExperience: 5,
    availability: "PART_TIME" as const,
    region: "Metropolitana de Santiago",
    comuna: "San Bernardo",
    isVerified: false,
  },
  {
    clerkId: "seed_cg_007",
    firstName: "Claudia",
    lastName: "Torres Díaz",
    phone: "+56 9 3210 8765",
    profileType: "PROFESSIONAL" as const,
    title: "Técnico en Enfermería",
    bio: "Técnico en Enfermería certificada con 11 años en cuidados domiciliarios de alto nivel. Me especializo en adultos mayores con múltiples patologías. Soy metódica, discreta y muy comprometida con el bienestar de mis pacientes y sus familias.",
    yearsExperience: 11,
    availability: "FULL_TIME" as const,
    region: "Metropolitana de Santiago",
    comuna: "Vitacura",
    isVerified: true,
  },
  {
    clerkId: "seed_cg_008",
    firstName: "Elena",
    lastName: "Ramírez Soto",
    phone: "+56 9 2109 6543",
    profileType: "EXPERIENCED" as const,
    bio: "Tengo 7 años cuidando personas mayores en turnos de 24 horas. Soy muy responsable y tranquila en situaciones difíciles. Me adapto fácilmente a las rutinas de cada paciente y tengo experiencia con alimentación especial y demencias leves.",
    yearsExperience: 7,
    availability: "SHIFTS_24H" as const,
    region: "Metropolitana de Santiago",
    comuna: "La Florida",
    isVerified: false,
  },
]

const FAKE_SEEKERS = [
  {
    clerkId: "seed_sk_001",
    firstName: "Juan",
    lastName: "Pérez Contreras",
    phone: "+56 9 1234 5678",
    forSelf: false,
    elderFirstName: "Elena",
    elderLastName: "Contreras",
    elderAge: 78,
    elderCondition: "Artritis severa en rodillas y manos. Requiere ayuda para levantarse, bañarse y preparar comidas. Toma 4 medicamentos diarios.",
    region: "Metropolitana de Santiago",
    comuna: "Providencia",
    requestMessage: "Buenos días, mi madre Elena necesita cuidado durante el día mientras yo trabajo. Es una persona dulce y tranquila. ¿Podría contarme sobre su experiencia con artritis?",
    requestStatus: "PENDING" as const,
  },
  {
    clerkId: "seed_sk_002",
    firstName: "María José",
    lastName: "García Rojas",
    phone: "+56 9 9876 5432",
    forSelf: false,
    elderFirstName: "Roberto",
    elderLastName: "García",
    elderAge: 82,
    elderCondition: "Diagnóstico reciente de demencia leve. Aún reconoce a su familia pero tiene episodios de confusión. Necesita supervisión constante y actividades de estimulación cognitiva.",
    region: "Metropolitana de Santiago",
    comuna: "Las Condes",
    requestMessage: null,
    requestStatus: "PENDING" as const,
  },
  {
    clerkId: "seed_sk_003",
    firstName: "Carolina",
    lastName: "Fuentes Vidal",
    phone: "+56 9 8765 4321",
    forSelf: true,
    region: "Metropolitana de Santiago",
    comuna: "Maipú",
    requestMessage: "Hola, tengo 71 años y busco compañía y apoyo para salir a mis controles médicos. Soy bastante independiente pero me cuesta caminar largas distancias.",
    requestStatus: "ACCEPTED" as const,
  },
  {
    clerkId: "seed_sk_004",
    firstName: "Pedro",
    lastName: "Soto Alvarez",
    phone: "+56 9 7654 3210",
    forSelf: false,
    elderFirstName: "Inés",
    elderLastName: "Alvarez",
    elderAge: 85,
    elderCondition: "Secuelas de accidente cerebrovascular. Dificultad para caminar y hablar. Requiere cuidados intensivos y rehabilitación diaria.",
    region: "Metropolitana de Santiago",
    comuna: "Santiago",
    requestMessage: "Mi abuela necesita cuidado especializado, idealmente alguien con experiencia en ACV. Vivimos en el centro de Santiago.",
    requestStatus: "REJECTED" as const,
  },
  {
    clerkId: "seed_sk_005",
    firstName: "Francisca",
    lastName: "Rojas Muñoz",
    phone: "+56 9 6543 2198",
    forSelf: false,
    elderFirstName: "Carlos",
    elderLastName: "Rojas",
    elderAge: 74,
    elderCondition: "Parkinson leve. Temblor en manos, lentitud para moverse. Necesita ayuda para actividades físicas pero está mentalmente muy lúcido.",
    region: "Metropolitana de Santiago",
    comuna: "Vitacura",
    requestMessage: "Mi esposo tiene Parkinson y busco apoyo en las mañanas. Es muy activo mentalmente.",
    requestStatus: "PENDING" as const,
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

async function upsertCaregiverUser(data: (typeof FAKE_CAREGIVERS)[0]) {
  const user = await prisma.user.upsert({
    where: { clerkId: data.clerkId },
    create: { clerkId: data.clerkId, role: "CAREGIVER" },
    update: {},
  })

  await prisma.caregiverProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      bio: data.bio,
      profileType: data.profileType,
      title: data.title ?? null,
      yearsExperience: data.yearsExperience,
      availability: data.availability,
      region: data.region,
      comuna: data.comuna,
      isVerified: data.isVerified,
      isActive: true,
    },
    update: { isActive: true },
  })

  return user
}

async function upsertSeekerUser(data: (typeof FAKE_SEEKERS)[0]) {
  const user = await prisma.user.upsert({
    where: { clerkId: data.clerkId },
    create: { clerkId: data.clerkId, role: "SEEKER" },
    update: {},
  })

  await prisma.seekerProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      forSelf: data.forSelf,
      elderFirstName: "elderFirstName" in data ? data.elderFirstName ?? null : null,
      elderLastName: "elderLastName" in data ? data.elderLastName ?? null : null,
      elderAge: "elderAge" in data ? data.elderAge ?? null : null,
      elderCondition: "elderCondition" in data ? data.elderCondition ?? null : null,
      region: data.region,
      comuna: data.comuna,
    },
    update: {},
  })

  return user
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed...")

  // 1. Crear cuidadores ficticios
  console.log("  → Creando 8 cuidadores ficticios...")
  for (const cg of FAKE_CAREGIVERS) {
    await upsertCaregiverUser(cg)
    process.stdout.write(".")
  }
  console.log(" ✓")

  // 2. Crear buscadores ficticios
  console.log("  → Creando 5 buscadores ficticios...")
  const seekerUsers: { user: Awaited<ReturnType<typeof upsertSeekerUser>>; data: (typeof FAKE_SEEKERS)[0] }[] = []
  for (const sk of FAKE_SEEKERS) {
    const user = await upsertSeekerUser(sk)
    seekerUsers.push({ user, data: sk })
    process.stdout.write(".")
  }
  console.log(" ✓")

  // 3. Crear solicitudes hacia todos los cuidadores reales existentes
  const realCaregivers = await prisma.user.findMany({
    where: {
      role: "CAREGIVER",
      clerkId: { not: { startsWith: "seed_" } },
      caregiverProfile: { isNot: null },
    },
  })

  if (realCaregivers.length > 0) {
    console.log(`  → Creando solicitudes hacia ${realCaregivers.length} cuidador(es) real(es)...`)
    for (const caregiver of realCaregivers) {
      for (const { user: seeker, data } of seekerUsers) {
        const exists = await prisma.contactRequest.findFirst({
          where: { seekerId: seeker.id, caregiverId: caregiver.id },
        })
        if (!exists) {
          await prisma.contactRequest.create({
            data: {
              seekerId: seeker.id,
              caregiverId: caregiver.id,
              status: data.requestStatus,
              message: data.requestMessage ?? null,
            },
          })
        }
      }
      process.stdout.write(".")
    }
    console.log(" ✓")
  } else {
    console.log("  ℹ  No hay cuidadores reales en la DB — las solicitudes se omiten.")
    console.log("     Regístrate como cuidador primero y vuelve a ejecutar el seed.")
  }

  const totalCaregivers = await prisma.caregiverProfile.count()
  const totalRequests = await prisma.contactRequest.count()
  console.log(`\n✅ Seed completado:`)
  console.log(`   Cuidadores en DB: ${totalCaregivers}`)
  console.log(`   Solicitudes en DB: ${totalRequests}`)
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
