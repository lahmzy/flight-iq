/*
  Warnings:

  - You are about to drop the `aircraft_airlines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `airlines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "aircraft_airlines" DROP CONSTRAINT "aircraft_airlines_aircraft_id_fkey";

-- DropForeignKey
ALTER TABLE "aircraft_airlines" DROP CONSTRAINT "aircraft_airlines_airline_id_fkey";

-- AlterTable
ALTER TABLE "aircraft" ADD COLUMN     "operator_name" TEXT;

-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "import_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "raw_report" JSONB,
ADD COLUMN     "source_version" TEXT;

-- DropTable
DROP TABLE "aircraft_airlines";

-- DropTable
DROP TABLE "airlines";

-- CreateIndex
CREATE INDEX "aircraft_operator_name_idx" ON "aircraft"("operator_name");
