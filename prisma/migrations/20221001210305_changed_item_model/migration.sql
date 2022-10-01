/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "subCategoryId",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "subCategoryIdItem" INTEGER;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_subCategoryIdItem_fkey" FOREIGN KEY ("subCategoryIdItem") REFERENCES "sub-categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
