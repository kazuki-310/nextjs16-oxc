-- AlterTable
ALTER TABLE `employees` MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `employees_email_key` ON `employees`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `employees_nickname_key` ON `employees`(`nickname`);
