-- CreateTable
CREATE TABLE `tokenblacklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tokenblacklist_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
