/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_Email_key` ON `users`(`Email`);
