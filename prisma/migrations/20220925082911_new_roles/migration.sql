-- CreateEnum
CREATE TYPE "RoleValue" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "RoleValue" NOT NULL DEFAULT 'USER';
