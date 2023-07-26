/*
  Warnings:

  - Made the column `valueInt` on table `DataField` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valueFloat` on table `DataField` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valueString` on table `DataField` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrayId` on table `DataField` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isArray` on table `MetaField` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataField" ALTER COLUMN "valueInt" SET NOT NULL,
ALTER COLUMN "valueFloat" SET NOT NULL,
ALTER COLUMN "valueString" SET NOT NULL,
ALTER COLUMN "arrayId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MetaField" ALTER COLUMN "isArray" SET NOT NULL;
