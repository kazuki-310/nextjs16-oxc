/*
  Warnings:

  - You are about to drop the column `isTemporaryPassword` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employees` DROP COLUMN `isTemporaryPassword`,
    ADD COLUMN `passwordChanged` BOOLEAN NOT NULL DEFAULT false;
