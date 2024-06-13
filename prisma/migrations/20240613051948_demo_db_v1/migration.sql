-- CreateTable
CREATE TABLE `users` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NULL,
    `Username` VARCHAR(255) NULL,
    `Email` VARCHAR(255) NULL,
    `PasswordHash` VARCHAR(255) NULL,
    `Role` ENUM('Admin', 'Manager', 'User') NOT NULL,
    `UserVerified` BOOLEAN NULL DEFAULT false,
    `Status` ENUM('Active', 'Inactive') NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_Username_key`(`Username`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
