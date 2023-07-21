import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import {
  MetaEnumItemRecSchema,
  MetaEnumPatchSchema,
  ParamIDSchema,
} from "@/lib/schema"

export async function DELETE(req: NextRequest, context: ParamIDSchema) {
  const { params } = ParamIDSchema.parse(context)
  await prisma.metaEnum.delete({
    where: { id: +params.id },
  })
  return new NextResponse(null)
}

export async function GET(req: NextRequest, context: ParamIDSchema) {
  const { params } = ParamIDSchema.parse(context)
  const e: MetaEnumItemRecSchema[] = await prisma.metaEnumItem.findMany({
    where: { ownerId: +params.id },
  })
  return NextResponse.json(e)
}

export async function PATCH(req: NextRequest, context: ParamIDSchema) {
  const { params } = ParamIDSchema.parse(context)
  const id = +params.id
  const updateParams = MetaEnumPatchSchema.parse(await req.json())
  if (updateParams.self) {
    await prisma.metaEnum.update({
      where: { id: id },
      data: { ...updateParams.self },
    })
  }
  if (updateParams.addItem) {
    await prisma.metaEnumItem.create({
      data: { ownerId: id, ...updateParams.addItem },
    })
  }
  if (updateParams.updateItem) {
    await prisma.metaEnumItem.update({
      where: { id: updateParams.updateItem.id },
      data: { ...updateParams.updateItem },
    })
  }
  if (updateParams.deleteItem) {
    await prisma.metaEnumItem.delete({
      where: { id: updateParams.deleteItem },
    })
  }
  return new NextResponse(null)
}
