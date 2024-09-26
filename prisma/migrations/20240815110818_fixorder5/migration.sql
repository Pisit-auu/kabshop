/*
  Warnings:

  - You are about to drop the column `trakingId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "trakingId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "payment";
