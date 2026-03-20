/*
  Warnings:

  - You are about to drop the column `passwordChanged` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employees` DROP COLUMN `passwordChanged`,
    ADD COLUMN `isTemporaryPassword` BOOLEAN NOT NULL DEFAULT true;
