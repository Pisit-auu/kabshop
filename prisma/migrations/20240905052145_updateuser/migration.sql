/*
  Warnings:

  - Made the column `purchaseamount` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "purchaseamount" SET NOT NULL,
ALTER COLUMN "purchaseamount" SET DEFAULT 0;
