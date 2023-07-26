import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { MetaDataOperation } from "@/lib/schema"

export async function GET() {
  const r = await Promise.all([
    prisma.metaEnumItem.findMany(),
    prisma.metaEnum.findMany(),
    prisma.metaField.findMany(),
    prisma.metaStruct.findMany(),
  ])
  return NextResponse.json({
    metaEnumItems: r[0],
    metaEnums: r[1],
    metaFields: r[2],
    metaStructs: r[3],
  })
}

async function handler(op: MetaDataOperation) {
  switch (op.type) {
    case "createEnumItem": {
      const r = await prisma.metaEnumItem.create({
        data: { ...op.input, ownerId: op.ownerId },
      })
      return NextResponse.json(r)
    }
    case "updateEnumItem": {
      await prisma.metaEnumItem.update({
        where: { id: op.id },
        data: { ...op.input },
      })
      return new NextResponse()
    }
    case "deleteEnumItem": {
      await prisma.metaEnumItem.delete({
        where: { id: op.id },
      })
      return new NextResponse()
    }
    case "createEnum": {
      const r = await prisma.metaEnum.create({
        data: { ...op.input },
      })
      return NextResponse.json(r)
    }
    case "updateEnum": {
      await prisma.metaEnum.update({
        where: { id: op.id },
        data: { ...op.input },
      })
      return new NextResponse()
    }
    case "deleteEnum": {
      await prisma.metaEnum.delete({
        where: { id: op.id },
      })
      return new NextResponse()
    }
    case "createField": {
      const r = await prisma.metaField.create({
        data: { ...op.input, ownerId: op.ownerId },
      })
      return NextResponse.json(r)
    }
    case "updateField": {
      await prisma.metaField.update({
        where: { id: op.id },
        data: { ...op.input },
      })
      return new NextResponse()
    }
    case "deleteField": {
      await prisma.metaField.delete({
        where: { id: op.id },
      })
      return new NextResponse()
    }
    case "createStruct": {
      const r = await prisma.metaStruct.create({
        data: { ...op.input },
      })
      return NextResponse.json(r)
    }
    case "updateStruct": {
      await prisma.metaStruct.update({
        where: { id: op.id },
        data: { ...op.input },
      })
      return new NextResponse()
    }
    case "deleteStruct": {
      await prisma.metaStruct.delete({
        where: { id: op.id },
      })
      return new NextResponse()
    }
  }
}

export async function POST(req: NextRequest) {
  const op = MetaDataOperation.parse(await req.json())
  try {
    return handler(op)
  } catch (e) {
    return new NextResponse(null, { status: 500 })
  }
}
