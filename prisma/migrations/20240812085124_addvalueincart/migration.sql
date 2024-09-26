/*
  Warnings:

  - Added the required column `value` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "value" INTEGER NOT NULL;
