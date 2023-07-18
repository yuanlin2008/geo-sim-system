-- CreateEnum
CREATE TYPE "MetaFieldType" AS ENUM ('Int', 'Float', 'String', 'Enum', 'Ref');

-- CreateTable
CREATE TABLE "MetaEnum" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MetaEnum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaEnumItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "MetaEnumItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaStruct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MetaStruct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "type" "MetaFieldType" NOT NULL,
    "typeEnumId" INTEGER,
    "typeStructId" INTEGER,
    "isArray" BOOLEAN,

    CONSTRAINT "MetaField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataStruct" (
    "id" SERIAL NOT NULL,
    "metaId" INTEGER NOT NULL,

    CONSTRAINT "DataStruct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataField" (
    "id" SERIAL NOT NULL,
    "metaId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "arrayId" INTEGER,
    "intValue" INTEGER,
    "floatValue" DOUBLE PRECISION,
    "stringValue" TEXT,
    "enumValueId" INTEGER,
    "refValueId" INTEGER,

    CONSTRAINT "DataField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetaEnum_name_key" ON "MetaEnum"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MetaStruct_name_key" ON "MetaStruct"("name");

-- AddForeignKey
ALTER TABLE "MetaEnumItem" ADD CONSTRAINT "MetaEnumItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "MetaEnum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaField" ADD CONSTRAINT "MetaField_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "MetaStruct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaField" ADD CONSTRAINT "MetaField_typeEnumId_fkey" FOREIGN KEY ("typeEnumId") REFERENCES "MetaEnum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaField" ADD CONSTRAINT "MetaField_typeStructId_fkey" FOREIGN KEY ("typeStructId") REFERENCES "MetaStruct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataStruct" ADD CONSTRAINT "DataStruct_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "MetaStruct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "MetaField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "DataStruct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_enumValueId_fkey" FOREIGN KEY ("enumValueId") REFERENCES "MetaEnumItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_refValueId_fkey" FOREIGN KEY ("refValueId") REFERENCES "DataStruct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
