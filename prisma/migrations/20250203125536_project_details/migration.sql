/*
  Warnings:

  - You are about to drop the column `name` on the `Portfolio` table. All the data in the column will be lost.
  - Added the required column `details` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "details" TEXT NOT NULL;
