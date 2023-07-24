-- CreateEnum
CREATE TYPE "MetaFieldType" AS ENUM ('Int', 'Float', 'String', 'Enum', 'Ref');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isAdmin" BOOLEAN,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "MetaEnum" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "MetaEnum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaEnumItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "MetaEnumItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaStruct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "MetaStruct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
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
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "metaId" INTEGER NOT NULL,

    CONSTRAINT "DataStruct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataField" (
    "id" SERIAL NOT NULL,
    "metaId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "valueInt" INTEGER,
    "valueFloat" DOUBLE PRECISION,
    "valueString" TEXT,
    "valueEnumId" INTEGER,
    "valueRefId" INTEGER,
    "arrayId" INTEGER,

    CONSTRAINT "DataField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "MetaEnum_name_key" ON "MetaEnum"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MetaStruct_name_key" ON "MetaStruct"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DataStruct_name_key" ON "DataStruct"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_valueEnumId_fkey" FOREIGN KEY ("valueEnumId") REFERENCES "MetaEnumItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_valueRefId_fkey" FOREIGN KEY ("valueRefId") REFERENCES "DataStruct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
