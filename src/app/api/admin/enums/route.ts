import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { MetaEnumRecSchema, MetaEnumSchema } from "@/lib/schema"

export async function GET() {
  const enums: MetaEnumRecSchema[] = await prisma.metaEnum.findMany({
    select: {
      id: true,
      name: true,
      desc: true,
    },
  })
  return NextResponse.json(enums)
}

export async function POST(req: NextRequest) {
  const params = MetaEnumSchema.parse(await req.json())
  const me = await prisma.metaEnum.create({
    data: {
      name: params.name,
    },
  })
  return new NextResponse()
}
