export type {
  User,
  SeekerProfile,
  CaregiverProfile,
  ContactRequest,
  Role,
  CaregiverType,
  Availability,
  RequestStatus,
} from "@/generated/prisma"

import type { User, SeekerProfile, CaregiverProfile, ContactRequest } from "@/generated/prisma"

export type CaregiverWithProfile = User & {
  caregiverProfile: CaregiverProfile
}

export type SeekerWithProfile = User & {
  seekerProfile: SeekerProfile
}

export type ContactRequestWithRelations = ContactRequest & {
  seeker: SeekerWithProfile
  caregiver: CaregiverWithProfile
}
