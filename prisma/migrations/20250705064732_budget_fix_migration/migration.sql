/*
  Warnings:

  - Added the required column `category` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `budget` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" TEXT NOT NULL,
DROP COLUMN "budget",
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "skills" TEXT[];
