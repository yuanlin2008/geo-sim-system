import type { Prisma } from "@prisma/client"
import { z } from "zod"

export const UserLoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(64),
})
export type UserLoginSchema = z.infer<typeof UserLoginSchema>

export const ParamIDSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})
export type ParamIDSchema = z.infer<typeof ParamIDSchema>

const NameSchema = z.string().min(1).max(64)
const DescSchema = z.string().max(256)
/**
 * MetaEnumInput
 */
export const MetaEnumInput = z.object({
  name: NameSchema,
  desc: DescSchema,
}) satisfies z.ZodType<Prisma.MetaEnumUncheckedUpdateInput>
export type MetaEnumInput = z.infer<typeof MetaEnumInput>

/**
 * MetaEnumItemInput
 */
export const MetaEnumItemInput = z.object({
  name: NameSchema,
  desc: DescSchema,
}) satisfies z.ZodType<Prisma.MetaEnumItemUncheckedUpdateInput>
export type MetaEnumItemInput = z.infer<typeof MetaEnumItemInput>

/**
 * MetaStructInput
 */
export const MetaStructInput = z.object({
  name: NameSchema,
  desc: DescSchema,
}) satisfies z.ZodType<Prisma.MetaStructUncheckedUpdateInput>
export type MetaStructInput = z.infer<typeof MetaStructInput>

/**
 * MetaFieldInput
 */
export const MetaFieldInput = z.object({
  name: NameSchema,
  desc: DescSchema,
  type: z.enum(["Int", "Float", "String", "Enum", "Ref"]),
  typeEnumId: z.number().nullable(),
  typeStructId: z.number().nullable(),
  isArray: z.boolean(),
}) satisfies z.ZodType<Prisma.MetaFieldUncheckedUpdateInput>
export type MetaFieldInput = z.infer<typeof MetaFieldInput>

/**
 * MetaDataOperation
 */
export const MetaDataOperation = z.union([
  z.object({
    type: z.literal("createEnum"),
    input: MetaEnumInput,
  }),
  z.object({
    type: z.literal("deleteEnum"),
    id: z.number(),
  }),
  z.object({
    type: z.literal("updateEnum"),
    id: z.number(),
    input: MetaEnumInput,
  }),
  z.object({
    type: z.literal("createEnumItem"),
    ownerId: z.number(),
    input: MetaEnumItemInput,
  }),
  z.object({
    type: z.literal("updateEnumItem"),
    id: z.number(),
    input: MetaEnumItemInput,
  }),
  z.object({
    type: z.literal("deleteEnumItem"),
    id: z.number(),
  }),
  z.object({
    type: z.literal("createField"),
    ownerId: z.number(),
    input: MetaFieldInput,
  }),
  z.object({
    type: z.literal("updateField"),
    id: z.number(),
    input: MetaFieldInput,
  }),
  z.object({
    type: z.literal("deleteField"),
    id: z.number(),
  }),
  z.object({
    type: z.literal("createStruct"),
    input: MetaStructInput,
  }),
  z.object({
    type: z.literal("updateStruct"),
    id: z.number(),
    input: MetaStructInput,
  }),
  z.object({
    type: z.literal("deleteStruct"),
    id: z.number(),
  }),
])
export type MetaDataOperation = z.infer<typeof MetaDataOperation>
