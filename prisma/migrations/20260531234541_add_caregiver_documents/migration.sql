-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('TITLE', 'DIPLOMA', 'COURSE', 'CERTIFICATE', 'OTHER');

-- CreateTable
CREATE TABLE "CaregiverDocument" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaregiverDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CaregiverDocument" ADD CONSTRAINT "CaregiverDocument_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "CaregiverProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
