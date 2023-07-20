/*
  Warnings:

  - Made the column `desc` on table `MetaEnum` required. This step will fail if there are existing NULL values in that column.
  - Made the column `desc` on table `MetaEnumItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `desc` on table `MetaField` required. This step will fail if there are existing NULL values in that column.
  - Made the column `desc` on table `MetaStruct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MetaEnum" ALTER COLUMN "desc" SET NOT NULL,
ALTER COLUMN "desc" SET DEFAULT '';

-- AlterTable
ALTER TABLE "MetaEnumItem" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "desc" SET NOT NULL;

-- AlterTable
ALTER TABLE "MetaField" ALTER COLUMN "desc" SET NOT NULL,
ALTER COLUMN "desc" SET DEFAULT '';

-- AlterTable
ALTER TABLE "MetaStruct" ALTER COLUMN "desc" SET NOT NULL,
ALTER COLUMN "desc" SET DEFAULT '';
