/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_productId_fkey`;

-- DropIndex
DROP INDEX `orders_productId_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    DROP COLUMN `productId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `canceledAt` DATETIME(3) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
