/*
  Warnings:

  - Changed the type of `referenceType` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('POST', 'COMMENT', 'FRIENDS');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "referenceType",
ADD COLUMN     "referenceType" "ReferenceType" NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_referenceId_referenceType_idx" ON "Notification"("referenceId", "referenceType");
