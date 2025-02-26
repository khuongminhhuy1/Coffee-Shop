-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `users` MODIFY `avatar` VARCHAR(191) NULL DEFAULT 'https://i.imgur.com/0rkAIrI.png';
