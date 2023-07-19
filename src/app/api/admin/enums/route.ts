import { NextRequest, NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"
import { CreateMetaEnumSchema } from "@/lib/schema"

async function getMetaEnumList() {
  return await prisma.metaEnum.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export type MetaEnumList = Prisma.PromiseReturnType<typeof getMetaEnumList>

export async function GET() {
  const enums = await getMetaEnumList()
  return NextResponse.json(enums)
}

export async function POST(req: NextRequest) {
  const params = CreateMetaEnumSchema.parse(await req.json())
  const me = await prisma.metaEnum.create({
    data: {
      name: params.name,
    },
  })
  return new NextResponse()
}
