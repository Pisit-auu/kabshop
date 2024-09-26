/*
  Warnings:

  - You are about to drop the column `orderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `priceall` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping` on the `Order` table. All the data in the column will be lost.
  - Added the required column `trackId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderId",
DROP COLUMN "priceall",
DROP COLUMN "shipping",
ADD COLUMN     "trackId" INTEGER NOT NULL;
