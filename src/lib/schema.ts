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

export const NameDescSchema = z.object({
  name: z.string().min(1).max(64),
  desc: z.string().max(256),
})
export type NameDescSchema = z.infer<typeof NameDescSchema>

export const IDNameDescSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(64),
  desc: z.string().max(256),
})
export type IDNameDescSchema = z.infer<typeof IDNameDescSchema>

export const MetaEnumPatchSchema = z.object({
  self: NameDescSchema.optional(),
  addItem: NameDescSchema.optional(),
  updateItem: IDNameDescSchema.optional(),
  deleteItem: z.number().optional(),
})
export type MetaEnumPatchSchema = z.infer<typeof MetaEnumPatchSchema>
