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

/**
 * MetaEnum
 */
export const MetaEnumSchema = z.object({
  name: z.string().min(1).max(64),
  desc: z.string().max(256),
})
export type MetaEnumSchema = z.infer<typeof MetaEnumSchema>
export const MetaEnumRecSchema = z
  .object({ id: z.number() })
  .merge(MetaEnumSchema)
export type MetaEnumRecSchema = z.infer<typeof MetaEnumRecSchema>

/**
 * MetaEnumItem
 */
export const MetaEnumItemSchema = MetaEnumSchema
export type MetaEnumItemSchema = z.infer<typeof MetaEnumItemSchema>
export const MetaEnumItemRecSchema = z
  .object({ id: z.number() })
  .merge(MetaEnumItemSchema)
export type MetaEnumItemRecSchema = z.infer<typeof MetaEnumItemRecSchema>

/**
 * MetaEnumPatch
 */
export const MetaEnumPatchSchema = z.object({
  self: MetaEnumSchema.optional(),
  addItem: MetaEnumItemSchema.optional(),
  updateItem: MetaEnumItemRecSchema.optional(),
  deleteItem: z.number().optional(),
})
export type MetaEnumPatchSchema = z.infer<typeof MetaEnumPatchSchema>
