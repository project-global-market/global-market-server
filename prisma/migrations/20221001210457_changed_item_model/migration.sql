/*
  Warnings:

  - You are about to drop the column `subCategoryIdItem` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_subCategoryIdItem_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "subCategoryIdItem",
ADD COLUMN     "subCategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub-categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
