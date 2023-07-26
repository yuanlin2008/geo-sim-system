-- DropForeignKey
ALTER TABLE "DataField" DROP CONSTRAINT "DataField_valueEnumId_fkey";

-- DropForeignKey
ALTER TABLE "DataField" DROP CONSTRAINT "DataField_valueRefId_fkey";

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_valueEnumId_fkey" FOREIGN KEY ("valueEnumId") REFERENCES "MetaEnumItem"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_valueRefId_fkey" FOREIGN KEY ("valueRefId") REFERENCES "DataStruct"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
