/*
  Warnings:

  - You are about to drop the column `image` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `employees` DROP COLUMN `image`,
    MODIFY `emailVerified` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;
