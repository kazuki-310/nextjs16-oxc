-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `accessToken` VARCHAR(191) NULL,
    ADD COLUMN `accessTokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `idToken` VARCHAR(191) NULL,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    ADD COLUMN `refreshTokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `scope` VARCHAR(191) NULL;
