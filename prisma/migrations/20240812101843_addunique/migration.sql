/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_postId_key" ON "Cart"("userId", "postId");
