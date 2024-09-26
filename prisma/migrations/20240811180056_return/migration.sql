/*
  Warnings:

  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShoppingCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_id_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_postId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_id_fkey";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "ShoppingCart";
