import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { CreateMetaEnumSchema } from "@/lib/schema"

export async function GET() {
  const enums = await prisma.metaEnum.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return NextResponse.json(enums)
}

export async function POST(req: NextRequest) {
  const params = CreateMetaEnumSchema.parse(await req.json())
  const me = await prisma.metaEnum.create({
    data: {
      name: params.name,
    },
  })
  return NextResponse.json(me)
}
