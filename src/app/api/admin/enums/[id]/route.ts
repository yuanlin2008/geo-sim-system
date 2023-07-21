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
    where: {
      id: +params.id,
    },
  })
  return new NextResponse(null)
}

export async function GET(req: NextRequest, context: ParamIDSchema) {
  const { params } = ParamIDSchema.parse(context)
  const e: MetaEnumItemRecSchema[] = await prisma.metaEnumItem.findMany({
    where: {
      ownerId: +params.id,
    },
  })
  return NextResponse.json(e)
}

export async function PATCH(req: NextRequest, context: ParamIDSchema) {
  const { params } = ParamIDSchema.parse(context)
  const id = +params.id
  const updateParams = MetaEnumPatchSchema.parse(await req.json())
  if (updateParams.self) {
    await prisma.metaEnum.update({
      where: {
        id: id,
      },
      data: {
        name: updateParams.self.name,
        desc: updateParams.self.desc,
      },
    })
  }
  if (updateParams.addItem) {
    await prisma.metaEnumItem.create({
      data: {
        ownerId: id,
        name: updateParams.addItem.name,
        desc: updateParams.addItem.desc,
      },
    })
  }
  if (updateParams.updateItem) {
    await prisma.metaEnumItem.update({
      where: {
        id: updateParams.updateItem.id,
      },
      data: {
        name: updateParams.updateItem.name,
        desc: updateParams.updateItem.desc,
      },
    })
  }
  if (updateParams.deleteItem) {
    await prisma.metaEnumItem.delete({
      where: {
        id: updateParams.deleteItem,
      },
    })
  }
  return new NextResponse(null)
}
