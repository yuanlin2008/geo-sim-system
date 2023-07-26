-- DropForeignKey
ALTER TABLE "MetaField" DROP CONSTRAINT "MetaField_typeEnumId_fkey";

-- DropForeignKey
ALTER TABLE "MetaField" DROP CONSTRAINT "MetaField_typeStructId_fkey";

-- AddForeignKey
ALTER TABLE "MetaField" ADD CONSTRAINT "MetaField_typeEnumId_fkey" FOREIGN KEY ("typeEnumId") REFERENCES "MetaEnum"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "MetaField" ADD CONSTRAINT "MetaField_typeStructId_fkey" FOREIGN KEY ("typeStructId") REFERENCES "MetaStruct"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
