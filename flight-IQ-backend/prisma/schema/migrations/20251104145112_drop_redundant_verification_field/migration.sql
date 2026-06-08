/*
  Warnings:

  - You are about to drop the column `is_account_setup_completed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_mail_verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_account_setup_completed",
DROP COLUMN "is_mail_verified";
