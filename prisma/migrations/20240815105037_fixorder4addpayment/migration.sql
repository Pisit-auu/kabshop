/*
  Warnings:

  - Added the required column `postId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trakingId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postId" INTEGER NOT NULL,
ADD COLUMN     "trakingId" INTEGER NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "trakingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" INTEGER NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
