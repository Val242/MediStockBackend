/*
  Warnings:

  - You are about to drop the column `drug_id` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacy_id` on the `Stock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[drugId,pharmacyId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `drugId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharmacyId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_drug_id_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_pharmacy_id_fkey";

-- DropIndex
DROP INDEX "Stock_drug_id_pharmacy_id_key";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "drug_id",
DROP COLUMN "pharmacy_id",
ADD COLUMN     "drugId" INTEGER NOT NULL,
ADD COLUMN     "pharmacyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_drugId_pharmacyId_key" ON "Stock"("drugId", "pharmacyId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
