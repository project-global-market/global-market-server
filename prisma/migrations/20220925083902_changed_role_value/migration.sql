/*
  Warnings:

  - The values [SUPER_ADMIN,ADMIN,MODERATOR,USER] on the enum `RoleValue` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleValue_new" AS ENUM ('SuperAdmin', 'Admin', 'Moderator', 'User');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "RoleValue_new" USING ("role"::text::"RoleValue_new");
ALTER TYPE "RoleValue" RENAME TO "RoleValue_old";
ALTER TYPE "RoleValue_new" RENAME TO "RoleValue";
DROP TYPE "RoleValue_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'User';
